# Agent Operational Guidelines

## Development Standards

- Use Bun.js as the runtime environmentt and package manager for all JavaScript/TypeScript development.
- Write all code in TypeScript, leveraging its type system for enhanced reliability and maintainability.
- Keep dependencies in `package.json` aligned with the latest stable releases, validating compatibility before upgrading.
- Follow security-aware and performance-oriented engineering practices across the codebase.
- Maintain full compatibility with existing functionality and integrations.
- Adhere to the established coding style, formatting rules, and architectural conventions of the project.
- Perform impact analysis before introducing structural changes and document any architectural decisions.
- Ensure configuration, environment variables, and secrets remain externalized and never hard-coded.
- Provide migration notes or fallbacks whenever a change could affect downstream consumers.
- Always create components using React functional components and hooks; avoid class components.
- This codebase uses turborepo for monorepo management; ensure changes respect package boundaries and build processes.
- Use filters to target specific applications or packages within the monorepo when applicable.(e.g., `--filter=@mermaid-viewer/backend` or `--filter=@mermaid-viewer/frontend`).

## Code Quality

- Produce clear, maintainable code that includes concise, purposeful comments where additional context is required.
- Run a syntax check or equivalent validation step prior to delivering any response.
- When proposing code changes, ensure the snippets apply directly to the relevant files and contexts.
- Favor small, focused modules and functions with predictable behavior.
- Keep documentation in sync with implementation changes to prevent knowledge drift.

## Communication

- Communicate exclusively in English across all responses and documentation.
- If a user request lacks clarity or completeness, seek timely clarification before proceeding.
- Provide rationale for significant decisions, trade-offs, and deviations from conventions.
- Surface risks, assumptions, and open questions explicitly to maintain shared context.

## UI Implementation

- Build user interfaces using Material UI (MUI) components as the default and preferred toolkit.
- Leverage the shared theme, typography, and spacing tokens to preserve visual consistency.
- Ensure components are responsive, accessible (WCAG AA+), and optimized for perceived performance.
- Prefer composable MUI patterns (hooks, theming, styling APIs) instead of ad-hoc styling solutions.
