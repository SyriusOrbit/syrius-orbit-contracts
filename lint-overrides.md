# Lint Overrides & Known False Positives

## Context

This document records known linter tool limitations. Entries here describe errors
that are **NOT real problems with the source documents** but false positives from
the tool's incomplete support for the relevant specification version.

**All agents/LLMs MUST read this file after running lint commands** to avoid
wasting time "fixing" false positive errors.

## Reporting Requirement

When presenting the final lint analysis, the AI **MUST** explicitly state:

> "X errors found, of which Y are false positives documented in `lint-overrides.md`
> and therefore excluded from analysis."

This ensures the human reviewer is always aware of how many errors were filtered
out and can make their own judgment if needed.

## Vacuum AsyncAPI (v0.30.0)

### `asyncapi-operation-messages` — FALSE POSITIVE

- **Error**: Operation message does not belong to the specified channel.
- **Affected files**: `fleet-control/vda5050.yaml`, `fleet-control/mris.yaml`
- **Root cause**: vacuum's rule only accepts direct `$ref: '#/components/messages/...'`
  and rejects the standard AsyncAPI 3.0 three-level pattern:
  `operation → channel → component` (i.e., `$ref: '#/channels/{name}/messages/{name}'`).
- **Document status**: CORRECT. Operation → Channel → Component is the valid
  three-level reference pattern per AsyncAPI 3.0 specification.
- **Viewer verification**: The AsyncAPI React Renderer used in
  `fleet-control/index.html` confirms the document is structurally valid and
  renders correctly.
- **Action**: **IGNORE**. Do NOT flatten operation message references to bypass
  this rule — it would break viewer rendering.

### `asyncapi-3-tags` — FALSE POSITIVE

- **Error**: Tags must be defined at root level.
- **Affected files**: `fleet-control/vda5050.yaml`, `fleet-control/mris.yaml`
- **Root cause**: vacuum's rule was written against AsyncAPI 2.x where tags were
  root-level. AsyncAPI 3.0 moved tags under `info`.
- **Document status**: CORRECT. Tags are correctly placed under `info.tags`.
- **Action**: **IGNORE**. Do NOT move tags back to root level — it would break
  viewer rendering.

### `asyncapi-servers` — FALSE POSITIVE

- **Error**: Server schema function needs a schema property.
- **Affected files**: `fleet-control/vda5050.yaml`, `fleet-control/mris.yaml`
- **Root cause**: vacuum's rule validates servers against the AsyncAPI 2.x model
  (expects `url` field). AsyncAPI 3.0 uses `host` field instead.
- **Document status**: CORRECT. Servers use `host` per AsyncAPI 3.0 spec.
- **Action**: **IGNORE**. Do NOT add `url` fields to servers — it would violate
  the AsyncAPI 3.0 specification.

## Redocly OpenAPI

### `no-path-trailing-slash` — INTENTIONAL

- **Error**: Path `/vectors/{vectorId}/` has trailing slash.
- **Affected file**: `spatial/marie.yaml`
- **Root cause**: The trailing slash is intentional for RESTful resource hierarchy.
- **Action**: **ACCEPTED**. No fix needed.