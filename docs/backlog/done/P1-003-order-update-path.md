---
id: P1-003
title: Order update HTTP path missing
priority: P1
status: done
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Management API supports creating new orders (orderUpdateId=0) via `POST /sites/{siteId}/orders`, but provides no HTTP path for updating existing orders (orderUpdateId>0). VDA5050 supports incremental order updates (adding nodes, edges, actions to an existing order), and the requirements.md explicitly mentions `orderUpdateId` as a core concept.

Without an update path, management-side order modification (e.g., adding a pickup point, extending the route) requires canceling and recreating the entire order.

## Affected Files

- `fleet-management/openapi.yaml`
- `fleet-management/requirements.md`

## Definition of Done

- [x] Add `PATCH /orders/{orderId}` endpoint (order-level path per existing pattern, not site-scoped)
- [x] Define `OrderUpdateRequest` schema with optional `nodes`, `edges`, and `orderDescription`
- [x] Server auto-increments `orderUpdateId` on each update
- [x] Response returns `OrderDetail` with updated `orderUpdateId` in example
- [x] Document conflict resolution: 409 for terminal/archived orders; additive semantics documented
- [x] Update requirements.md path outline to include the PATCH route

## Notes

VDA5050 order updates are additive by nature (new nodes/edges appended). The HTTP PATCH semantics should align with this — the client sends the incremental update, not the full order replacement.
