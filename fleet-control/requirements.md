# Fleet Control API Requirements

This document defines the requirements for the SyriusOrbit Fleet Control API, which includes two communication standards: VDA5050 and MRIS.

## 1. VDA5050 Requirements

### 1.1 Overview

VDA5050 defines the interface for robot-fleet control communication, including task dispatch, state feedback, and instant actions.

### 1.2 Transport

TBD

### 1.3 Message Types

TBD

### 1.4 Channel Design

TBD

### 1.5 Operations

TBD

### 1.6 Server Endpoints

TBD

---

## 2. MRIS Requirements

### 2.1 Overview

MRIS (Mobile Robot Interoperability Standard) defines the interface for robot-to-enterprise system message exchange, complementary to VDA5050. It focuses on robot status reporting to external enterprise systems (MES, WMS, digital twin, etc.).

**Key Characteristics**:
- Standardized by MassRobotics
- WebSocket-based transport (RFC 6455)
- JSON message format
- Two message types: identityReport and statusReport

### 2.2 Transport

| Aspect | Decision |
|--------|----------|
| Protocol | WebSocket (RFC 6455) |
| Message Format | JSON (ISO/IEC 21778:2017) |
| Direction | Robot → External systems (unidirectional) |

**WebSocket Endpoints**:

| Environment | Protocol | Port | URL |
|-------------|----------|------|-----|
| Edge | `ws://` | 80 | `ws://localhost/mris/{robotUuid}` |
| Cloud | `wss://` | 443 | `wss://mris.cloud.syriusorbit.com/mris/{robotUuid}` |

**Security**:
- Edge: No TLS, OS-level access control
- Cloud: TLS 1.3 + mTLS + OAuth2 JWT

### 2.3 Message Types

| Message | Purpose | Frequency |
|---------|---------|-----------|
| `identityReport` | Robot identity and capability declaration | On connection + on change |
| `statusReport` | Real-time operational status | Periodic (1–5 Hz) |

**Identity Report Fields** (required):
- `uuid` — RFC 4122 UUID identifying the robot
- `timestamp` — Report timestamp (RFC 3339 date-time)
- `manufacturerName` — Robot manufacturer
- `robotModel` — Model designation
- `robotSerialNumber` — Unique serial number
- `baseRobotEnvelope` — Physical footprint

Optional fields: `maxSpeed`, `maxRunTime`, `emergencyContactInformation`, `chargerType`, `supportVendorName`, `supportVendorContactInformation`, `productDocumentation`, `thumbnailImage`, `cargoType`, `cargoMaxVolume`, `cargoMaxWeight`

**Status Report Fields** (required):
- `uuid` — Same UUID as identity report
- `timestamp` — Report timestamp
- `operationalState` — Current state (`navigating`, `idle`, `disabled`, `offline`, `charging`, `waitingHumanEvent`, `waitingExternalEvent`, `waitingInternalEvent`, `manualOverride`)
- `location` — Current position (x, y, z, angle, planarDatum)

Optional fields: `velocity`, `batteryPercentage`, `remainingRunTime`, `loadPercentageStillAvailable`, `errorCodes`, `destinations`, `path`

### 2.4 Channel Design

| Aspect | Decision |
|--------|----------|
| Endpoint | Single multiplexed WebSocket `/mris/{robotUuid}` |
| Message Differentiation | By content (schema fields) |
| Robot Identification | By path parameter `{robotUuid}` and message `uuid` field |

**Rationale**:
- MRIS standard defines `oneOf` message structure, allowing both types on same channel
- Simpler connection management (single WebSocket per robot)
- Message type can be distinguished by field structure

### 2.5 Operations

| Operation | Action | Description |
|-----------|--------|-------------|
| `receiveIdentityReport` | receive | Receive identity report from connected AMR |
| `receiveStatusReport` | receive | Receive periodic status report from connected AMR |

**Workflow**:
1. AMR establishes WebSocket connection to `/mris/{robotUuid}`
2. AMR sends `identityReport` on connection and when capability info changes
3. AMR sends `statusReport` periodically (1–5 Hz) during operation
4. External systems subscribe by connecting to the same endpoint

### 2.6 Schema File Organization

```
fleet-control/
├── mris.yaml
└── schemas/
    └── mris/
        ├── shared.definitions.schema.json
        ├── identityReport.schema.json
        └── statusReport.schema.json
```

| File | Purpose |
|------|---------|
| `shared.definitions.schema.json` | Shared type definitions (`quaternion`, `location`, `predictedLocation`) |
| `identityReport.schema.json` | Identity report schema |
| `statusReport.schema.json` | Status report schema |

**JSON Schema Version**: 2020-12

**Reference Style**: Relative paths (e.g., `./shared.definitions.schema.json#/definitions/location`)

**Authoring Rules** (from AI_DESCRIPTION.md):
- Numeric fields must explicitly declare `format` (e.g., `double`)
- Time fields must use `date-time` in RFC 3339 format

### 2.7 AsyncAPI Specification

| Aspect | Value |
|--------|-------|
| AsyncAPI Version | 3.0.0 |
| Default Content Type | `application/json` |
| Servers | `edge` (ws), `cloud` (wss) |
| Channels | Single channel `/mris/{robotUuid}` |
| Operations | `receiveIdentityReport`, `receiveStatusReport` |

### 2.8 Relationship with VDA5050

| Aspect | VDA5050 | MRIS |
|--------|---------|------|
| Purpose | Robot-fleet control | Robot-enterprise reporting |
| Transport | MQTT | WebSocket |
| Direction | Bidirectional | Unidirectional (robot→external) |
| Scope | Task dispatch, state feedback, instant actions | Status reporting, capability declaration |

The two standards coexist without conflict. Edge Daemon may translate VDA5050 state/factsheet to MRIS statusReport/identityReport for external system consumption.

---

## References

- MassRobotics AMR Interoperability Standard: `standards/AMR_Interop_Standard/`
- VDA 5050: `standards/VDA5050/`
- SyriusOrbit Architecture: `AI_DESCRIPTION.md`