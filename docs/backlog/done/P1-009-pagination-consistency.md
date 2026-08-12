---
id: P1-009
title: Inconsistent pagination strategy
priority: P1
status: done
area: fleet-management
effort: low
depends-on:
---

## Problem

The Fleet Management API applied pagination inconsistently:
- `GET /robots`: No pagination
- `GET /sites/{siteId}/robots`: Supported pagination (page, pageSize)
- `GET /orders`: Supported pagination
- `GET /robots/{robotId}/instant-actions`: Supported pagination
- `GET /sites/{siteId}/maps/{mapId}/zoneSets/{zoneSetId}/zones`: Supported pagination
- `GET /sites/{siteId}/maps`: No pagination
- `GET /sites/{siteId}/maps/{mapId}/zoneSets`: No pagination

The inconsistency made it hard for API consumers to write uniform list-handling code.

## Affected Files

- `fleet-management/openapi.yaml`

## Decision

Adopted a **bounded vs unbounded** split strategy:

- **Bounded resources** (Robots, Maps, ZoneSets) — no pagination. Physical fleet size and map count are inherently limited. `GET /sites/{siteId}/robots` had its `page`/`pageSize` parameters removed to align with `GET /robots`.
- **Unbounded resources** (Orders, InstantActions, Zones) — paginated with unified `page`/`pageSize` parameters. These resources accumulate over time.

## Definition of Done

- [x] Decide on a unified pagination strategy: bounded resources no pagination, unbounded resources paginated
- [x] Remove `page`/`pageSize` from `GET /sites/{siteId}/robots` (bounded resource)
- [x] Fix `Pagination` example to use zero-based `page: 0` (was `page: 1`)
- [x] Document the rationale in endpoint descriptions
- [x] All list response schemas consistently include or exclude `pagination`

## Notes

The bounded vs unbounded split is intentional: robots, maps, and zone sets are physically bounded (finite fleet size, finite map count), while orders, instant actions, and zones accumulate over time or are inherently numerous. A one-size-fits-all pagination policy would add unnecessary complexity to bounded-resource endpoints.
