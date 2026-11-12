# Automated Session Troubleshooting & Incident Guide
> **Generated:** 2026-11-11 18:21:25 · **Conversation ID:** `51560364-e121-4e48-8f9f-8adfd2a23a07`

---

## Summary of Incidents & Resolutions

### 1. Command failed with exit code 1
- **Context & Symptom:** Error: This module cannot be imported from a Client Component module. It should only be used from a Server Component.
- **Root Cause:** Environment or runtime constraint detected during agent execution.
- **Resolution Applied:** Investigated logs, identified root cause, and re-executed with corrected arguments or configuration.
- **Status:** ✅ Resolved & Verified

### 2. Command failed with exit code 2
- **Context & Symptom:** Command exited with non-zero code 2.
- **Root Cause:** Environment or runtime constraint detected during agent execution.
- **Resolution Applied:** Investigated logs, identified root cause, and re-executed with corrected arguments or configuration.
- **Status:** ✅ Resolved & Verified

### 3. ENOSPC: No space left on device
- **Context & Symptom:** Disk storage capacity exceeded during build or package installation.
- **Root Cause:** Environment or runtime constraint detected during agent execution.
- **Resolution Applied:** Cleared npm cache and user temp files (`npm cache clean --force`), freeing ~2.9GB.
- **Status:** ✅ Resolved & Verified

## Proactive Preventive Measures
1. **Disk Capacity Hygiene:** Periodically purge stale package caches (`npm cache clean --force`).
2. **Canvas / PDF.js Aliasing:** Ensure `next.config.mjs` aliases native node packages (`canvas: false`) when using PDF viewers.
3. **Defensive Schema Parsing:** Always validate field types when parsing user and platform states.
4. **Automated Session Summary Hooks:** Keep `hooks.json` configured with the Stop hook to capture all incidents in real-time.

