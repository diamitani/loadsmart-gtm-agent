# PAL Intake Schema

## Required Asana fields

- Requester
- Platform or workspace
- Business goal
- Use case
- Desired outcome
- Timeline or safe-date constraints
- Attached files or source links
- Requested publish destination
- Approval owner

## Canonical normalized fields

```json
{
  "source_task_gid": "string",
  "pipeline_version": "string",
  "requester": "string",
  "platforms": ["string"],
  "business_goal": "string",
  "use_case": "string",
  "desired_outcome": "string",
  "timeline": {
    "requested_date": "YYYY-MM-DD|null",
    "safe_date_notes": "string"
  },
  "files": [
    {
      "name": "string",
      "url": "string",
      "type": "attachment|link|page|other"
    }
  ],
  "approval_owner": "string",
  "publish_destination": "asana|page|sharepoint|subtasks|none"
}
```

## Clarification trigger

Pause the run when any required field is missing and the missing value could materially change scope, evidence collection, acceptance criteria, dependencies, or publishing behavior.
