---
name: pal-stages
description: Standardized PAL (Prompt Abstraction Layer) reasoning stages that transform raw multi-source input into intent, hypothesis, enhanced docs, build instructions, quality check, and feedback loop.
metadata:
  author: Patrick Diamitani
  version: 1.0.0
---

# PAL Reasoning Stages

The unified reasoning pipeline of the Prompt Abstraction Layer (PAL):

1. **Intent Extraction (`intent-extractor`):** Parses raw input and `master.md` to extract explicit wants, primary goal, deliverables, constraints, and missing critical information.
2. **Hypothesis Development (`hypothesis-developer`):** Uses inductive reasoning to define what the finished deliverable looks like, its structure, and target audience expectations.
3. **Docs Enhancement (`docs-enhancer`):** Deductive reasoning paired with research to enrich documentation with industry standards, frameworks, and benchmarks.
4. **Instruction Generation (`instruction-generator`):** Compiles context, intent, and hypothesis into actionable instructions and system prompts for wave execution.
5. **Quality Assessment (`quality-assessor`):** Evaluates completed outputs against the hypothesis, truth guards, and contract requirements.
6. **Feedback Interpretation (`feedback-interpreter`):** Interprets user feedback and selectively updates affected stages in the context engine without destroying run provenance.

