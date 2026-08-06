# Agent Instructions

Before making changes, read [AI_DESCRIPTION.md](AI_DESCRIPTION.md) and follow its workflow and validation rules.

## Linter Workflow

When running lint commands (`npm run lint:all`, `npm run lint:openapi`,
`npm run lint:openapi:vacuum`, `npm run validate:asyncapi`), ALWAYS read
`lint-overrides.md` **before** analyzing the output. That file documents known
tool limitations and false positives. Do not attempt to "fix" errors that are
explicitly marked as false positives or intentional in `lint-overrides.md`.