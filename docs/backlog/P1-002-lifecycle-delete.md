---
id: P1-002
title: Missing DELETE lifecycle operations
priority: P1
status: in-progress
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Management API provides full CRUD for robots and orders except DELETE. Resources have no deletion endpoints:
- No `DELETE /robots/{robotId}`
- No `DELETE /orders/{orderId}`
- No `DELETE /robots/{robotId}/instant-actions/{instantActionId}`

Without delete operations, lifecycle management is incomplete. Orphan robots, stale orders, and completed instant actions accumulate without a cleanup mechanism.

## Affected Files

- `fleet-management/openapi.yaml`

## Definition of Done

- [ ] Add `DELETE /robots/{robotId}` with 409 conflict check if robot has active orders
- [ ] Add `DELETE /orders/{orderId}` with status gate (only terminal states: SUCCEEDED, FAILED, CANCELED)
- [ ] Add `DELETE /robots/{robotId}/instant-actions/{instantActionId}` with status gate (only terminal states)
- [ ] Add clear operation semantics (soft delete vs hard delete)
- [ ] Document cascading behavior (e.g., deleting an order releases assigned robot)

## Notes

Consider whether deletions should be soft (logical deletion) or hard (physical removal). The requirements.md states "Site deletion is controlled and requires full cleanup" — similar principles should apply to robot and order deletion.
