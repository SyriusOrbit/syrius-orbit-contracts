---
id: P2-011
title: Fleet Overview has limited metrics
priority: P2
status: done
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Overview endpoint (`GET /sites/{siteId}/fleet/overview`) returns only four metrics: `robotCount`, `onlineRobotCount`, `activeOrderCount`, `queuedOrderCount`. This is sufficient as a minimal start but provides limited operational visibility for fleet operators.

## Affected Files

- `fleet-management/openapi.yaml` (FleetOverview schema, around line 3304)

## Definition of Done

- [x] Assess which additional metrics would provide operational value
- [x] Suggested additions: `offlineRobotCount`, `batteryLowRobotCount`, `chargingRobotCount`, `averageBatteryLevel`, `errorRobotCount`
- [x] Suggested additions: `completedOrderCount` (today), `failedOrderCount` (today)
- [x] Add fields to FleetOverview schema with appropriate types
- [x] Update the example response to reflect the expanded schema

## Notes

This is an additive change that maintains backward compatibility. Start with high-value metrics and expand incrementally based on operator feedback.