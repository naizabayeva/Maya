# Architecture Decision Record

> Log every significant technical or design decision here.
> This file is **append-only** — never edit or remove past decisions.
> A decision is significant if a future session would benefit from knowing why it was made.

**Format for each entry:**

```
## Decision NNN — [Short title]
**Date**: YYYY-MM-DD
**Decision**: [What was decided, in one sentence]
**Rationale**: [Why this was the right choice for this project]
**Alternatives considered**: [What else was on the table]
**Trade-offs**: [What we gain, what we give up]

**Guardrails Alignment**:
- **Privacy & IP**: [How does this decision protect student data and clarify ownership?]
- **Disclosure**: [How will this choice be disclosed to users/stakeholders?]
- **Responsibility**: [Who is the human responsible for this decision's impact?]
- **Bias & Trust**: [What measures mitigate bias in this specific choice?]
- **Values**: [Which core Minerva value does this align with?]
```

---

## Decision 001 — Vanilla HTML/CSS/JS, no framework

**Date**: 2026-04-10
**Decision**: Use plain HTML, CSS, and JavaScript with no build step and no framework.
**Rationale**: GitHub Pages hosts static files directly. No framework means no build pipeline, no dependencies to update, no abstraction between the code and the browser. The project remains readable and modifiable by anyone with basic web knowledge, which aligns with the learning-orientation principle of clarity over cleverness.
**Alternatives considered**: React, Vue, Svelte — all require a build step or CDN dependency; Astro — adds complexity for a single-page app
**Trade-offs**: We lose component reuse patterns and reactive state management. We gain zero setup friction, full control over output, and a codebase that doesn't rot when npm packages break.

## Decision 002 — Ethical AI & Data Privacy Guardrails

**Date**: 2026-04-10
**Decision**: Adoption of Minerva University's AI Guardrails for all project development and deployment.
**Rationale**: To protect data privacy (especially student PII), ensure intellectual property integrity, and maintain human-centered learning. This project prioritizes human agency and accountability, treating AI as a "thinking partner" rather than a substitute.
**Specific Guardrails for this Project**:
1. **No Sensitive Data**: The app will not store or process real student records or PII. For testing, synthetic or anonymized writing samples will be used.
2. **Human-in-the-Loop**: All AI-suggested analysis (grammar, competition context) is presented as *suggestions* for the Admissions Processor to review, accept, or reject. The human always makes the final call.
3. **Mandatory Disclosure**: All AI-assisted features will include a visible "AI-Assisted" badge in the UI.
4. **Data Minimization**: No writing samples or competition lookups will be persisted on any server; all state will be managed locally in the user's browser (localStorage).
**Trade-offs**: Development may be slower due to mandatory human review and documentation overhead, but the resulting system is more ethical, secure, and aligned with institutional values.

## Decision 003 — Client-side Rule-based Analysis

**Date**: 2026-04-10
**Decision**: Use JavaScript-based regex and heuristics for Writing Review instead of external LLM APIs.
**Rationale**: Ensures 100% data privacy (writing samples never leave the browser), eliminates API costs/latency, and provides deterministic feedback that APs can easily verify. It aligns with the "Human-in-the-Loop" guardrail by providing simple "flags" rather than "answers."
**Alternatives considered**: OpenAI/Gemini API — rejected to ensure zero-trust data handling and zero cost.
**Trade-offs**: Analysis is less sophisticated than an LLM but more predictable and private.

## Decision 004 — Local Curated Database for Accomplishments

**Date**: 2026-04-10
**Decision**: Use a hardcoded local database of competitions and awards for the Accomplishment Checker.
**Rationale**: Provides high-quality, verified context for the most common accomplishments seen by Minerva APs. It avoids the need for external search APIs and keeps the tool fast and private.
**Alternatives considered**: Search engine API (e.g., Google Search API) — rejected for complexity and privacy reasons.
**Trade-offs**: Requires manual updates to the database to include new competitions.
