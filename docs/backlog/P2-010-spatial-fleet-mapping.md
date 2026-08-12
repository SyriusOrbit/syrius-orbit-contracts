---
id: P2-010
title: Missing Spatial-to-Fleet translation mapping
priority: P2
status: open
area: cross
effort: low
depends-on:
---

## Problem

The Fleet Management API translates map, zoneSet, and navigationGraph data from the Spatial API (OGC collections). The requirements.md describes these as "read-only translation views" but does not provide a formal mapping table documenting:
- Which Spatial API collections correspond to which Fleet Management resources
- How field names and structures are translated
- Consistency guarantees between source and translated views
- Error handling when Spatial API is unavailable

## Affected Files

- `fleet-management/requirements.md`

## Definition of Done

- [ ] Add a "Translation Mapping" section to requirements.md
- [ ] Document the Spatial collection → Fleet Management resource mapping (e.g., `gridmap` → `map`, zone set collection → `zoneSet`, navigation graph collection → `navigationGraph`)
- [ ] Document key field translations (e.g., OGC `properties` → VDA5050 field names)
- [ ] Document consistency/staleness guarantees (real-time vs cached)
- [ ] Document what happens when the Spatial API returns errors or empty collections

## Notes

This is a documentation gap, not a code gap. The translation logic lives in the implementation layer, but the contract should define the expected translation semantics.
