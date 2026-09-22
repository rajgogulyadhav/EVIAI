import { GoogleGenAI } from '@google/genai';
import { EvidenceItem, ConfidenceLevel } from '../types/index.js';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export interface SynthesisInput {
  question: string;
  evidenceList: EvidenceItem[];
  confidence: ConfidenceLevel;
  totalDocumentPages: number;
  totalImages: number;
  totalTables: number;
  totalCharts: number;
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
  regionContext?: {
    type: string;
    id: string;
    page: number;
    preview: string;
  };
}

async function callGeminiWithFallback(
  client: GoogleGenAI,
  userContent: string,
  systemInstruction: string
): Promise<string | null> {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const model of models) {
    try {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on ${model}`)), 5000)
      );

      const generatePromise = client.models.generateContent({
        model,
        contents: userContent,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for factual precision
        },
      });

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      const text = response?.text?.trim();
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.info(`[EVIAI Gemini] Notice on ${model}: ${err?.message || 'non-fatal'}, checking next model...`);
    }
  }
  return null;
}

export async function synthesizeAnswer(input: SynthesisInput): Promise<{
  answer: string;
  evidenceSummary: string;
  detectedLanguage: string;
}> {
  const { question, evidenceList, confidence, totalDocumentPages, totalImages, totalTables, totalCharts, regionContext, history } = input;

  // Detect query language (Tamil, Tanglish, English)
  const isTamilScript = /[\u0B80-\u0BFF]/.test(question);
  const isTanglish = /\b(iruku|irundha|enga|entha|soluthu|enna|pannirukku|ethanai|intha|indha|panrathu|solunga|la)\b/i.test(question);
  const detectedLanguage = isTamilScript ? 'Tamil (தமிழ்)' : isTanglish ? 'Tanglish' : 'English';

  const qLower = question.toLowerCase();

  // Financial & Business topics strict check
  const hasRevenueMention = evidenceList.some((e) => /\brevenue\b|வருவாய்/i.test(e.supportingEvidence));
  if (/\brevenue\b|வருவாய்/i.test(qLower) && !hasRevenueMention) {
    return {
      answer: isTamilScript
        ? 'இந்த ஆவணத்தில் நிறுவனத்தின் வருவாய் (revenue) பற்றிய போதுமான ஆதாரம் இல்லை.'
        : isTanglish
        ? 'Indha document la company oda revenue pathina podhumana evidence illa.'
        : "The document does not provide sufficient evidence about the company's revenue.",
      evidenceSummary: 'Insufficient financial evidence in document.',
      detectedLanguage,
    };
  }

  const hasProfitMention = evidenceList.some((e) => /\bprofit\b|லாபம்/i.test(e.supportingEvidence));
  if (/\bprofit\b|லாபம்/i.test(qLower) && !hasProfitMention) {
    return {
      answer: isTamilScript
        ? 'இந்த ஆவணத்தில் நிறுவனத்தின் லாபம் (profit) பற்றிய போதுமான ஆதாரம் இல்லை.'
        : "The document does not provide sufficient evidence about profit.",
      evidenceSummary: 'Insufficient evidence in document.',
      detectedLanguage,
    };
  }

  // Strict insufficient evidence threshold
  if (confidence === 'INSUFFICIENT EVIDENCE' || evidenceList.length === 0) {
    if (isTamilScript) {
      return {
        answer: 'இந்த கேள்விக்கு பதிலளிக்க ஆவணத்தில் போதுமான ஆதாரங்கள் இல்லை.',
        evidenceSummary: 'போதுமான ஆதாரம் கிடைக்கவில்லை.',
        detectedLanguage,
      };
    } else if (isTanglish) {
      return {
        answer: 'Indha question ku answer panna document la podhumana evidence illa.',
        evidenceSummary: 'Insufficient evidence in document.',
        detectedLanguage,
      };
    } else {
      return {
        answer: 'The document does not provide enough evidence to answer this question.',
        evidenceSummary: 'Insufficient evidence found in document.',
        detectedLanguage,
      };
    }
  }

  // Format retrieved evidence for LLM prompt
  const evidencePrompt = evidenceList
    .map(
      (ev) =>
        `[${ev.evidenceId}] Page: ${ev.pageNumber} | Section: ${ev.section} | Type: ${ev.elementType} (${ev.elementRef}) | Relevance: ${ev.relevanceScore}%\nSupporting Evidence:\n"${ev.supportingEvidence}"`
    )
    .join('\n\n');

  // Format history context for follow-up resolution
  let conversationContext = '';
  if (history && history.length > 0) {
    conversationContext =
      `\nRecent Conversation History:\n` +
      history.slice(-4).map((h) => `${h.role === 'user' ? 'User' : 'EVIAI'}: ${h.text}`).join('\n') +
      '\n';
  }

  const systemInstruction = `You are EVIAI, an AI Document Question Answering engine.
You MUST answer the user's question using ONLY the provided document evidence chunks.

CRITICAL RULES:
1. STRICT GROUNDING: Answer ONLY and EXCLUSIVELY using the facts contained in the provided retrieved document evidence.
2. CITATIONS: State the exact page number(s) (e.g. "Page 3", "Slide 2") and section name where the information was found.
3. INSUFFICIENT EVIDENCE: If the provided evidence does not contain the answer, say: "The document does not provide enough evidence to answer this question." Do NOT speculate or invent external facts.
4. MULTILINGUAL:
   - If the user asks in Tamil (தமிழ்), reply in fluent Tamil with page citations.
   - If the user asks in Tanglish, reply in natural Tanglish with page citations.
   - If the user asks in English, reply in crisp English with page citations.
5. NO HALLUCINATION: Never invent company names, statistics, dates, or details not present in the evidence excerpts.`;

  const userContent = `${conversationContext}User Question: "${question}"

Language Preference: ${detectedLanguage}

Document Overview:
- Total Pages/Slides: ${totalDocumentPages}
- Total Images: ${totalImages}
- Total Tables: ${totalTables}
- Total Charts: ${totalCharts}

${regionContext ? `Selected Region Constraint: [${regionContext.type} on Page ${regionContext.page}]: "${regionContext.preview}"\n` : ''}

Retrieved Document Evidence:
${evidencePrompt}

Synthesize a direct, factual answer with page citations based strictly on the retrieved document evidence above.`;

  const client = getGeminiClient();
  if (client) {
    const responseText = await callGeminiWithFallback(client, userContent, systemInstruction);
    if (responseText) {
      return {
        answer: responseText,
        evidenceSummary: `Supported by ${evidenceList.length} evidence citation${evidenceList.length > 1 ? 's' : ''} (Pages ${Array.from(
          new Set(evidenceList.map((e) => e.pageNumber))
        ).join(', ')})`,
        detectedLanguage,
      };
    }
  }

  // Deterministic synthesis fallback (derived strictly from the user's document evidence)
  return deterministicSynthesis(input, isTamilScript, isTanglish, detectedLanguage);
}

function deterministicSynthesis(
  input: SynthesisInput,
  isTamil: boolean,
  isTanglish: boolean,
  detectedLanguage: string
): { answer: string; evidenceSummary: string; detectedLanguage: string } {
  const { question, evidenceList, totalImages, totalTables, totalCharts, totalDocumentPages } = input;
  const qLower = question.toLowerCase();

  // 1. "How many pages are in this document?"
  if (/how many pages|எத்தனை (பக்கங்கள்|pages)|ethanai page/i.test(qLower)) {
    if (isTamil) {
      return {
        answer: `இந்த ஆவணத்தில் மொத்தம் ${totalDocumentPages} பக்கங்கள் உள்ளன.`,
        evidenceSummary: `ஆவண விவரங்கள் - பக்கம் 1 முதல் ${totalDocumentPages}`,
        detectedLanguage,
      };
    }
    if (isTanglish) {
      return {
        answer: `Indha document la moththam ${totalDocumentPages} pages/slides iruku.`,
        evidenceSummary: `Document stats - Pages 1 to ${totalDocumentPages}`,
        detectedLanguage,
      };
    }
    return {
      answer: `There are ${totalDocumentPages} pages/slides in this document.`,
      evidenceSummary: `Document Overview - 1 to ${totalDocumentPages} verified.`,
      detectedLanguage,
    };
  }

  // 2. "How many images are there?"
  if (/how many images|எத்தனை images|ethanai images|image.*count|diagram.*count/i.test(qLower)) {
    if (isTamil) {
      return {
        answer: `இந்த ஆவணத்தில் மொத்தம் ${totalImages} படங்கள் / வரைபடங்கள் கண்டறியப்பட்டுள்ளன.`,
        evidenceSummary: `Images count: ${totalImages}`,
        detectedLanguage,
      };
    }
    if (isTanglish) {
      return {
        answer: `Indha document la moththam ${totalImages} images/figures detect aagirukku.`,
        evidenceSummary: `Images detected: ${totalImages}`,
        detectedLanguage,
      };
    }
    return {
      answer: `There are ${totalImages} images/diagrams identified in the document.`,
      evidenceSummary: `Images detected: ${totalImages}`,
      detectedLanguage,
    };
  }

  // 3. "How many tables are there?" / "Table iruka?"
  if (/how many tables|table iruka|entha page.*table|table.*enga/i.test(qLower)) {
    if (totalTables === 0) {
      return {
        answer: isTamil
          ? 'இந்த ஆவணத்தில் அட்டவணைகள் (Tables) எதுவும் கண்டறியப்படவில்லை.'
          : isTanglish
          ? 'Indha document la tables edhum detect aagala.'
          : 'No structured tables were detected in this document.',
        evidenceSummary: 'Table count: 0',
        detectedLanguage,
      };
    }
    const tableEvidence = evidenceList.filter((e) => e.elementType === 'table');
    const pagesWithTables = Array.from(new Set(tableEvidence.map((e) => e.pageNumber)));
    const pagesStr = pagesWithTables.length > 0 ? ` on Page(s) ${pagesWithTables.join(', ')}` : '';
    if (isTamil) {
      return {
        answer: `இந்த ஆவணத்தில் மொத்தம் ${totalTables} அட்டவணைகள் (Tables)${pagesStr} கண்டறியப்பட்டுள்ளன.`,
        evidenceSummary: `Tables count: ${totalTables}${pagesStr}`,
        detectedLanguage,
      };
    }
    if (isTanglish) {
      return {
        answer: `Aam, indha document la moththam ${totalTables} tables iruku${pagesStr}.`,
        evidenceSummary: `Tables count: ${totalTables}`,
        detectedLanguage,
      };
    }
    return {
      answer: `There are ${totalTables} structured tables identified in this document${pagesStr}.`,
      evidenceSummary: `Tables detected: ${totalTables}${pagesStr}`,
      detectedLanguage,
    };
  }

  // 4. "How many charts are there?"
  if (/how many charts|chart.*count/i.test(qLower)) {
    return {
      answer: `There are ${totalCharts} charts identified in this document.`,
      evidenceSummary: `Charts detected: ${totalCharts}`,
      detectedLanguage,
    };
  }

  // 5. General Evidence Synthesis strictly from the uploaded document chunks
  if (!evidenceList || evidenceList.length === 0) {
    return {
      answer: isTamil
        ? 'இந்த கேள்விக்கு பதிலளிக்க ஆவணத்தில் போதுமான ஆதாரங்கள் இல்லை.'
        : isTanglish
        ? 'Indha question ku answer panna document la podhumana evidence illa.'
        : 'The document does not provide enough evidence to answer this question.',
      evidenceSummary: 'Insufficient evidence found in document.',
      detectedLanguage,
    };
  }

  const primaryEvidence = evidenceList[0];
  const secondaryEvidence = evidenceList[1];

  let answerText = `Based on the document evidence on Page ${primaryEvidence.pageNumber} (${primaryEvidence.section}):\n\n${primaryEvidence.supportingEvidence}`;

  if (secondaryEvidence && secondaryEvidence.pageNumber !== primaryEvidence.pageNumber) {
    answerText += `\n\nAdditional supporting evidence on Page ${secondaryEvidence.pageNumber} (${secondaryEvidence.section}):\n${secondaryEvidence.supportingEvidence}`;
  }

  if (isTamil) {
    answerText = `ஆவணத்தின் பக்கம் ${primaryEvidence.pageNumber} (${primaryEvidence.section}) ஆதாரத்தின்படி:\n\n${primaryEvidence.supportingEvidence}`;
  } else if (isTanglish) {
    answerText = `Document la Page ${primaryEvidence.pageNumber} (${primaryEvidence.section}) evidence padi:\n\n${primaryEvidence.supportingEvidence}`;
  }

  return {
    answer: answerText,
    evidenceSummary: `Source: Page ${primaryEvidence.pageNumber}, Section: ${primaryEvidence.section} (${primaryEvidence.elementRef})`,
    detectedLanguage,
  };
}
