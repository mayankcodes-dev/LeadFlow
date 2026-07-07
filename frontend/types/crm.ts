export interface CRMRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface SkippedRecord {
  row: number;
  reason: string;
  data: Record<string, string>;
}

export interface ImportResult {
  imported: CRMRecord[];
  skipped: SkippedRecord[];
  totalImported: number;
  totalSkipped: number;
}

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
}
