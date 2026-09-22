export type ElementType = 'text' | 'paragraph' | 'table' | 'image' | 'chart' | 'heading' | 'list' | 'caption';

export type ChartType = 
  | 'Bar chart'
  | 'Line chart'
  | 'Pie chart'
  | 'Scatter plot'
  | 'Area chart'
  | 'Histogram'
  | 'Flowchart'
  | 'Architecture diagram'
  | 'Other/Unknown';

export type ConfidenceLevel = 
  | 'HIGH EVIDENCE'
  | 'MEDIUM EVIDENCE'
  | 'LOW EVIDENCE'
  | 'INSUFFICIENT EVIDENCE';

export interface DocumentMetadata {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'ppt';
  fileSize: number;
  pageCount: number;
  sectionCount: number;
  paragraphCount: number;
  wordCount: number;
  status: 'uploading' | 'parsing' | 'extracting_tables' | 'detecting_images' | 'analyzing_charts' | 'indexing' | 'ready' | 'error';
  progress: number;
  currentAction: string;
  errorMessage?: string;
  createdAt: string;
}

export interface DocumentPage {
  pageNumber: number;
  title?: string;
  sections: string[];
  text: string;
  imagesCount: number;
  tablesCount: number;
  chartsCount: number;
}

export interface DocumentImage {
  id: string;
  imageNumber: number;
  pageNumber: number;
  section: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  imageType: string;
  description: string;
  ocrText: string;
  summary: string;
  base64Data?: string;
  svgData?: string;
}

export interface DocumentTable {
  id: string;
  tableNumber: number;
  pageNumber: number;
  section: string;
  rows: number;
  columns: number;
  headers: string[];
  cells: string[][];
  summary: string;
}

export interface DocumentChart {
  id: string;
  chartNumber: number;
  pageNumber: number;
  section: string;
  chartType: ChartType;
  title: string;
  axisLabels: { x?: string; y?: string };
  legend?: string[];
  visibleValues?: string[];
  labels?: string[];
  summary: string;
  svgData?: string;
}

export interface TextChunk {
  id: string;
  chunkNumber: number;
  pageNumber: number;
  section: string;
  elementType: ElementType;
  content: string;
  embedding?: number[];
}

export interface EvidenceItem {
  evidenceId: string;
  pageNumber: number;
  section: string;
  elementType: ElementType;
  elementNumber?: number;
  elementRef: string;
  supportingEvidence: string;
  relevanceScore: number;
  summary?: string;
  tableData?: { headers: string[]; rows: string[][] };
  chartData?: { chartType: string; title: string; summary: string };
  imageData?: { description: string; summary: string; ocrText: string };
}

export interface AskResponse {
  answer: string;
  evidenceSummary: string;
  evidenceList: EvidenceItem[];
  confidence: ConfidenceLevel;
  sourceLocation: {
    pageNumber: number;
    section: string;
    element: string;
  };
  detectedLanguage?: string;
  question: string;
  regionContext?: {
    type: string;
    id: string;
    page: number;
    preview: string;
  };
}

export interface SearchMatch {
  id: string;
  pageNumber: number;
  section: string;
  elementType: string;
  elementNumber?: number;
  snippet: string;
  matchType: 'exact' | 'semantic';
  relevanceScore: number;
}

export interface SearchResponse {
  keyword: string;
  exactMatches: SearchMatch[];
  semanticMatches: SearchMatch[];
  message: string;
}

export interface DocumentContentMapItem {
  pageNumber: number;
  title: string;
  sections: string[];
  imagesCount: number;
  tablesCount: number;
  chartsCount: number;
  summaryPreview: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  response?: AskResponse;
  timestamp: string;
}
