import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseCSV } from '../services/csvParser';
import { extractCRMRecords } from '../services/aiExtractor';

const router = Router();

// Use memory storage — no files saved to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.csv')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    const csvContent = req.file.buffer.toString('utf-8');

    // Parse CSV into raw records
    let rawRecords;
    try {
      rawRecords = parseCSV(csvContent);
    } catch (parseError) {
      res.status(400).json({
        success: false,
        error: `Failed to parse CSV: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      });
      return;
    }

    if (rawRecords.length === 0) {
      res.status(400).json({ success: false, error: 'CSV file is empty or has no data rows' });
      return;
    }

    // Extract CRM records using AI
    const { imported, skipped } = await extractCRMRecords(rawRecords);

    res.json({
      success: true,
      data: {
        imported,
        skipped,
        totalImported: imported.length,
        totalSkipped: skipped.length,
      },
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
