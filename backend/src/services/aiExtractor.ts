import { GoogleGenerativeAI } from '@google/generative-ai';
import { CRMRecord, RawRecord, SkippedRecord } from '../types/crm';
import { buildExtractionPrompt } from './promptBuilder';

const BATCH_SIZE = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

interface BatchResult {
  imported: CRMRecord[];
  skipped: SkippedRecord[];
}

async function processBatchWithRetry(
  genAI: GoogleGenerativeAI,
  headers: string[],
  batch: RawRecord[],
  batchIndex: number,
  startRowIndex: number
): Promise<BatchResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = buildExtractionPrompt(headers, batch);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text().trim();

      // Strip markdown code blocks if present
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

      const parsed = JSON.parse(cleaned) as {
        results: Array<
          | { status: 'ok'; data: CRMRecord }
          | { status: 'skip'; reason: string }
        >;
      };

      const imported: CRMRecord[] = [];
      const skipped: SkippedRecord[] = [];

      parsed.results.forEach((result, idx) => {
        const rowNumber = startRowIndex + idx + 2; // +2 for header row and 1-based index
        if (result.status === 'ok') {
          imported.push(result.data);
        } else {
          skipped.push({
            row: rowNumber,
            reason: result.reason,
            data: batch[idx],
          });
        }
      });

      return { imported, skipped };
    } catch (error) {
      console.error(
        `Batch ${batchIndex + 1} attempt ${attempt} failed:`,
        error
      );
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      } else {
        // Final failure: skip all records in batch
        console.error(`Batch ${batchIndex + 1} failed after ${MAX_RETRIES} attempts. Skipping batch.`);
        const skipped: SkippedRecord[] = batch.map((record, idx) => ({
          row: startRowIndex + idx + 2,
          reason: `AI extraction failed after ${MAX_RETRIES} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: record,
        }));
        return { imported: [], skipped };
      }
    }
  }

  return { imported: [], skipped: [] };
}

export interface ExtractionProgress {
  batchIndex: number;
  totalBatches: number;
  importedSoFar: number;
  skippedSoFar: number;
}

export async function extractCRMRecords(
  records: RawRecord[],
  onProgress?: (progress: ExtractionProgress) => void
): Promise<{ imported: CRMRecord[]; skipped: SkippedRecord[] }> {
  if (records.length === 0) {
    return { imported: [], skipped: [] };
  }

  const genAI = getGenAI();
  const headers = Object.keys(records[0]);
  const batches: RawRecord[][] = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    batches.push(records.slice(i, i + BATCH_SIZE));
  }

  const allImported: CRMRecord[] = [];
  const allSkipped: SkippedRecord[] = [];

  for (let i = 0; i < batches.length; i++) {
    const startRowIndex = i * BATCH_SIZE;
    const { imported, skipped } = await processBatchWithRetry(
      genAI,
      headers,
      batches[i],
      i,
      startRowIndex
    );

    allImported.push(...imported);
    allSkipped.push(...skipped);

    if (onProgress) {
      onProgress({
        batchIndex: i + 1,
        totalBatches: batches.length,
        importedSoFar: allImported.length,
        skippedSoFar: allSkipped.length,
      });
    }
  }

  return { imported: allImported, skipped: allSkipped };
}
