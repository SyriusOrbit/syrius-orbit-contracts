---
id: P2-012
title: MQTT QoS and subscription not specified
priority: P2
status: done
area: fleet-control
effort: low
depends-on:
---

## Problem

The Fleet Control API AsyncAPI definition (`fleet-control/vda5050.yaml`) defines eight MQTT channels but does not specify:
- QoS level for each channel (0/1/2)
- Whether messages should be retained
- Subscription filtering strategy for browser clients
- Connection persistence and clean session settings

These are important operational parameters for MQTT-based systems. Without them, implementers must guess at the appropriate quality of service for each message type.

## Affected Files

- `fleet-control/vda5050.yaml`

## Definition of Done

- [ ] Add MQTT binding information to each channel or to the server definition
- [ ] Specify recommended QoS levels (e.g., state messages: QoS 1, order messages: QoS 2, visualization: QoS 0)
- [ ] Document browser client subscription patterns (subscribe to all vs filtered topics)
- [ ] Document whether retained messages are used
- [ ] Add a section on connection behavior (clean session, keep-alive, last will)

## Notes

MQTT QoS selection is a design decision, not an implementation detail. For example:
- `state` messages: QoS 1 (at least once) — occasional duplicates are acceptable, lost messages are not
- `order` messages: QoS 2 (exactly once) — duplicate orders must be prevented
- `visualization` messages: QoS 0 (at most once) — timely but loss-tolerant
- `connection` messages: QoS 1 — critical for monitoring
