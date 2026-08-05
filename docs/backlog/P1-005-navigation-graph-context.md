---
id: P1-005
title: NavigationGraph detail missing context
priority: P1
status: open
area: fleet-management
effort: low
depends-on:
---

## Problem

The NavigationGraph detail view (`GET /sites/{siteId}/navigationgraphs/{navigationGraphId}`) returns only `nodes` and `edges` arrays. It loses the identifying context (`navigationGraphId`, `siteId`, `navigationGraphDescriptor`, `nodeCount`, `edgeCount`) that NavigationGraphSummary provides in the list view.

This is inconsistent — the detail view should either preserve the summary fields or the summary should not exist.

## Affected Files

- `fleet-management/openapi.yaml` (NavigationGraph schema, around line 3010)

## Definition of Done

- [ ] Change NavigationGraph to allOf-extend NavigationGraphSummary
- [ ] Add `nodes` and `edges` as additional properties in the extended schema
- [ ] Ensure the detail response includes all summary fields plus the graph data
- [ ] Verify NavigationGraphSummary fields are sufficient (currently: navigationGraphId, siteId, navigationGraphDescriptor, nodeCount, edgeCount)

## Notes

This follows the same pattern as ZoneSetDetail, which allOf-extends ZoneSetSummary and adds `zones`.
