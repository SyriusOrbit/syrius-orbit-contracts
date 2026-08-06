---
id: P1-002
title: Missing DELETE lifecycle operations
priority: P1
status: done
area: fleet-management
effort: low
depends-on:
updated-at: 2026-08-06
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

- [x] Decide whether physical DELETE belongs in the API layer
- [x] Provide a lifecycle mechanism for robots (suspend + archive)
- [x] Provide a lifecycle mechanism for orders (archive, terminal-state only)
- [x] Provide a lifecycle mechanism for instant actions (archive, terminal-state only)
- [x] Add filter parameters to exclude archived resources from default listings
- [x] Document cascading behavior and state constraints

## Decision

### No physical DELETE in the API layer

Physical deletion should only be performed by operators at the database
level (export, backup, then delete via SQL). The API layer does not
expose DELETE endpoints. Rationale:

- **Robot**: A physically deleted robot would still send MQTT state
  messages via the Fleet Control API (VDA 5050). The Management API
  cannot own the full lifecycle of a device it does not control.
- **Order / InstantAction**: Historical records are needed for audit
  and statistics. Hard-deleting them via API is irresponsible.

The complete resource lifecycle is expressed by the combination of
Management API (business metadata) + Control API (VDA 5050 real-time
device state). Neither suite alone fully describes the lifecycle; this
orthogonal layering is the VDA 5050 design philosophy.

### Robot: `suspended` + `archived`

Two independent boolean fields on `RobotSummary` / `RobotDetail`:

- **`suspended`**: When `true`, the robot is excluded from new order
  assignment but continues to receive MQTT state messages and update
  its view. Use case: reduce subscription count or pause a robot for
  the day. Reversible via `PATCH {"suspended": false}`.
- **`archived`**: When `true`, the robot is hidden from default
  listings (`GET /robots`) but remains queryable via `GET /robots/{id}`.
  Use case: robot decommissioned / permanently retired. Irreversible
  via API — unarchive is not supported.

The robot's online/offline state is already expressed by
`connectionState` (driven by VDA 5050 MQTT presence), so no additional
"active" flag is needed.

### Order: `archived` (terminal-state only)

- **`archived`**: When `true`, the order is hidden from default
  listings. Only orders in terminal states (SUCCEEDED, FAILED,
  CANCELED) can be archived; non-terminal orders return 409 Conflict.
  Irreversible via API.

### InstantAction: `archived` (terminal-state only)

- **`archived`**: When `true`, the instant action is hidden from
  default listings. Only instant actions in terminal states (FINISHED,
  FAILED) can be archived; non-terminal actions return 409 Conflict.
  Irreversible via API.

### 409 Conflict responses

409 responses inline-reference the existing `Problem` schema
(RFC 7807). No new `Conflict` response component was created — the
`Problem` schema is the single error envelope for all HTTP status
codes, which is the established best practice.

## Changes

- `RobotSummary`: added `suspended: boolean` and `archived: boolean`.
- `RobotCreateRequest`: added `suspended` (default false) and
  `archived` (default false).
- `RobotUpdateRequest`: added `suspended` (reversible) and `archived`
  (irreversible).
- `OrderDetail`: added `archived: boolean`.
- `InstantAction`: added `archived: boolean`.
- `GET /robots`: added `connectionState`, `suspended`, `archived`
  query parameters.
- `GET /orders`: added `archived` query parameter.
- `GET /robots/{robotId}/instant-actions`: added `archived` query
  parameter.
- `PATCH /robots/{robotId}`: updated description to document
  `suspended` and `archived` operations.
- `PATCH /orders/{orderId}`: new endpoint for archiving orders
  (409 if non-terminal).
- `PATCH /robots/{robotId}/instant-actions/{instantActionId}`: new
  endpoint for archiving instant actions (409 if non-terminal).
- `components/parameters`: added `connectionStateFilter`,
  `suspendedFilter`, `archivedFilter`.

## Validation

- `npm run lint:openapi` (Redocly): 0 errors in
  `fleet-management/openapi.yaml` (only pre-existing intentional
  trailing-slash error in `spatial/marie.yaml`).
- `npm run lint:openapi:vacuum` (vacuum): 0 errors, 19 warnings
  (all pre-existing VDA 5050 `camel-case-properties`), 31 info
  (all pre-existing `description-duplication`). No new issues
  introduced.

## Notes

- Archive is irreversible via API by design. If an archived resource
  needs to be restored, it should be done by operators at the database
  level, consistent with the "no physical mutation via API" principle.
- The `suspended` field is reversible and intended for temporary
  operational pauses, not lifecycle termination.
- The robot's connection state (online/offline) is owned by the Fleet
  Control API (VDA 5050 MQTT) and surfaced read-only in the Management
  API via `connectionState`. The Management API does not attempt to
  replicate or override this.
