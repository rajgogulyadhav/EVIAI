import { CompleteDocumentData } from './samplePresentation.js';
import { EvidenceItem, SearchMatch, SearchResponse, ConfidenceLevel, ElementType } from '../types/index.js';

interface IndexedItem {
  id: string;
  pageNumber: number;
  section: string;
  elementType: ElementType;
  elementNumber?: number;
  elementRef: string;
  content: string;
  tokens: string[];
  vector: Map<string, number>;
  tableData?: any;
  chartData?: any;
  imageData?: any;
}

export class InMemoryRAGEngine {
  private items: IndexedItem[] = [];
  private idfMap = new Map<string, number>();

  constructor(docData: CompleteDocumentData) {
    this.buildIndex(docData);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0B80-\u0BFF]/g, ' ') // Preserve Tamil Unicode range + alphanumeric
      .split(/\s+/)
      .filter((w) => w.length > 1);
  }

  private buildIndex(docData: CompleteDocumentData) {
    const rawItems: {
      id: string;
      pageNumber: number;
      section: string;
      elementType: ElementType;
      elementNumber?: number;
      elementRef: string;
      content: string;
      tableData?: any;
      chartData?: any;
      imageData?: any;
    }[] = [];

    // 1. Index all text chunks
    docData.chunks.forEach((chunk) => {
      rawItems.push({
        id: chunk.id,
        pageNumber: chunk.pageNumber,
        section: chunk.section,
        elementType: chunk.elementType,
        elementRef: `${chunk.elementType === 'heading' ? 'Heading' : 'Paragraph'} p.${chunk.pageNumber}`,
        content: chunk.content,
      });
    });

    // 2. Index all tables
    docData.tables.forEach((tbl) => {
      const tableContent = `Table ${tbl.tableNumber}: ${tbl.summary} Columns: ${tbl.headers.join(', ')}. Rows: ${tbl.cells.map((r) => r.join(' | ')).join('\n')}`;
      rawItems.push({
        id: tbl.id,
        pageNumber: tbl.pageNumber,
        section: tbl.section,
        elementType: 'table',
        elementNumber: tbl.tableNumber,
        elementRef: `Table ${tbl.tableNumber}`,
        content: tableContent,
        tableData: { headers: tbl.headers, rows: tbl.cells },
      });
    });

    // 3. Index all charts
    docData.charts.forEach((chart) => {
      const chartContent = `Chart ${chart.chartNumber} (${chart.chartType}): ${chart.title}. ${chart.summary} Visible values: ${(chart.visibleValues || []).join(', ')}`;
      rawItems.push({
        id: chart.id,
        pageNumber: chart.pageNumber,
        section: chart.section,
        elementType: 'chart',
        elementNumber: chart.chartNumber,
        elementRef: `Chart ${chart.chartNumber} (${chart.chartType})`,
        content: chartContent,
        chartData: { chartType: chart.chartType, title: chart.title, summary: chart.summary },
      });
    });

    // 4. Index all images
    docData.images.forEach((img) => {
      const imgContent = `Image ${img.imageNumber} (${img.imageType}): ${img.description}. Summary: ${img.summary}. OCR Text: ${img.ocrText}`;
      rawItems.push({
        id: img.id,
        pageNumber: img.pageNumber,
        section: img.section,
        elementType: 'image',
        elementNumber: img.imageNumber,
        elementRef: `Image ${img.imageNumber}`,
        content: imgContent,
        imageData: { description: img.description, summary: img.summary, ocrText: img.ocrText },
      });
    });

    // Calculate Term Frequencies and IDF
    const totalDocs = rawItems.length;
    const docFrequency = new Map<string, number>();

    this.items = rawItems.map((item) => {
      const tokens = this.tokenize(item.content);
      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach((t) => {
        docFrequency.set(t, (docFrequency.get(t) || 0) + 1);
      });

      return {
        ...item,
        tokens,
        vector: new Map<string, number>(),
      };
    });

    // Compute IDF
    docFrequency.forEach((count, token) => {
      this.idfMap.set(token, Math.log((totalDocs + 1) / (count + 1)) + 1);
    });

    // Compute TF-IDF vectors
    this.items.forEach((item) => {
      const tfMap = new Map<string, number>();
      item.tokens.forEach((t) => {
        tfMap.set(t, (tfMap.get(t) || 0) + 1);
      });

      let normSq = 0;
      tfMap.forEach((tf, token) => {
        const idf = this.idfMap.get(token) || 1;
        const weight = tf * idf;
        item.vector.set(token, weight);
        normSq += weight * weight;
      });

      // Normalize
      const norm = Math.sqrt(normSq) || 1;
      item.vector.forEach((weight, token) => {
        item.vector.set(token, weight / norm);
      });
    });
  }

  // Preprocess Tanglish / Tamil query synonyms to bridge semantic gap
  private expandQuery(query: string): string[] {
    const rawTokens = this.tokenize(query);
    const expanded = new Set<string>(rawTokens);

    const synonymMap: Record<string, string[]> = {
      // Tamil / Tanglish mapping
      images: ['image', 'diagram', 'figure', 'illustration', 'architecture'],
      image: ['image', 'diagram', 'figure', 'architecture', 'chart'],
      diagram: ['architecture', 'flowchart', 'image', 'system'],
      table: ['table', 'matrix', 'benchmark', 'cells', 'rows', 'columns'],
      tables: ['table', 'matrix', 'benchmark'],
      accuracy: ['accuracy', 'performance', 'precision', 'benchmark', 'results', 'recall'],
      'எத்தனை': ['how', 'many', 'count', 'total'],
      enga: ['where', 'page', 'location', 'section'],
      iruku: ['is', 'exists', 'located', 'found'],
      irundha: ['if', 'exists'],
      entha: ['which', 'what', 'page'],
      soluthu: ['says', 'summary', 'explain', 'what'],
      enna: ['what', 'is', 'problem', 'need', 'purpose'],
      feasibility: ['feasibility', 'technical', 'pymupdf', 'pdfplumber', 'camelot', 'tesseract'],
      extraction: ['extraction', 'parser', 'pymupdf', 'pdfplumber', 'ocr', 'tesseract'],
      air: ['canada', 'lawsuit', 'tribunal', 'hallucination'],
      canada: ['air', 'lawsuit', 'court', 'tribunal'],
      problem: ['problem', 'statement', 'hallucination', 'crisis', 'air', 'canada', 'affected'],
      confidence: ['confidence', 'levels', 'high', 'medium', 'low', 'insufficient'],
      // Business & financial queries
      revenue: ['revenue', 'sales', 'turnover', 'earnings', 'financial', 'income'],
      profit: ['profit', 'margin', 'ebitda', 'earnings', 'financial'],
      cost: ['cost', 'pricing', 'expense', 'budget', 'fee'],
      risk: ['risk', 'challenges', 'threat', 'vulnerability', 'liability', 'failure'],
      risks: ['risk', 'challenges', 'threat', 'vulnerability', 'liability', 'failure'],
      solution: ['solution', 'architecture', 'eviai', 'system', 'proposed', 'approach'],
      business: ['business', 'problem', 'market', 'enterprise', 'customer'],
      customer: ['customer', 'client', 'passenger', 'user', 'consumer'],
      market: ['market', 'opportunity', 'size', 'industry', 'tam'],
      affected: ['affected', 'impact', 'liability', 'passengers', 'users', 'enterprises', 'airlines'],
      who: ['who', 'passengers', 'users', 'enterprises', 'stakeholders'],
    };

    rawTokens.forEach((t) => {
      if (synonymMap[t]) {
        synonymMap[t].forEach((syn) => expanded.add(syn));
      }
    });

    return Array.from(expanded);
  }

  public retrieveEvidence(query: string, limit: number = 4): { evidence: EvidenceItem[]; confidence: ConfidenceLevel } {
    const STOP_WORDS = new Set([
      'what', 'is', 'the', 'of', 'in', 'on', 'a', 'an', 'and', 'to', 'for', 'are', 'this', 'that', 'with', 'from',
      'by', 'as', 'at', 'it', 'there', 'be', 'do', 'does', 'did', 'have', 'has', 'had', 'will', 'can', 'could',
      'would', 'should', 'document', 'documents', 'say', 'says', 'said', 'about', 'tell', 'tells', 'mention',
      'mentions', 'mentioned', 'presentation', 'pdf', 'slide', 'slides', 'report', 'file', 'give', 'detail',
      'details', 'information', 'info'
    ]);
    const rawQueryTokens = this.tokenize(query);
    const contentTokens = rawQueryTokens.filter((t) => !STOP_WORDS.has(t));

    // Verify whether any meaningful content token exists in the entire document corpus
    if (contentTokens.length > 0) {
      let anyContentHit = false;
      for (const ct of contentTokens) {
        if (this.idfMap.has(ct)) {
          anyContentHit = true;
          break;
        }
      }
      if (!anyContentHit) {
        return {
          evidence: [],
          confidence: 'INSUFFICIENT EVIDENCE',
        };
      }
    }

    const queryTokens = contentTokens.length > 0 ? contentTokens : rawQueryTokens;
    const expandedTokens = this.expandQuery(query).filter((t) => !STOP_WORDS.has(t) || contentTokens.length === 0);

    // Compute query vector
    const queryVector = new Map<string, number>();
    const queryTf = new Map<string, number>();
    expandedTokens.forEach((t) => queryTf.set(t, (queryTf.get(t) || 0) + 1));

    let normSq = 0;
    queryTf.forEach((tf, token) => {
      const idf = this.idfMap.get(token) || 1.5;
      const weight = tf * idf;
      queryVector.set(token, weight);
      normSq += weight * weight;
    });
    const qNorm = Math.sqrt(normSq) || 1;
    queryVector.forEach((w, t) => queryVector.set(t, w / qNorm));

    // Score all items
    const scored = this.items.map((item) => {
      // 1. Exact Lexical match bonus
      let lexicalHits = 0;
      for (const qt of queryTokens) {
        if (item.content.toLowerCase().includes(qt)) {
          lexicalHits++;
        }
      }
      const lexicalScore = queryTokens.length > 0 ? lexicalHits / queryTokens.length : 0;

      // 2. Cosine Vector similarity
      let dotProduct = 0;
      queryVector.forEach((qWeight, token) => {
        const docWeight = item.vector.get(token) || 0;
        dotProduct += qWeight * docWeight;
      });

      // Hybrid composite score (0 to 1)
      const combinedScore = dotProduct * 0.65 + lexicalScore * 0.35;
      return { item, score: combinedScore, lexicalHits };
    });

    // Sort descending
    scored.sort((a, b) => b.score - a.score);

    // Filter top results
    const topScored = scored.slice(0, limit).filter((s) => s.score > 0.08);

    if (topScored.length === 0) {
      return {
        evidence: [],
        confidence: 'INSUFFICIENT EVIDENCE',
      };
    }

    const maxScore = topScored[0].score;
    let confidence: ConfidenceLevel = 'INSUFFICIENT EVIDENCE';
    if (maxScore >= 0.45) {
      confidence = 'HIGH EVIDENCE';
    } else if (maxScore >= 0.25) {
      confidence = 'MEDIUM EVIDENCE';
    } else if (maxScore >= 0.12) {
      confidence = 'LOW EVIDENCE';
    }

    const evidenceList: EvidenceItem[] = topScored.map((s, index) => {
      // Create concise supporting snippet
      let snippet = s.item.content;
      if (snippet.length > 300) {
        snippet = snippet.substring(0, 290) + '...';
      }

      // Relevance score mapped to 50% - 98%
      const percentage = Math.min(98, Math.max(50, Math.round(s.score * 100 * 1.5)));

      return {
        evidenceId: `Evidence ${String(index + 1).padStart(2, '0')}`,
        pageNumber: s.item.pageNumber,
        section: s.item.section,
        elementType: s.item.elementType,
        elementNumber: s.item.elementNumber,
        elementRef: s.item.elementRef,
        supportingEvidence: snippet,
        relevanceScore: percentage,
        summary: s.item.content.substring(0, 100),
        tableData: s.item.tableData,
        chartData: s.item.chartData,
        imageData: s.item.imageData,
      };
    });

    return { evidence: evidenceList, confidence };
  }

  public searchDocument(keyword: string): SearchResponse {
    const cleanKw = keyword.trim().toLowerCase();
    const kwTokens = this.tokenize(cleanKw);

    const exactMatches: SearchMatch[] = [];
    const semanticMatches: SearchMatch[] = [];

    this.items.forEach((item) => {
      const lowerContent = item.content.toLowerCase();
      if (lowerContent.includes(cleanKw)) {
        // Exact match
        const snippetIndex = lowerContent.indexOf(cleanKw);
        const start = Math.max(0, snippetIndex - 50);
        const end = Math.min(item.content.length, snippetIndex + cleanKw.length + 70);
        const snippet = (start > 0 ? '...' : '') + item.content.substring(start, end) + (end < item.content.length ? '...' : '');

        exactMatches.push({
          id: `match-exact-${item.id}`,
          pageNumber: item.pageNumber,
          section: item.section,
          elementType: item.elementType,
          elementNumber: item.elementNumber,
          snippet,
          matchType: 'exact',
          relevanceScore: 100,
        });
      } else {
        // Check semantic match via token overlap
        let overlap = 0;
        kwTokens.forEach((t) => {
          if (lowerContent.includes(t)) overlap++;
        });

        if (overlap > 0 && kwTokens.length > 0) {
          const score = Math.round((overlap / kwTokens.length) * 85);
          if (score >= 40) {
            semanticMatches.push({
              id: `match-semantic-${item.id}`,
              pageNumber: item.pageNumber,
              section: item.section,
              elementType: item.elementType,
              elementNumber: item.elementNumber,
              snippet: item.content.substring(0, 140) + '...',
              matchType: 'semantic',
              relevanceScore: score,
            });
          }
        }
      }
    });

    // Sort semantic matches by relevance
    semanticMatches.sort((a, b) => b.relevanceScore - a.relevanceScore);

    let message = '';
    if (exactMatches.length > 0) {
      message = `Found ${exactMatches.length} exact occurrences of "${keyword}" across pages ${Array.from(
        new Set(exactMatches.map((m) => m.pageNumber))
      ).join(', ')}.`;
    } else if (semanticMatches.length > 0) {
      const pages = Array.from(new Set(semanticMatches.map((m) => m.pageNumber))).slice(0, 4);
      message = `Exact keyword "${keyword}" was not found. However, semantically related evidence was found on pages ${pages.join(
        ', '
      )}.`;
    } else {
      message = `No exact or semantically related evidence found for "${keyword}".`;
    }

    return {
      keyword,
      exactMatches: exactMatches.slice(0, 8),
      semanticMatches: semanticMatches.slice(0, 6),
      message,
    };
  }
}
