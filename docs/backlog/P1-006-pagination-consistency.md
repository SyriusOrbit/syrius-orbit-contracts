---
id: P1-006
title: Inconsistent pagination strategy
priority: P1
status: open
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Management API applies pagination inconsistently:
- `GET /robots`: No pagination, returns complete list always
- `GET /robots?siteId=xxx`: No pagination
- `GET /sites/{siteId}/robots`: Supports pagination (page, pageSize)
- `GET /orders`: Supports pagination
- `GET /robots/{robotId}/instant-actions`: Supports pagination
- `GET /sites/{siteId}/zonesets/{zoneSetId}/zones`: Supports pagination
- `GET /sites/{siteId}/maps`: No pagination, returns complete list
- `GET /sites/{siteId}/zonesets`: No pagination, returns complete list
- `GET /sites/{siteId}/navigationgraphs`: No pagination, returns complete list

The inconsistency makes it hard for API consumers to write uniform list-handling code.

## Affected Files

- `fleet-management/openapi.yaml`

## Definition of Done

- [ ] Decide on a unified pagination strategy: either all list endpoints support pagination, or none do
- [ ] If pagination is adopted: add page/pageSize parameters to robot list, map list, zone set list, navigation graph list
- [ ] If no pagination: remove page/pageSize from orders, instant actions, and zone lists
- [ ] Document the rationale (e.g., "translated views are always small enough to return complete")
- [ ] Ensure all list response schemas include or exclude `pagination` consistently

## Notes

The current rationale for not paginating certain endpoints ("always returns the complete list") may be valid for small deployments but creates an arbitrary ceiling. A consistent policy is preferable even if some endpoints practically never need pagination.
