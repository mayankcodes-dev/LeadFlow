import Papa from 'papaparse';
import { ParsedCSV } from '@/types/crm';

export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          const critical = results.errors.filter(
            (e) => e.type === 'Delimiter' || e.type === 'Quotes'
          );
          if (critical.length > 0) {
            reject(new Error(`CSV parsing error: ${critical[0].message}`));
            return;
          }
        }
        const headers = results.meta.fields || [];
        resolve({ headers, rows: results.data });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}
