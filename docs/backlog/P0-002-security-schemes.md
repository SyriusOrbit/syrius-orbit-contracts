---
id: P0-002
title: Missing security scheme definitions
priority: P0
status: open
area: cross
effort: low
depends-on:
---

## Problem

All three API suites declare `security: []` with no security schemes defined. However, AI_DESCRIPTION.md explicitly states that cloud-side communication requires TLS 1.3, mTLS, and OAuth2 JWT authorization. This creates a gap between the documented architecture and the contract definitions.

Local edge Daemon and cloud services are expected to have different security postures, but neither is specified in the contracts.

## Affected Files

- `fleet-management/openapi.yaml`
- `spatial/syriusorbit.yaml`
- `fleet-control/vda5050.yaml` (AsyncAPI — security via MQTT broker)

## Definition of Done

- [ ] Define `mtls` security scheme in OpenAPI components for cloud endpoints
- [ ] Define `oauth2` security scheme (JWT bearer) in OpenAPI components
- [ ] Annotate cloud server URLs with security requirements
- [ ] Document edge (no TLS, OS-level access control) vs cloud (TLS 1.3 + mTLS + JWT) security differences
- [ ] Add MQTT authentication notes to Fleet Control API (broker-level ACLs)

## Notes

Transport security is an implementation concern, but the contract should define what is expected at the API level. The servers section already describes the edge/cloud split — security schemes should mirror this distinction.
