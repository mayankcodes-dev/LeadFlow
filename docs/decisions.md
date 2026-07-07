# Architectural Decisions — LeadFlow

---

## Decision 1: Gemini as the AI Provider

**Date:** 2026-07-07

**Decision:** Use Google Gemini (gemini-1.5-flash) for CRM field extraction.

**Reason:** User provided a Gemini API key. gemini-1.5-flash offers fast response times and generous context window suitable for batch CSV processing.

**Alternatives Considered:**
- OpenAI GPT-4o — excellent but requires paid API key
- Anthropic Claude — strong reasoning but higher latency

**Tradeoffs:**
- Pro: Fast, cost-effective, large context window
- Con: May occasionally produce slightly different output formats than GPT-4

**Impact:** All AI extraction goes through `@google/generative-ai` SDK.

---

## Decision 2: Stateless Architecture (No Database)

**Date:** 2026-07-07

**Decision:** Keep the backend stateless. CSV data is processed in memory and never persisted.

**Reason:** Assignment does not require persistence. Keeping it stateless simplifies deployment and avoids database setup costs.

**Alternatives Considered:** PostgreSQL, MongoDB for storing import history.

**Tradeoffs:**
- Pro: Simple, fast, easy to deploy
- Con: No import history, no audit log

**Impact:** No database dependency. Backend can be deployed as a simple Node.js service.

---

## Decision 3: Batch Size of 10 Records per AI Call

**Date:** 2026-07-07

**Decision:** Send 10 records per Gemini API call.

**Reason:** Sweet spot between API cost (fewer calls = cheaper) and accuracy (too many records per call degrades AI accuracy). 10 records keeps prompt concise enough for reliable JSON output.

**Alternatives Considered:** 5 (too many calls), 20 (accuracy drops), 50 (context overflow risk).

**Tradeoffs:**
- Pro: Reliable extraction, manageable API costs
- Con: Adds sequential latency for large files

**Impact:** `aiExtractor.ts` splits records into batches of 10.

---

## Decision 4: Retry with Exponential Backoff

**Date:** 2026-07-07

**Decision:** Retry failed AI batches up to 3 times with exponential backoff (1s, 2s, 4s).

**Reason:** AI API calls can transiently fail due to rate limits or network issues. Automatic retry improves reliability without user intervention.

**Alternatives Considered:** No retry (bad UX), infinite retry (could hang).

**Tradeoffs:**
- Pro: Robust against transient failures
- Con: Adds delay on failure

**Impact:** `aiExtractor.ts` wraps each batch call in `processBatchWithRetry()`.

---

## Decision 5: Frontend Uses papaparse for CSV Parsing

**Date:** 2026-07-07

**Decision:** Parse CSV on the client before uploading to show the preview table, using papaparse.

**Reason:** Avoids uploading raw CSV just for preview. User gets instant feedback. papaparse is the most robust CSV parser for JavaScript.

**Alternatives Considered:** Server-side only parsing — worse UX (no preview until upload).

**Impact:** `lib/csvParser.ts` uses papaparse. Backend also uses papaparse independently.

---

## Decision 6: .ai/ Folder in .gitignore

**Date:** 2026-07-07

**Decision:** The `.ai/` folder containing session documentation is gitignored.

**Reason:** Contains sensitive context (API key references, session notes) and is internal dev tooling not meant for the public repo.

**Impact:** `.gitignore` explicitly lists `.ai/` at the root level.
