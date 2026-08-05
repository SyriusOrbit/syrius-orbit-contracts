---
id: P1-001
title: OpenAPI version inconsistency
priority: P1
status: open
area: cross
effort: medium
depends-on:
---

## Problem

The Spatial API (`spatial/syriusorbit.yaml`) uses `openapi: 3.0.3` while the Fleet Management API (`fleet-management/openapi.yaml`) uses `openapi: 3.1.0`. OpenAPI 3.1.0 supports JSON Schema 2020-12 features (e.g., `$dynamicRef`, `$dynamicAnchor`) that are not available in 3.0.3. This version mismatch can cause tooling compatibility issues and confusion about which features are valid.

## Affected Files

- `spatial/syriusorbit.yaml` (line 1: `openapi: 3.0.3`)
- `fleet-management/openapi.yaml` (line 1: `openapi: 3.1.0`)

## Definition of Done

- [ ] Assess whether Spatial API schemas use any 3.1.0-only features
- [ ] Upgrade Spatial API to `openapi: 3.1.0` if compatible
- [ ] Or downgrade Fleet Management API to `openapi: 3.0.3` if 3.1.0 features are not needed
- [ ] Ensure all shared/referenced schemas are version-consistent
- [ ] Update all `$ref` paths and schema definitions if any breaking changes occur

## Notes

OpenAPI 3.1.0 is backward compatible with 3.0.3 for most features. The practical impact is low unless schemas use advanced JSON Schema features. Upgrading Spatial to 3.1.0 is likely the safe choice.
