---
id: P1-010
title: MQTT broker authentication notes missing
priority: P1
status: open
area: fleet-control
effort: low
depends-on:
---

## Problem

The Fleet Control API contract (`fleet-control/vda5050.yaml`) does not document how MQTT broker-level authentication and authorization work. This covers:

- How robots authenticate (client certificates, username/password, or JWT in CONNECT password)
- How browsers authenticate via MQTT over WebSocket (wss + JWT)
- Topic-level ACLs (e.g., robot A can only publish to its own topic prefix)

This was split from P0-002 after the OpenAPI security schemes were implemented.

## Affected Files

- `fleet-control/vda5050.yaml`

## Definition of Done

- [ ] Document robot MQTT authentication methods (mTLS client certificates, or username/password)
- [ ] Document browser MQTT over WebSocket authentication (wss + JWT in CONNECT password)
- [ ] Document topic-level ACL strategy (per-robot topic isolation)
- [ ] Add MQTT security notes to the contract description

## Notes

AsyncAPI security is declared differently from OpenAPI. MQTT broker security is typically configured at the broker level, not in the AsyncAPI contract, but the contract should document what is expected.