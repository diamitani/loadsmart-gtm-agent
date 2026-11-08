# Hard Nodes And Gotchas

Use this file when a workflow behaves strangely or when the design includes loops, merges, code, sub-workflows, or AI sub-nodes.

## Loop Over Items and looping

Official guidance:
- n8n already processes many items automatically
- you do not always need a loop node

Use `Loop Over Items` when:
- you truly need batch-by-batch processing
- you need explicit control over rate limits
- you need a "process all batches, then continue" pattern

Important gotcha:
- HTTP Request pagination often still needs explicit thought
- if the API returns paginated results, you must design the page-fetch behavior instead of assuming all rows appear automatically

## Merge node

Important official caveat:
- in legacy v0 execution order, adding a Merge node after an If can cause both branches to execute

Implication:
- when debugging old workflows, do not assume an If branch was skipped just because it had no data output

Also remember:
- when item counts differ, Input 1 can take precedence depending on mode
- choose append, combine, SQL query, or choose branch deliberately

## Code node

Important behavior:
- default mode is `Run Once for All Items`
- there is also `Run Once for Each Item`

Implication:
- if output cardinality looks wrong, check the mode first

Environment nuance from n8n docs:
- self-hosted n8n can use built-in and external npm modules when enabled
- n8n Cloud does not allow external npm imports in the Code node

## AI sub-nodes

Official gotcha:
- in sub-nodes like `Call n8n Workflow Tool` and `AI Agent Tool`, expressions resolve to the first input item

Implication:
- do not assume multi-item expressions behave like root nodes
- if per-item behavior matters, reshape upstream data or call tools differently

## Execute Sub-workflow and Call n8n Workflow Tool

Use these for reuse, but keep contracts explicit.

Rules:
- define input schema in the sub-workflow trigger when possible
- keep sub-workflows free of unresolved errors
- prefer typed inputs over "accept all data" once the interface stabilizes

Good candidates:
- account research
- CRM enrichment
- note formatting
- proposal assembly
- approval routing
- outbound personalization

## AI Agent Tool

Use only when multi-agent specialization helps enough to justify complexity.

Good use:
- researcher agent
- qualification agent
- proposal or summary agent

Avoid:
- creating agents for tasks that could be normal tools or deterministic branches

## Debug order for weird behavior

1. Check item counts between nodes.
2. Check Code node mode.
3. Check whether a sub-node is reading only the first item.
4. Check merge mode and execution order.
5. Check whether pagination or batching is dropping or delaying data.
6. Reproduce with pinned data before changing the workflow.
