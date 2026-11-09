# Operations, Reliability, And Rollout

Use this file when the task is about production readiness, scaling, monitoring, or safe releases.

## Error workflows

Official guidance:
- set an error workflow in Workflow Settings
- the error workflow must start with `Error Trigger`
- one error workflow can be reused across many workflows

Use `Stop And Error` when you want to fail deliberately under your own business conditions and route into the error workflow.

Recommended pattern:

1. Detect invalid state early.
2. Fail with a clear custom message.
3. Route to alerting, triage, or compensation logic.

## Human-in-the-loop and fallbacks

Official blog guidance recommends human oversight for important actions and clear escalation rules.

For production systems, define:
- when humans intervene
- timeout behavior
- what happens on no response
- who owns approvals
- audit logging

## Monitoring

Official n8n Insights dashboard tracks:
- production executions
- failure rate
- time saved
- average run time

Use these as baseline health metrics, then add workflow-specific KPIs where needed.

For revenue workflows, also track:
- lead-to-owner latency
- time to first follow-up
- meeting-booked conversion
- sequence enrollment accuracy
- CRM writeback success rate

## Evaluations

Official guidance:
- light evaluation during build
- metric-based evaluation after deployment

Production rule:
- every major prompt, model, or tool change should be evaluated before full release

## Scaling

Official hosting guidance:
- queue mode provides the best scalability
- main instance receives workflow information
- workers perform executions
- Redis acts as the queue broker

Use queue mode when:
- webhook volume is significant
- execution concurrency matters
- the instance must scale across workers

## Release strategy

From n8n's production AI agent guidance:
- use version control
- document rollback
- prefer gradual rollout for higher-risk changes

Strong default:

1. Build and validate in development.
2. Run evaluation dataset.
3. Release behind a canary path if the workflow is high impact.
4. Watch failure rate and response time.
5. Roll back fast if behavior degrades.

## Rollback checklist

- previous known-good version identified
- exact revert steps documented
- owner and notification path documented
- post-rollback verification steps documented
- target rollback time kept to minutes, not hours

## Production checklist

- credentials and secret storage confirmed
- retries and timeouts confirmed
- error workflow connected
- approval gates defined
- metrics defined
- evaluation dataset updated
- rollback documented
- scaling assumptions stated
