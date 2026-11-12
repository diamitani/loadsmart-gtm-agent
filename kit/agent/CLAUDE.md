# Loadsmart ABM OS - instructions for Claude Code / Cowork

This folder runs Loadsmart's daily ABM pipeline. When opened in Claude Code (or any agent harness that reads CLAUDE.md):

- Your role and rules are in `agent/pod-copilot-system-prompt.md`. Follow them.
- Install the skills in `skills/` (or upload each zip in `skills-zips/` to claude.ai > Settings > Capabilities > Skills).
- The run order and times are in `config/schedule.yaml`. Use `loadsmart-abm-orchestrator` to run steps.
- Salesforce fields are defined in `config/salesforce-fields.md`. Do not write any other field.
- Secrets live in environment variables or the harness's credential store: `SALESFORCE_TOKEN`, `GONG_API_KEY`, `ZOOMINFO_API_KEY`, `CLAY_API_KEY`, `APOLLO_API_KEY`. Never print them.
- Start every new setup in dry-run: draft everything, write nothing, send nothing, until a human approves.
- The dashboard is `dashboard/index.html`; it reads a CSV in the shape of `templates/dashboard-import-template.csv`, which `la-daily-report` produces.
