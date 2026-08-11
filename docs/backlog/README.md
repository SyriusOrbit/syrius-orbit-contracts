# SyriusOrbit API Backlog

This directory tracks known gaps, issues, and improvement items across the SyriusOrbit contract suite.

## How to Use

### For AI Agents

1. **Scan this index** before starting work to check for available items.
2. **Pick an item** and set its `status` to `in-progress` in the item file's YAML frontmatter.
3. **Implement the fix**, checking off each item in the "Definition of Done" checklist as you go.
4. **Verify completion** by ensuring all checklist items are checked and all related tests pass.
5. **Set status to `done`**, update `updated-at` timestamp, and **move the item file into the `done/` subdirectory**. Completed items are retained for history and audit rather than deleted.

### Item File Format

Each item is a Markdown file with YAML frontmatter:

```markdown
---
id: P0-001
title: Short description
priority: P0          # P0 = critical, P1 = important, P2 = minor
status: open          # open | in-progress | done | blocked
area: fleet-control   # fleet-management | fleet-control | spatial | cross
effort: medium        # low | medium | high
depends-on:           # comma-separated IDs, or empty
---

## Problem
Clear description of the gap.

## Affected Files
- path/to/file.yaml

## Definition of Done
- [ ] Checklist item 1
- [ ] Checklist item 2

## Notes
Additional context, references, or constraints.
```

## Legend

| Priority | Meaning | SLA |
|----------|---------|-----|
| P0 | Critical gap blocking correctness or security | Should fix immediately |
| P1 | Important issue affecting API quality or consistency | Should fix in current milestone |
| P2 | Minor issue or improvement | Can be deferred |

| Status | Meaning |
|--------|---------|
| open | Available for anyone to claim |
| in-progress | Currently being worked on |
| done | Completed and verified |
| blocked | Cannot proceed without external input |

## Index

### P0 — Critical

| ID | Title | Area | Status |
|----|-------|------|--------|
| [P0-002](./P0-002-security-schemes.md) | Missing security scheme definitions | cross | open |
| [P0-003](./P0-003-moving-features.md) | OGC Moving Features API missing | spatial | open |

### P1 — Important

| ID | Title | Area | Status |
|----|-------|------|--------|

### P2 — Minor

| ID | Title | Area | Status |
|----|-------|------|--------|
| [P2-001](./P2-001-spatial-fleet-mapping.md) | Missing Spatial-to-Fleet translation mapping | cross | open |
| [P2-002](./P2-002-fleet-mgmt-index-page.md) | Fleet Management missing documentation page | fleet-management | open |
| [P2-003](./P2-003-fleet-overview-metrics.md) | Fleet Overview has limited metrics | fleet-management | open |
| [P2-004](./P2-004-mqtt-qos.md) | MQTT QoS and subscription not specified | fleet-control | open |

### Completed

| ID | Title | Area | Completed At |
|----|-------|------|-------------|
| [P0-001](./done/P0-001-mris-incompleteness.md) | MRIS interface incomplete | fleet-control | 2026-08-06 |
| [P1-001](./done/P1-001-openapi-version-mismatch.md) | OpenAPI version inconsistency | cross | 2026-08-06 |
| [P1-002](./done/P1-002-lifecycle-delete.md) | Missing DELETE lifecycle operations | fleet-management | 2026-08-06 |
| [P1-003](./done/P1-003-order-update-path.md) | Order update HTTP path missing | fleet-management | 2026-08-07 |
| [P1-004](./done/P1-004-map-detail-enrichment.md) | MapDetail identical to MapSummary | fleet-management | 2026-08-11 |
| [P1-005](./done/P1-005-navigation-graph-context.md) | NavigationGraph detail missing context | fleet-management | 2026-08-11 |
| [P1-006](./done/P1-006-pagination-consistency.md) | Inconsistent pagination strategy | fleet-management | 2026-08-11 |
