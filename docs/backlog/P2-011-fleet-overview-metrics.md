---
id: P2-011
title: Fleet Overview has limited metrics
priority: P2
status: open
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Overview endpoint (`GET /sites/{siteId}/fleet/overview`) returns only four metrics: `robotCount`, `onlineRobotCount`, `activeOrderCount`, `queuedOrderCount`. This is sufficient as a minimal start but provides limited operational visibility for fleet operators.

## Affected Files

- `fleet-management/openapi.yaml` (FleetOverview schema, around line 3304)

## Definition of Done

- [ ] Assess which additional metrics would provide operational value
- [ ] Suggested additions: `offlineRobotCount`, `batteryLowRobotCount`, `chargingRobotCount`, `averageBatteryLevel`, `errorRobotCount`
- [ ] Suggested additions: `completedOrderCount` (today), `failedOrderCount` (today)
- [ ] Add fields to FleetOverview schema with appropriate types
- [ ] Update the example response to reflect the expanded schema

## Notes

This is an additive change that maintains backward compatibility. Start with high-value metrics and expand incrementally based on operator feedback.
