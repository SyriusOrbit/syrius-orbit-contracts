---
id: P0-003
title: OGC API Moving Features missing
priority: P0
status: open
area: spatial
effort: high
depends-on:
---

## Problem

AI_DESCRIPTION.md lists OGC API Moving Features as a supported standard for "querying trajectories of moving objects over space and time." However, the Spatial API (`spatial/syriusorbit.yaml`) contains no paths, schemas, or references for Moving Features.

OGC Moving Features would provide trajectory query capabilities for tracking robot movements over time, which is relevant for digital twin and analytics scenarios.

## Affected Files

- `spatial/syriusorbit.yaml`
- `spatial/modules/` (new paths file needed)
- `spatial/shared/schemas.*.yaml` (new schema file needed)

## Definition of Done

- [ ] Add Moving Features paths to `spatial/syriusorbit.yaml` (GET trajectories, GET trajectory by ID)
- [ ] Create `spatial/modules/movingfeatures.paths.yaml` following OGC API Moving Features patterns
- [ ] Create `spatial/shared/schemas.movingfeatures.yaml` with trajectory and feature schemas
- [ ] Reference official OGC Moving Features example from `standards/ogc/` as style guide
- [ ] Align with existing spatial patterns (site-scoped, OGC-compliant)
- [ ] Add tags for Moving Features in the main spec

## Notes

This is a substantial addition. Consider marking as "planned" with a target version if immediate implementation is not feasible. The standard is listed as "supported" in AI_DESCRIPTION.md, which implies the contract should at minimum declare the endpoint shape.
