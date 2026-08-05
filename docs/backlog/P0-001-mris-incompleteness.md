---
id: P0-001
title: MRIS interface is a stub
priority: P0
status: done
area: fleet-control
effort: medium
depends-on:
---

## Problem

The MRIS (Mobile Robot Interoperability Standard) AsyncAPI definition in `fleet-control/mris.yaml` contains only a single telemetry channel with no payload schema references, operations, or components. MRIS is listed as a supported standard in AI_DESCRIPTION.md and is intended for robot state exchange with schedulers and external enterprise systems.

## Affected Files

- `fleet-control/mris.yaml`

## Definition of Done

- [x] Define MRIS WebSocket channel with robotUuid parameter
- [x] Reference or inline payload schemas for identityReport and statusReport messages
- [x] Define operations (send/receive) for each message
- [x] Add `components` section with message parameter definitions
- [x] Verify consistency with MRIS standard and VDA5050 alignment

## Notes

MRIS is complementary to VDA5050. VDA5050 handles robot-fleet control communication, while MRIS focuses on robot status exchange with external enterprise systems (MES, WMS, etc.). The two standards should coexist without conflict.
