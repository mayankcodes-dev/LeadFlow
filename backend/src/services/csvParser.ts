import Papa from 'papaparse';
import { RawRecord } from '../types/crm';

export function parseCSV(csvContent: string): RawRecord[] {
  const result = Papa.parse<RawRecord>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    const criticalErrors = result.errors.filter(
      (e) => e.type === 'Delimiter' || e.type === 'Quotes'
    );
    if (criticalErrors.length > 0) {
      throw new Error(`CSV parsing error: ${criticalErrors[0].message}`);
    }
  }

  return result.data;
}
