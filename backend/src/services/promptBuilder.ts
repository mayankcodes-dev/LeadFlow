import { RawRecord } from '../types/crm';

const CRM_FIELDS_DESCRIPTION = `
Extract the following CRM fields from each record:
- created_at: Lead creation date (must be parseable by JavaScript's new Date())
- name: Full name of the lead
- email: Primary email address
- country_code: Phone country code (e.g., +91, +1)
- mobile_without_country_code: Mobile number WITHOUT country code
- company: Company or organization name
- city: City name
- state: State or province name
- country: Country name
- lead_owner: Email or name of the person who owns this lead
- crm_status: MUST be exactly one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE (or empty string if unknown)
- crm_note: Use for remarks, follow-up notes, extra phone numbers, extra emails, or any info that doesn't fit other fields
- data_source: MUST be exactly one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots (or empty string if none match confidently)
- possession_time: Property possession time if mentioned
- description: Any additional description or notes
`.trim();

const RULES = `
STRICT RULES:
1. crm_status must be EXACTLY one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE — or empty string "".
2. data_source must be EXACTLY one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots — or empty string "".
3. If a record has NO email AND NO mobile number, mark it as SKIP with reason.
4. If multiple emails exist, use the FIRST one as email. Append all others to crm_note.
5. If multiple phone numbers exist, use the FIRST one as mobile. Append others to crm_note.
6. created_at must be a date string parseable by JavaScript's new Date().
7. mobile_without_country_code must NOT include the country code.
8. All string values should be trimmed. Use empty string "" for unknown fields — never null or undefined.
9. Be intelligent — column names may be abbreviated, in different languages, or use synonyms.
`.trim();

export function buildExtractionPrompt(
  headers: string[],
  records: RawRecord[]
): string {
  const recordsJson = JSON.stringify(records, null, 2);

  return `You are a CRM data extraction AI. Your job is to intelligently map CSV records into a structured CRM format.

The CSV has these column headers: ${JSON.stringify(headers)}

${CRM_FIELDS_DESCRIPTION}

${RULES}

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "results": [
    {
      "status": "ok",
      "data": {
        "created_at": "",
        "name": "",
        "email": "",
        "country_code": "",
        "mobile_without_country_code": "",
        "company": "",
        "city": "",
        "state": "",
        "country": "",
        "lead_owner": "",
        "crm_status": "",
        "crm_note": "",
        "data_source": "",
        "possession_time": "",
        "description": ""
      }
    },
    {
      "status": "skip",
      "reason": "No email or mobile number found"
    }
  ]
}

One result object per input record, in the same order.
Do NOT include any text before or after the JSON.
Do NOT wrap in markdown code blocks.

INPUT RECORDS (${records.length} records):
${recordsJson}`;
}
