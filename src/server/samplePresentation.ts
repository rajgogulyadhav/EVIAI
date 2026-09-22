import { DocumentMetadata, DocumentPage, DocumentImage, DocumentTable, DocumentChart, TextChunk } from '../types/index.js';

export interface CompleteDocumentData {
  metadata: DocumentMetadata;
  pages: DocumentPage[];
  images: DocumentImage[];
  tables: DocumentTable[];
  charts: DocumentChart[];
  chunks: TextChunk[];
}

export function createTeamTechWarriorsPresentation(sessionId: string): CompleteDocumentData {
  const metadata: DocumentMetadata = {
    id: sessionId,
    fileName: 'Team_Tech_Warriors_EVIAI_Presentation.pdf',
    fileType: 'pdf',
    fileSize: 4823420, // ~4.8 MB
    pageCount: 12,
    sectionCount: 12,
    paragraphCount: 46,
    wordCount: 3840,
    status: 'ready',
    progress: 100,
    currentAction: 'Document ready for evidence querying',
    createdAt: new Date().toISOString(),
  };

  const pages: DocumentPage[] = [
    {
      pageNumber: 1,
      title: 'EVIAI: AI-Powered Mixed-Format Document QA System',
      sections: ['Title Slide'],
      text: `EVIAI: AI-Powered Mixed-Format Document Question Answering System.
Presented by Team Tech Warriors.
Tagline: "Ask questions. Get answers with visual evidence you can verify."
An enterprise-grade document intelligence platform designed to eliminate LLM hallucinations by enforcing strict page-level visual evidence, source citation, and multimodal extraction.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 2,
      title: 'Problem Statement & The Hallucination Crisis',
      sections: ['Problem Statement', 'Case Study: Air Canada Incident'],
      text: `Problem Statement:
Traditional enterprise search tools and standard LLM chatbots fundamentally fail when analyzing complex, mixed-format documents. Modern corporate reports, academic papers, and technical manuals consist of interleaved text, multi-column tables, infographics, flowcharts, and architecture diagrams.

When standard chatbots ingest these files, text extractors discard structural layout and visual relationships, causing catastrophic hallucination.

Real-World Case Study: The Air Canada Lawsuit:
In a landmark legal ruling (Moffatt v. Air Canada, 2024), the airline's customer service chatbot hallucinated a bereavement fare refund policy that did not exist. The passenger relied on the chatbot's advice and booked tickets. When Air Canada refused the refund, the British Columbia Civil Resolution Tribunal ruled that Air Canada was legally responsible for information supplied by its chatbot, rejecting the defense that the chatbot was a "separate legal entity".

Key lesson: Ungrounded AI answers without verifiable source evidence create severe legal, compliance, and financial liability.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 3,
      title: 'The Key Need & Core Objectives',
      sections: ['Key Need', 'Core Objectives'],
      text: `The Key Need:
Enterprises require an AI system where every answer is backed by verifiable visual evidence. Users must not simply take an AI's word; they must be able to visually inspect the exact source page, table cell, or diagram region from which the answer was derived.

Core Objectives:
1. Mixed-Format Document Understanding: Real-time parsing of PDFs and Word documents containing text, tables, charts, and embedded graphics.
2. Evidence-First Answering: Refusal to guess. If supporting evidence is not present, explicitly state that the document does not provide enough evidence.
3. Visual Evidence Cards: Provide interactive visual cards displaying the exact page number, section name, element reference, and snippet.
4. Multilingual & Tanglish QA: Seamless query understanding across English, Tamil, and Tanglish.
5. In-Memory Session Intelligence: Fast runtime processing without permanent database lock-in.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 4,
      title: 'Proposed Architecture & End-to-End Workflow',
      sections: ['Proposed Architecture', 'Pipeline Workflow'],
      text: `Proposed Architecture:
The EVIAI system is built around an evidence-first RAG pipeline:
1. Document Ingestion: Accepts PDF and DOCX files without persistent database requirements.
2. Page-by-Page Dissection: Segregates content into paragraphs, headings, tables, charts, and image objects.
3. Temporary Vector Index: Generates high-dimensional semantic representations and lexical inverted indexes in session memory.
4. Hybrid Query Engine: Evaluates queries against both exact lexical terms and semantic embeddings.
5. Evidence Verification & Synthesis: Multimodal LLM generates answers exclusively restricted to retrieved evidence chunks.
6. Visual Evidence Grounding: Produces Evidence Cards with page navigation links and confidence scores.

Image 1: Architecture Diagram showing the complete data flow from upload to visual evidence card generation.
Chart 2: Flowchart detailing the stage-wise execution pipeline.`,
      imagesCount: 1,
      tablesCount: 0,
      chartsCount: 1,
    },
    {
      pageNumber: 5,
      title: 'Technical Feasibility & Extraction Engines',
      sections: ['Technical Feasibility', 'Modal Extraction Technologies'],
      text: `Technical Feasibility:
Team Tech Warriors designed EVIAI using proven, modular extraction technologies optimized for mixed-format documents:

1. Text Extraction:
Technology: PyMuPDF / fitz.
Capabilities: High-performance stream parsing, font-size heuristic heading detection, paragraph boundary preservation, and layout-aware multi-column reading order.

2. Table Extraction:
Technology: pdfplumber & Camelot.
Capabilities: Explicit line detection, lattice boundary recognition, and whitespace stream parsing to extract cell contents, row/column dimensions, and header schemas.

3. Graph and Chart Detection:
Technology: Multimodal AI & Visual Object Detection.
Capabilities: Distinguishes bar charts, line plots, pie charts, and architecture diagrams from generic decorative imagery, extracting axis labels, legends, and visible values.

4. Scanned Text & OCR:
Technology: Tesseract OCR Engine and Multimodal Vision AI.
Capabilities: Optical Character Recognition for scanned pages, low-contrast text stamps, and watermarks, ensuring no content is overlooked.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 6,
      title: 'Comparative Feature Matrix',
      sections: ['Comparative Analysis', 'Table 1: System Benchmarks'],
      text: `Comparative Feature Matrix:
A detailed analysis contrasting traditional document tools against EVIAI.

Table 1: Comparative Feature Matrix of Document QA Systems
Showing comparative analysis across Traditional Chatbots, Standard OCR Tools, Naive RAG Systems, and EVIAI.
EVIAI achieves complete coverage across mixed-format processing, visual evidence cards, confidence scoring, hallucination guardrails, and multilingual query handling.`,
      imagesCount: 0,
      tablesCount: 1,
      chartsCount: 0,
    },
    {
      pageNumber: 7,
      title: 'Accuracy & Performance Benchmark Results',
      sections: ['Experimental Results', 'Chart 1: Accuracy Benchmark'],
      text: `Accuracy & Retrieval Performance Benchmark:
Experimental evaluation conducted across 500 mixed-format technical documents containing complex tables, dense charts, and scanned appendices.

Chart 1: Accuracy & Retrieval Performance Benchmark across Modalities (Bar Chart)
- Text Extraction Accuracy: 98.2% (EVIAI) vs 84.1% (Naive RAG)
- Table Cell Accuracy: 94.6% (EVIAI) vs 43.5% (Naive RAG)
- Chart Reasoning Accuracy: 91.2% (EVIAI) vs 28.0% (Naive RAG)
- Scanned Document OCR Accuracy: 89.5% (EVIAI) vs 52.3% (Naive RAG)
- Overall End-to-End QA Precision: 96.4% (EVIAI) vs 61.2% (Naive RAG)

Conclusion: EVIAI provides a 35.2% absolute gain in overall QA precision on mixed-format corporate documents.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 1,
    },
    {
      pageNumber: 8,
      title: 'Visual Evidence Card & Grounding Feature',
      sections: ['Visual Evidence Card', 'Interactive Verification'],
      text: `Visual Evidence Card Feature:
The cornerstone of EVIAI is the interactive Visual Evidence Card. Rather than returning a raw text block, every answer is paired with one or more Evidence Cards.

Each Evidence Card includes:
- Evidence Identifier: Formatted as "Evidence 01", "Evidence 02", etc.
- Source Location: Exact Page number (e.g., Page 8) and Section heading (e.g., Technical Feasibility).
- Element Classification: Specifies whether the evidence is Text, Table, Chart, or Image.
- Element Reference: Identifies the exact element (e.g., "Table 1", "Image 1", "Paragraph 3").
- Direct Supporting Quote: The verbatim snippet extracted from the source document.
- Relevance Score: Percentage representing retrieval match confidence (e.g., 94%).
- One-Click Jump: Clicking any Evidence Card immediately navigates to and highlights the source page in the document viewer.

Image 2: Visual Evidence Card UI Mockup and Region Highlighting.`,
      imagesCount: 1,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 9,
      title: 'Evidence Confidence & Hallucination Guardrails',
      sections: ['Evidence Confidence', 'Zero-Hallucination Policy'],
      text: `Evidence Confidence & Hallucination Guardrails:
To prevent hallucinations like the Air Canada case, EVIAI enforces a 4-tier Evidence Confidence Framework:

1. HIGH EVIDENCE:
- Trigger: Multiple high-relevance retrieval matches (>85%) with direct supporting text, table rows, or chart values.
- Behavior: Definitive answer synthesised with comprehensive Evidence Cards.

2. MEDIUM EVIDENCE:
- Trigger: Limited supporting evidence (65%-85% relevance) or single-source reference.
- Behavior: Answer provided with cautionary source attribution.

3. LOW EVIDENCE:
- Trigger: Weak semantic relevance (45%-65%), indirect contextual mention.
- Behavior: Highlights potential matches while alerting the user to verify independently.

4. INSUFFICIENT EVIDENCE:
- Trigger: Retrieval scores fall below 45% or no supporting elements found in the document.
- Behavior: Responds strictly with the exact message: "The document does not provide enough evidence to answer this question." Zero speculation or hallucination.

Table 2: Evidence Confidence Levels and Trigger Criteria.`,
      imagesCount: 0,
      tablesCount: 1,
      chartsCount: 0,
    },
    {
      pageNumber: 10,
      title: 'Multilingual & Tanglish Query Understanding',
      sections: ['Multilingual AI', 'Tamil & Tanglish Processing'],
      text: `Multilingual Query-Evidence Processing:
EVIAI natively understands queries expressed in English, Tamil, and Tanglish (Tamil written in Latin script / mixed English-Tamil).

Examples of supported linguistic styles:
1. Pure Tamil: "இந்த PDFல எத்தனை images இருக்கு?" (How many images are in this PDF?)
2. Tanglish: "Indha document la accuracy enga mention pannirukku?" (Where is accuracy mentioned in this document?)
3. Tanglish: "Table iruka? irundha entha page?" (Is there a table? If so, which page?)
4. Tanglish: "Technical Feasibility section enga iruku?" (Where is the Technical Feasibility section?)
5. Mixed Style: "Image/diagram iruka? enga iruku?" (Are there images/diagrams? Where are they?)

Linguistic Rule: The AI understands the user's language and responds in the same language or conversational Tanglish, while preserving the verbatim evidence text in its original form without inaccurate translation.

Image 3: Multilingual Query Pipeline diagram illustrating cross-lingual semantic matching.`,
      imagesCount: 1,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 11,
      title: 'Real-Time In-Memory Architecture (No Database)',
      sections: ['In-Memory RAG Architecture', 'Session Lifecycle & Privacy'],
      text: `In-Memory Session Intelligence:
EVIAI intentionally operates without persistent database dependencies (no MongoDB, PostgreSQL, Supabase, Pinecone, or Chroma).

Why No Permanent Database?
1. Enterprise Privacy & Compliance: Customer documents are analyzed entirely in volatile RAM during the active session. No persistent copies linger on disk or cloud databases.
2. Rapid Deployment: Zero database provisioning or connection pool latency.
3. Clean Lifecycle: When the user closes the session or clicks "Clear Document", all temporary embeddings, cached pages, and metadata are immediately purged from memory.
4. High-Efficiency Local Indexing: Uses in-memory inverted indices for exact lexical lookup and normalized dense vector matrices for cosine similarity.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 0,
    },
    {
      pageNumber: 12,
      title: 'Conclusion & Team Tech Warriors',
      sections: ['Conclusion', 'Team Tech Warriors'],
      text: `Conclusion:
EVIAI transforms passive documents into verifiable, interactive knowledge repositories. By merging multimodal parsing (PyMuPDF, pdfplumber, Camelot, OCR) with hybrid RAG and interactive Visual Evidence Cards, EVIAI guarantees that every answer is trustworthy, traceable, and legally verifiable.

Presented by:
Team Tech Warriors
"Ask questions. Get answers with visual evidence you can verify."

Open for Questions & Live Demonstration.`,
      imagesCount: 0,
      tablesCount: 0,
      chartsCount: 0,
    },
  ];

  const images: DocumentImage[] = [
    {
      id: 'img-1',
      imageNumber: 1,
      pageNumber: 4,
      section: 'Proposed Architecture',
      boundingBox: { x: 50, y: 320, width: 500, height: 260 },
      imageType: 'System Architecture Diagram',
      description: 'End-to-End EVIAI System Architecture Diagram displaying the document ingestion pipeline, multimodal extraction modules, in-memory vector store, and evidence synthesis engine.',
      ocrText: 'Document Ingestion -> Page Dissection [Text/Tables/Images/Charts] -> In-Memory Vector Store -> Hybrid Retrieval -> Evidence Synthesis -> Visual Evidence Cards',
      summary: 'Architecture diagram illustrating the full 6-stage evidence extraction and verification pipeline designed by Team Tech Warriors.',
      svgData: `<svg viewBox="0 0 600 280" class="w-full h-auto bg-slate-900 rounded-lg p-4 font-mono text-xs">
        <rect x="10" y="20" width="100" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="60" y="48" fill="#f8fafc" text-anchor="middle" font-size="11" font-weight="bold">Document</text>
        <text x="60" y="64" fill="#94a3b8" text-anchor="middle" font-size="9">PDF / DOCX</text>
        
        <path d="M 110 50 L 140 50" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        
        <rect x="140" y="10" width="130" height="80" rx="8" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
        <text x="205" y="32" fill="#c7d2fe" text-anchor="middle" font-size="10" font-weight="bold">Multimodal Parser</text>
        <text x="205" y="48" fill="#94a3b8" text-anchor="middle" font-size="8">PyMuPDF / pdfplumber</text>
        <text x="205" y="62" fill="#94a3b8" text-anchor="middle" font-size="8">Camelot / OCR Vision</text>
        <text x="205" y="76" fill="#38bdf8" text-anchor="middle" font-size="8">Text • Table • Chart • Img</text>

        <path d="M 270 50 L 300 50" stroke="#818cf8" stroke-width="2"/>

        <rect x="300" y="15" width="120" height="70" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        <text x="360" y="42" fill="#e9d5ff" text-anchor="middle" font-size="10" font-weight="bold">In-Memory Store</text>
        <text x="360" y="58" fill="#94a3b8" text-anchor="middle" font-size="8">No Database</text>
        <text x="360" y="72" fill="#94a3b8" text-anchor="middle" font-size="8">Lexical + Vector Index</text>

        <path d="M 420 50 L 450 50" stroke="#a855f7" stroke-width="2"/>

        <rect x="450" y="10" width="135" height="80" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="517" y="32" fill="#bbf7d0" text-anchor="middle" font-size="10" font-weight="bold">Evidence Engine</text>
        <text x="517" y="48" fill="#94a3b8" text-anchor="middle" font-size="8">Hybrid RAG Retrieval</text>
        <text x="517" y="62" fill="#94a3b8" text-anchor="middle" font-size="8">Multimodal LLM Grounding</text>
        <text x="517" y="76" fill="#4ade80" text-anchor="middle" font-size="8">Confidence Filtering</text>

        <!-- Downward arrow to Evidence Cards -->
        <path d="M 517 90 L 517 130" stroke="#22c55e" stroke-width="2"/>

        <rect x="180" y="130" width="370" height="110" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 2"/>
        <text x="365" y="155" fill="#38bdf8" text-anchor="middle" font-size="12" font-weight="bold">EVIAI Visual Evidence Interface</text>
        <rect x="200" y="170" width="150" height="55" rx="6" fill="#1e293b" stroke="#38bdf8"/>
        <text x="275" y="190" fill="#f8fafc" text-anchor="middle" font-size="9" font-weight="bold">Evidence Card 01</text>
        <text x="275" y="204" fill="#94a3b8" text-anchor="middle" font-size="8">Page 8 • Relevance 94%</text>
        <text x="275" y="216" fill="#22c55e" text-anchor="middle" font-size="8">HIGH CONFIDENCE</text>

        <rect x="370" y="170" width="160" height="55" rx="6" fill="#1e293b" stroke="#a855f7"/>
        <text x="450" y="190" fill="#f8fafc" text-anchor="middle" font-size="9" font-weight="bold">Evidence Card 02</text>
        <text x="450" y="204" fill="#94a3b8" text-anchor="middle" font-size="8">Table 1 • Page 6</text>
        <text x="450" y="216" fill="#22c55e" text-anchor="middle" font-size="8">Direct Source Citation</text>
      </svg>`,
    },
    {
      id: 'img-2',
      imageNumber: 2,
      pageNumber: 8,
      section: 'Visual Evidence Card & Grounding Feature',
      boundingBox: { x: 60, y: 350, width: 480, height: 220 },
      imageType: 'UI Mockup & Schema Diagram',
      description: 'Visual Evidence Card UI Component breakdown showing Evidence ID, Page citation, Section header, element badges, verbatim snippet, and confidence rating.',
      ocrText: 'Evidence 01 | Page: 8 | Section: Technical Feasibility | Element: Text (PyMuPDF) | Relevance: 94% | HIGH EVIDENCE',
      summary: 'Schematic breakdown of an Evidence Card demonstrating visual proof mechanisms and interactive page jump triggers.',
      svgData: `<svg viewBox="0 0 500 200" class="w-full h-auto bg-slate-900 rounded-lg p-3 font-mono text-xs">
        <rect x="10" y="10" width="480" height="180" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="25" y="25" width="90" height="24" rx="4" fill="#0284c7"/>
        <text x="70" y="41" fill="#ffffff" text-anchor="middle" font-weight="bold" font-size="10">EVIDENCE 01</text>
        <text x="130" y="41" fill="#94a3b8" font-size="11">Page: <tspan fill="#f8fafc" font-weight="bold">8</tspan> • Section: <tspan fill="#38bdf8">Technical Feasibility</tspan></text>
        
        <rect x="25" y="60" width="450" height="65" rx="6" fill="#0f172a" stroke="#334155"/>
        <text x="40" y="82" fill="#64748b" font-size="9">SUPPORTING EVIDENCE</text>
        <text x="40" y="102" fill="#e2e8f0" font-size="10" font-style="italic">"Text extraction utilizes PyMuPDF / fitz for high-speed robust stream parsing"</text>
        
        <rect x="25" y="138" width="130" height="36" rx="4" fill="#065f46" stroke="#10b981"/>
        <text x="90" y="160" fill="#a7f3d0" text-anchor="middle" font-weight="bold" font-size="10">HIGH EVIDENCE</text>
        <text x="180" y="160" fill="#94a3b8" font-size="10">Relevance: <tspan fill="#38bdf8" font-weight="bold">94% Match</tspan></text>
        
        <rect x="360" y="138" width="115" height="36" rx="6" fill="#2563eb"/>
        <text x="417" y="160" fill="#ffffff" text-anchor="middle" font-weight="bold" font-size="10">Open Page 8 ↗</text>
      </svg>`,
    },
    {
      id: 'img-3',
      imageNumber: 3,
      pageNumber: 10,
      section: 'Multilingual & Tanglish Query Understanding',
      boundingBox: { x: 50, y: 380, width: 500, height: 210 },
      imageType: 'Linguistic Pipeline Diagram',
      description: 'Linguistic flow diagram detailing how Tamil, English, and Tanglish queries are normalized, mapped to semantic embeddings, matched with source evidence, and returned in the natural question language.',
      ocrText: 'User Query (Tamil / English / Tanglish) -> Language Intent Parser -> Cross-Lingual Embedding Alignment -> Original Evidence Retrieval -> Grounded Multilingual Synthesis',
      summary: 'Diagram illustrating cross-lingual token alignment preserving verbatim document evidence while answering in Tamil or Tanglish.',
      svgData: `<svg viewBox="0 0 520 180" class="w-full h-auto bg-slate-900 rounded-lg p-3 font-mono text-xs">
        <rect x="10" y="20" width="140" height="70" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="80" y="44" fill="#fbbf24" text-anchor="middle" font-weight="bold" font-size="10">Multilingual Query</text>
        <text x="80" y="60" fill="#e2e8f0" text-anchor="middle" font-size="8">English / தமிழ் / Tanglish</text>
        <text x="80" y="74" fill="#94a3b8" text-anchor="middle" font-size="7">"Accuracy enga iruku?"</text>

        <path d="M 150 55 L 185 55" stroke="#f59e0b" stroke-width="2"/>

        <rect x="185" y="20" width="145" height="70" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="257" y="44" fill="#7dd3fc" text-anchor="middle" font-weight="bold" font-size="10">Intent & Concept Map</text>
        <text x="257" y="60" fill="#94a3b8" text-anchor="middle" font-size="8">Semantic Embeddings</text>
        <text x="257" y="74" fill="#94a3b8" text-anchor="middle" font-size="8">Tamil token alignment</text>

        <path d="M 330 55 L 365 55" stroke="#38bdf8" stroke-width="2"/>

        <rect x="365" y="20" width="145" height="70" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
        <text x="437" y="44" fill="#6ee7b7" text-anchor="middle" font-weight="bold" font-size="10">Grounded Response</text>
        <text x="437" y="60" fill="#94a3b8" text-anchor="middle" font-size="8">Answer in user tongue</text>
        <text x="437" y="74" fill="#a7f3d0" text-anchor="middle" font-size="8">Original Quote Intact</text>

        <text x="260" y="130" fill="#94a3b8" text-anchor="middle" font-size="9">Example: தமிழ் கேள்வி → தமிழ் பதில் + English Evidence Card</text>
        <text x="260" y="150" fill="#38bdf8" text-anchor="middle" font-size="9">No machine translation corruption of source quotes</text>
      </svg>`,
    },
  ];

  const tables: DocumentTable[] = [
    {
      id: 'tbl-1',
      tableNumber: 1,
      pageNumber: 6,
      section: 'Comparative Analysis',
      rows: 6,
      columns: 5,
      headers: ['Feature', 'Traditional Chatbot', 'Standard OCR Tools', 'Naive RAG Systems', 'EVIAI Platform'],
      cells: [
        ['Mixed-Format Ingestion', 'Text only', 'Scanned pages only', 'Flattens & loses layout', 'Full Multimodal (Text, Table, Chart, Img)'],
        ['Visual Evidence Cards', 'None (Chat bubble)', 'None (Raw text dump)', 'None (Vague file link)', 'Interactive Page & Bounding Box Cards'],
        ['Hallucination Defense', 'None (Prone to fabricate)', 'N/A', 'Moderate (Context overflow)', 'Zero-Hallucination Guardrails & Refusal'],
        ['Air Canada Risk Guard', 'Vulnerable to liability', 'N/A', 'Vulnerable to policy blend', 'Strict Document-Only Grounding'],
        ['Table & Chart Precision', 'Fails on columns/grids', 'Character soup', 'Often skips numerical cells', 'pdfplumber + Vision Chart Parsing'],
        ['Multilingual & Tanglish', 'English biased', 'Language-dependent', 'Weak cross-lingual QA', 'Native English, தமிழ் & Tanglish QA'],
      ],
      summary: 'Comparative benchmark demonstrating EVIAI superiority across mixed-format processing, hallucination elimination, and interactive visual citations over naive RAG and standard chatbots.',
    },
    {
      id: 'tbl-2',
      tableNumber: 2,
      pageNumber: 9,
      section: 'Evidence Confidence',
      rows: 4,
      columns: 4,
      headers: ['Confidence Level', 'Retrieval Threshold', 'Supporting Criteria', 'System Behavior'],
      cells: [
        ['HIGH EVIDENCE', '> 85% Match', 'Multiple direct citations or unambiguous table/chart data', 'Definitive answer with detailed visual evidence cards'],
        ['MEDIUM EVIDENCE', '65% - 85% Match', 'Single direct source or partially summarized evidence', 'Direct answer with cautionary source attribution tag'],
        ['LOW EVIDENCE', '45% - 65% Match', 'Indirect contextual reference or weak lexical overlap', 'Conditional answer prompting user verification'],
        ['INSUFFICIENT EVIDENCE', '< 45% Match', 'No credible supporting text, table, or visual element', 'Outputs: "The document does not provide enough evidence to answer this question."'],
      ],
      summary: 'Evaluation rubric establishing the four strict confidence levels and zero-hallucination fallback rules.',
    },
  ];

  const charts: DocumentChart[] = [
    {
      id: 'chart-1',
      chartNumber: 1,
      pageNumber: 7,
      section: 'Experimental Results',
      chartType: 'Bar chart',
      title: 'Accuracy & Retrieval Performance Benchmark across Modalities',
      axisLabels: { x: 'Document Element Modality', y: 'Retrieval & QA Accuracy (%)' },
      legend: ['EVIAI System', 'Naive RAG Baseline'],
      visibleValues: ['Text: 98.2% vs 84.1%', 'Table Cells: 94.6% vs 43.5%', 'Charts: 91.2% vs 28.0%', 'Scanned Docs: 89.5% vs 52.3%', 'Overall: 96.4% vs 61.2%'],
      labels: ['Text Extraction', 'Table Cells', 'Charts & Graphs', 'Scanned Docs', 'Overall Precision'],
      summary: 'Bar chart contrasting EVIAI with Naive RAG across 5 document modalities. EVIAI attains 96.4% overall QA precision compared to 61.2% for standard RAG, with highest improvements in tables (+51.1%) and charts (+63.2%).',
      svgData: `<svg viewBox="0 0 540 240" class="w-full h-auto bg-slate-900 rounded-lg p-3 font-mono text-xs">
        <text x="270" y="24" fill="#f8fafc" text-anchor="middle" font-size="12" font-weight="bold">Modality Accuracy Benchmark (EVIAI vs Naive RAG)</text>
        
        <!-- Y-Axis labels -->
        <text x="35" y="55" fill="#64748b" font-size="9">100%</text>
        <line x1="45" y1="50" x2="520" y2="50" stroke="#1e293b" stroke-dasharray="2"/>
        <text x="35" y="95" fill="#64748b" font-size="9">75%</text>
        <line x1="45" y1="90" x2="520" y2="90" stroke="#1e293b" stroke-dasharray="2"/>
        <text x="35" y="135" fill="#64748b" font-size="9">50%</text>
        <line x1="45" y1="130" x2="520" y2="130" stroke="#1e293b" stroke-dasharray="2"/>
        <text x="35" y="175" fill="#64748b" font-size="9">25%</text>
        <line x1="45" y1="170" x2="520" y2="170" stroke="#1e293b" stroke-dasharray="2"/>

        <!-- Base axis -->
        <line x1="45" y1="190" x2="520" y2="190" stroke="#475569"/>

        <!-- Bar Groups -->
        <!-- 1. Text -->
        <rect x="65" y="53" width="30" height="137" fill="#38bdf8" rx="2"/>
        <rect x="98" y="72" width="30" height="118" fill="#475569" rx="2"/>
        <text x="96" y="206" fill="#cbd5e1" text-anchor="middle" font-size="8">Text</text>
        <text x="80" y="47" fill="#38bdf8" text-anchor="middle" font-size="8" font-weight="bold">98%</text>
        <text x="113" y="67" fill="#94a3b8" text-anchor="middle" font-size="8">84%</text>

        <!-- 2. Tables -->
        <rect x="155" y="58" width="30" height="132" fill="#38bdf8" rx="2"/>
        <rect x="188" y="129" width="30" height="61" fill="#475569" rx="2"/>
        <text x="186" y="206" fill="#cbd5e1" text-anchor="middle" font-size="8">Tables</text>
        <text x="170" y="52" fill="#38bdf8" text-anchor="middle" font-size="8" font-weight="bold">95%</text>
        <text x="203" y="124" fill="#94a3b8" text-anchor="middle" font-size="8">44%</text>

        <!-- 3. Charts -->
        <rect x="245" y="62" width="30" height="128" fill="#38bdf8" rx="2"/>
        <rect x="278" y="151" width="30" height="39" fill="#475569" rx="2"/>
        <text x="276" y="206" fill="#cbd5e1" text-anchor="middle" font-size="8">Charts</text>
        <text x="260" y="56" fill="#38bdf8" text-anchor="middle" font-size="8" font-weight="bold">91%</text>
        <text x="293" y="146" fill="#94a3b8" text-anchor="middle" font-size="8">28%</text>

        <!-- 4. Scanned -->
        <rect x="335" y="65" width="30" height="125" fill="#38bdf8" rx="2"/>
        <rect x="368" y="117" width="30" height="73" fill="#475569" rx="2"/>
        <text x="366" y="206" fill="#cbd5e1" text-anchor="middle" font-size="8">Scanned</text>
        <text x="350" y="59" fill="#38bdf8" text-anchor="middle" font-size="8" font-weight="bold">90%</text>
        <text x="383" y="112" fill="#94a3b8" text-anchor="middle" font-size="8">52%</text>

        <!-- 5. Overall -->
        <rect x="425" y="55" width="30" height="135" fill="#10b981" rx="2"/>
        <rect x="458" y="104" width="30" height="86" fill="#475569" rx="2"/>
        <text x="456" y="206" fill="#a7f3d0" text-anchor="middle" font-size="8" font-weight="bold">Overall</text>
        <text x="440" y="49" fill="#34d399" text-anchor="middle" font-size="8" font-weight="bold">96.4%</text>
        <text x="473" y="99" fill="#94a3b8" text-anchor="middle" font-size="8">61.2%</text>

        <!-- Legend -->
        <rect x="180" y="222" width="12" height="10" fill="#38bdf8"/>
        <text x="200" y="230" fill="#94a3b8" font-size="8">EVIAI System</text>
        <rect x="270" y="222" width="12" height="10" fill="#475569"/>
        <text x="290" y="230" fill="#94a3b8" font-size="8">Naive RAG Baseline</text>
      </svg>`,
    },
    {
      id: 'chart-2',
      chartNumber: 2,
      pageNumber: 4,
      section: 'Pipeline Workflow',
      chartType: 'Flowchart',
      title: 'End-to-End Multimodal RAG Pipeline Flow',
      axisLabels: {},
      legend: ['Input', 'Extraction', 'Vector Store', 'Verification'],
      visibleValues: ['Step 1: Ingestion', 'Step 2: Dissection', 'Step 3: In-Memory Index', 'Step 4: Evidence Filter', 'Step 5: Visual Card UI'],
      labels: ['Upload', 'Parser', 'Vector Index', 'RAG Retrieval', 'UI Cards'],
      summary: 'Flowchart detailing the stage-wise execution pipeline from document upload through multimodal parsing to evidence card compilation.',
      svgData: `<svg viewBox="0 0 500 160" class="w-full h-auto bg-slate-900 rounded-lg p-2 font-mono text-xs">
        <rect x="10" y="30" width="80" height="50" rx="6" fill="#1e293b" stroke="#38bdf8"/>
        <text x="50" y="55" fill="#f8fafc" text-anchor="middle" font-size="9">1. Upload</text>
        <text x="50" y="68" fill="#94a3b8" text-anchor="middle" font-size="7">PDF / Word</text>

        <path d="M 90 55 L 110 55" stroke="#38bdf8" stroke-width="2"/>

        <rect x="110" y="30" width="85" height="50" rx="6" fill="#1e293b" stroke="#818cf8"/>
        <text x="152" y="55" fill="#c7d2fe" text-anchor="middle" font-size="9">2. Dissect</text>
        <text x="152" y="68" fill="#94a3b8" text-anchor="middle" font-size="7">Multi-modal</text>

        <path d="M 195 55 L 215 55" stroke="#818cf8" stroke-width="2"/>

        <rect x="215" y="30" width="85" height="50" rx="6" fill="#1e293b" stroke="#a855f7"/>
        <text x="257" y="55" fill="#e9d5ff" text-anchor="middle" font-size="9">3. Index</text>
        <text x="257" y="68" fill="#94a3b8" text-anchor="middle" font-size="7">In-Memory</text>

        <path d="M 300 55 L 320 55" stroke="#a855f7" stroke-width="2"/>

        <rect x="320" y="30" width="85" height="50" rx="6" fill="#1e293b" stroke="#06b6d4"/>
        <text x="362" y="55" fill="#a5f3fc" text-anchor="middle" font-size="9">4. Retrieve</text>
        <text x="362" y="68" fill="#94a3b8" text-anchor="middle" font-size="7">Hybrid RAG</text>

        <path d="M 405 55 L 425 55" stroke="#06b6d4" stroke-width="2"/>

        <rect x="425" y="30" width="65" height="50" rx="6" fill="#1e293b" stroke="#10b981"/>
        <text x="457" y="55" fill="#bbf7d0" text-anchor="middle" font-size="9">5. Verify</text>
        <text x="457" y="68" fill="#94a3b8" text-anchor="middle" font-size="7">Evidence</text>
      </svg>`,
    },
  ];

  // Generate structured text chunks for each page
  const chunks: TextChunk[] = [];
  let chunkCounter = 1;

  pages.forEach((page) => {
    // Add page title chunk
    if (page.title) {
      chunks.push({
        id: `chunk-${chunkCounter++}`,
        chunkNumber: chunkCounter,
        pageNumber: page.pageNumber,
        section: page.sections[0] || 'Header',
        elementType: 'heading',
        content: page.title,
      });
    }

    // Split page text into distinct semantic paragraphs
    const paragraphs = page.text.split('\n\n').filter((p) => p.trim().length > 0);
    paragraphs.forEach((para) => {
      chunks.push({
        id: `chunk-${chunkCounter++}`,
        chunkNumber: chunkCounter,
        pageNumber: page.pageNumber,
        section: page.sections[0] || 'Content',
        elementType: 'paragraph',
        content: para.trim(),
      });
    });
  });

  return {
    metadata,
    pages,
    images,
    tables,
    charts,
    chunks,
  };
}
