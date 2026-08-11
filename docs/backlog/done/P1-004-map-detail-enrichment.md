---
id: P1-004
title: MapDetail identical to MapSummary
priority: P1
status: done
area: fleet-management
effort: low
depends-on:
---

## Problem

MapDetail (the detail view returned by `GET /sites/{siteId}/maps/{mapId}`) has exactly the same fields as MapSummary (the list view item). Both contain: `mapId`, `mapVersion`, `mapDescriptor`, `mapStatus`, `siteId`. The detail view provides no additional value over the summary view.

This pattern breaks the convention that detail views should provide richer information than list views.

## Affected Files

- `fleet-management/openapi.yaml` (MapDetail schema, around line 2984)

## Definition of Done

- [ ] Add enrichment fields to MapDetail that are not in MapSummary
- [ ] Suggested additions: `nodeCount`, `edgeCount` (topology statistics)
- [ ] Suggested additions: `versionHistory` (available map versions)
- [ ] Suggested additions: `navigationGraphId` reference (link to associated navigation graph)
- [ ] Ensure MapDetail allOf-extends MapSummary rather than duplicating fields

## Notes

The map is a translation view from Spatial API. The detail enrichment should be lightweight metadata that doesn't require fetching the full Spatial API map content.
