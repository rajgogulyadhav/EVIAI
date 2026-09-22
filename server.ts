import express from 'express';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { sessionStore } from './src/server/sessionStore.js';
import { createTeamTechWarriorsPresentation } from './src/server/samplePresentation.js';
import { parseUploadedDocument } from './src/server/documentParser.js';
import { InMemoryRAGEngine } from './src/server/ragEngine.js';
import { synthesizeAnswer } from './src/server/geminiService.js';
import { AskResponse, DocumentContentMapItem } from './src/types/index.js';

dotenv.config();

const PORT = 3000;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB explicit configured limit

// In-memory active RAG engines mapped to session IDs
const ragEngines = new Map<string, InMemoryRAGEngine>();

// Configure Multer for in-memory upload (no disk persistence)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx' || ext === '.doc' || ext === '.pptx' || ext === '.ppt') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. EVIAI accepts PDF (.pdf), Presentation (.pptx), and Word (.docx) documents.'));
    }
  },
});

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Helper: Pre-load the Team Tech Warriors presentation into a default demo session
  const defaultDemoId = 'demo-team-tech-warriors';
  const defaultDemoData = createTeamTechWarriorsPresentation(defaultDemoId);
  sessionStore.set(defaultDemoId, defaultDemoData);
  ragEngines.set(defaultDemoId, new InMemoryRAGEngine(defaultDemoData));

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'EVIAI - Evidence Intelligence AI',
      activeSessions: sessionStore.getAllMetadata().length,
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
      maxFileSizeMB: 50,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Load Demo Document (Team Tech Warriors Presentation)
  app.post('/api/demo/load', (req, res) => {
    try {
      const sessionId = `demo-${Date.now()}`;
      const demoData = createTeamTechWarriorsPresentation(sessionId);
      sessionStore.set(sessionId, demoData);
      ragEngines.set(sessionId, new InMemoryRAGEngine(demoData));

      res.json({
        success: true,
        documentId: sessionId,
        metadata: demoData.metadata,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to load demo document' });
    }
  });

  // Upload Document (PDF / DOCX)
  app.post('/api/upload', upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No document file provided.' });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      // Real parse
      const docData = await parseUploadedDocument(fileBuffer, fileName, (stage, progress, action) => {
        // Can be queried via status endpoint
      });

      // Store in memory
      sessionStore.set(docData.metadata.id, docData);
      ragEngines.set(docData.metadata.id, new InMemoryRAGEngine(docData));

      res.status(201).json({
        success: true,
        documentId: docData.metadata.id,
        metadata: docData.metadata,
      });
    } catch (err: any) {
      console.error('[EVIAI Upload Error]:', err);
      res.status(400).json({
        error: err?.message || 'EVIAI could not extract reliable evidence from this file.',
      });
    }
  });

  // Get Document Processing Status
  app.get('/api/document/:id/status', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document session not found or expired.' });
    }
    res.json({
      id: docData.metadata.id,
      status: docData.metadata.status,
      progress: docData.metadata.progress,
      currentAction: docData.metadata.currentAction,
      errorMessage: docData.metadata.errorMessage,
    });
  });

  // Get Document Overview & Content Map
  app.get('/api/document/:id/overview', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document session not found or expired.' });
    }

    const contentMap: DocumentContentMapItem[] = docData.pages.map((p) => ({
      pageNumber: p.pageNumber,
      title: p.title || `Page ${p.pageNumber}`,
      sections: p.sections,
      imagesCount: p.imagesCount,
      tablesCount: p.tablesCount,
      chartsCount: p.chartsCount,
      summaryPreview: p.text.substring(0, 110) + '...',
    }));

    res.json({
      metadata: docData.metadata,
      contentMap,
    });
  });

  // Get Pages
  app.get('/api/document/:id/pages', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    res.json({ pages: docData.pages });
  });

  // Get Images
  app.get('/api/document/:id/images', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    res.json({ images: docData.images });
  });

  // Get Tables
  app.get('/api/document/:id/tables', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    res.json({ tables: docData.tables });
  });

  // Get Charts
  app.get('/api/document/:id/charts', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    res.json({ charts: docData.charts });
  });

  // Search Document (Exact Keyword + Semantic Search)
  app.post('/api/document/:id/search', (req, res) => {
    const { keyword } = req.body;
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      return res.status(400).json({ error: 'Search keyword is required.' });
    }

    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    let ragEngine = ragEngines.get(req.params.id);
    if (!ragEngine) {
      ragEngine = new InMemoryRAGEngine(docData);
      ragEngines.set(req.params.id, ragEngine);
    }

    const searchResponse = ragEngine.searchDocument(keyword);
    res.json(searchResponse);
  });

  // Ask Question / Ask from Region (Evidence-grounded RAG)
  app.post('/api/document/:id/ask', async (req, res) => {
    const { question, regionContext, history } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question text is required.' });
    }

    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    let ragEngine = ragEngines.get(req.params.id);
    if (!ragEngine) {
      ragEngine = new InMemoryRAGEngine(docData);
      ragEngines.set(req.params.id, ragEngine);
    }

    try {
      let queryForRetrieval = question;
      if (regionContext) {
        queryForRetrieval = `${question} ${regionContext.preview}`;
      } else if (history && Array.isArray(history) && history.length > 0) {
        // Resolve contextual pronouns in follow-up queries
        const lastUserTurn = [...history].reverse().find((h: any) => h.role === 'user');
        if (lastUserTurn && /\b(this|that|it|they|them|these|affected|says that|which page)\b/i.test(question)) {
          queryForRetrieval = `${question} ${lastUserTurn.text}`;
        }
      }

      // Hybrid Retrieval
      const { evidence, confidence } = ragEngine.retrieveEvidence(queryForRetrieval, 4);

      // LLM / Multimodal Evidence Synthesis
      const synthesisResult = await synthesizeAnswer({
        question,
        evidenceList: evidence,
        confidence,
        totalDocumentPages: docData.metadata.pageCount,
        totalImages: docData.images.length,
        totalTables: docData.tables.length,
        totalCharts: docData.charts.length,
        regionContext,
        history,
      });

      const primarySource = evidence[0] || {
        pageNumber: 1,
        section: 'General Document',
        elementRef: 'Full Document Context',
      };

      const askResponse: AskResponse = {
        answer: synthesisResult.answer,
        evidenceSummary: synthesisResult.evidenceSummary,
        evidenceList: evidence,
        confidence,
        sourceLocation: {
          pageNumber: primarySource.pageNumber,
          section: primarySource.section,
          element: primarySource.elementRef,
        },
        detectedLanguage: synthesisResult.detectedLanguage,
        question,
        regionContext,
      };

      res.json(askResponse);
    } catch (err: any) {
      console.error('[EVIAI Ask Error]:', err);
      res.status(500).json({
        error: 'EVIAI could not process the question against the extracted evidence.',
      });
    }
  });

  // Get Specific Evidence Item
  app.get('/api/document/:id/evidence/:evidenceId', (req, res) => {
    const docData = sessionStore.get(req.params.id);
    if (!docData) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const evidenceId = req.params.evidenceId;
    // Check if it matches an image
    const img = docData.images.find((i) => i.id === evidenceId || `img-${i.imageNumber}` === evidenceId);
    if (img) return res.json({ type: 'image', data: img });

    // Check if it matches a table
    const tbl = docData.tables.find((t) => t.id === evidenceId || `tbl-${t.tableNumber}` === evidenceId);
    if (tbl) return res.json({ type: 'table', data: tbl });

    // Check if it matches a chart
    const chart = docData.charts.find((c) => c.id === evidenceId || `chart-${c.chartNumber}` === evidenceId);
    if (chart) return res.json({ type: 'chart', data: chart });

    // Check chunks
    const chunk = docData.chunks.find((c) => c.id === evidenceId);
    if (chunk) return res.json({ type: 'text', data: chunk });

    res.status(404).json({ error: 'Evidence item not found.' });
  });

  // Delete Document (Session Cleanup - No Persistent Trace)
  app.delete('/api/document/:id', (req, res) => {
    const deleted = sessionStore.delete(req.params.id);
    ragEngines.delete(req.params.id);
    res.json({
      success: deleted,
      message: deleted
        ? 'Document session and temporary in-memory vectors purged successfully.'
        : 'Session not found.',
    });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EVIAI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
