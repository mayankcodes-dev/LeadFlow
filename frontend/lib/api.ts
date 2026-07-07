import { ImportResult } from '@/types/crm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function importCSV(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/import`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Import failed. Please try again.');
  }

  return json.data as ImportResult;
}
