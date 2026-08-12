---
id: P1-004
title: OpenAPI version inconsistency
priority: P1
status: done
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

- [x] Assess whether Spatial API schemas use any 3.1.0-only features
- [x] Upgrade Spatial API to `openapi: 3.1.0` if compatible
- [x] Or downgrade Fleet Management API to `openapi: 3.0.3` if 3.1.0 features are not needed
- [x] Ensure all shared/referenced schemas are version-consistent
- [x] Update all `$ref` paths and schema definitions if any breaking changes occur

## Decision

Upgrade Spatial API to `openapi: 3.1.0` (all 22 files under `spatial/`). Downgrading Fleet Management to 3.0.3 was rejected because it uses schema-level `examples:` (a 3.1.0-only feature) extensively. The OpenAPI ecosystem has converged on 3.1 (3.0.4 is the final 3.0.x release; 3.1.1 is the recommended target), and our toolchain (Redocly, swagger-cli) supports 3.1 fully.

## Changes

- Bumped `openapi: 3.0.3` → `3.1.0` in all 22 files under `spatial/`.
- Migrated 19 occurrences of `nullable: true` to the standard JSON Schema 2020-12 form `type: [T, "null"]` across `marie.yaml`, `ogc-maps.yaml`, `schemas.features.yaml`, `schemas.routes.yaml`.
- Cleaned up 5 residual `nullable: true` occurrences in `fleet-management/openapi.yaml` that were invalid under its already-declared `3.1.0` version.
- `standards/ogc/*` left untouched (vendored OGC reference examples).

## Validation

- `npm run lint:openapi`: errors reduced 29 → 24 (5 fixed = residual `nullable` errors in fleet-management); remaining 24 are pre-existing structural-rule findings unrelated to versioning. Warnings unchanged at 212.
- `npm run validate:spatial`: `spatial/syriusorbit.yaml is valid`.

## Notes

OpenAPI 3.1.0 is backward compatible with 3.0.3 for most features. The practical impact is low unless schemas use advanced JSON Schema features. Upgrading Spatial to 3.1.0 is the safe choice.