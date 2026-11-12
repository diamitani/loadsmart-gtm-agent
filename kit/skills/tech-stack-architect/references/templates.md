# Tech stack templates

## Contents
- GTM categories and common candidates
- Category recommendation block
- Comparison matrix
- Stack summary
- Setup guide
- Integration map
- JSON schema

## GTM categories and common candidates

Starting points for research, not recommendations. Verify current status and pricing before suggesting.

| Category | Common candidates |
|---|---|
| CRM | HubSpot, Salesforce, Pipedrive, Attio, Zoho CRM |
| Data and enrichment | Clay, Apollo, ZoomInfo, HubSpot Breeze Intelligence (formerly Clearbit), People Data Labs |
| Email verification | Hunter, ZeroBounce, NeverBounce |
| Outreach and sequencing | Apollo, Outreach, Salesloft, Instantly, Smartlead, HubSpot Sequences |
| Transactional / API sending | Resend, Postmark, SendGrid |
| Scheduling | Calendly, Cal.com, HubSpot Meetings |
| Automation | n8n, Make, Zapier, Workato |
| Product analytics | Mixpanel, Amplitude, PostHog |
| Web analytics | Google Analytics, Plausible |
| Support | Intercom, Zendesk, HubSpot Service |
| Call recording and notes | Gong, Fathom, Fireflies |
| Data store / app backend | Supabase, Airtable, Google Sheets |

## Category recommendation block

```markdown
## [Category]
- Recommended: [tool]
- Alternatives: [tool], [tool]
- Fit: [why for this stage, ICP, workflow]
- Pros: 
- Cons: 
- Pricing: [range] (Source: [pricing page], retrieved [date]; verify)
- Integrations: [native connections that matter here]
```

## Comparison matrix

| Criterion | Tool A | Tool B | Tool C |
|---|---|---|---|
| Fit for stage | | | |
| Ease of setup (no-code?) | | | |
| Key integrations | | | |
| Scalability | | | |
| Pricing range (verify) | | | |
| Data residency / compliance | | | |
| Verdict | | | |

## Stack summary

| Category | Lean | Advanced |
|---|---|---|
| CRM | | |
| Enrichment | | |
| Outreach | | |
| Automation | | |
| Analytics | | |
| Est. monthly range (estimate, verify) | | |

## Setup guide

```markdown
# Setup: [Tool] for [Company]
Time: [estimate] | Owner: [role] | Prereqs: [admin access, domain]

1. Create the account: [steps]
2. Configure: [pipeline stages, custom fields, users and roles]
3. Import data: [CSV columns to map, dedupe first]
4. Connect: [integrations, with ${VAR} placeholders for any key]
5. Onboard the team: [per role: what to do day one]
6. Verify: [test record end to end; what success looks like]
```

## Integration map

| From | To | How (native, middleware, API) | Data passed | Owner |
|---|---|---|---|---|

## JSON schema

```json
{
  "stack_option": "lean|advanced",
  "categories": [{
    "category": "string", "recommended_tool": "string",
    "alternatives": ["string"], "fit_justification": "string",
    "pros": ["string"], "cons": ["string"],
    "pricing_range": "string", "pricing_source": "string", "retrieved": "YYYY-MM-DD",
    "integration_notes": "string", "setup_guide": ["string"]
  }]
}
```
