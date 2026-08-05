---
id: P2-002
title: Fleet Management missing documentation page
priority: P2
status: open
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Control API has `fleet-control/index.html` for rendering AsyncAPI documentation via AsyncAPI Standalone. The top-level `index.html` links Fleet Management to Swagger UI, but there is no dedicated `fleet-management/index.html` page. This is inconsistent with how Fleet Control exposes its documentation.

## Affected Files

- `fleet-management/` (new file needed)

## Definition of Done

- [ ] Create `fleet-management/index.html` following the Fleet Control pattern
- [ ] Use Swagger UI (already present in the repo at `swagger-ui-5.32.8/`) to render `openapi.yaml`
- [ ] Verify the page loads correctly when served alongside the existing Swagger UI
- [ ] Update top-level `index.html` link if needed

## Notes

The Swagger UI files are already in the repository. The Fleet Management page should reuse the existing Swagger UI assets rather than loading from CDN.
