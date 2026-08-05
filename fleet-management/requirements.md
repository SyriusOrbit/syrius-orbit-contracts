# SyriusOrbit Fleet Management API Requirements

## Purpose

The SyriusOrbit Fleet Management API provides the HTTP management surface for fleet operators and frontend operators. It is intended for operational visibility, management, and order creation, not for real-time robot communication. Control semantics such as `cancelOrder` and `factsheetRequest` are represented through the VDA5050 instant action model.

## Intended Users

- Dispatchers
- Frontend operators

Robot manufacturers are not in scope for this API. Their integration belongs to the Fleet Control API.

## Core Resources and Scope

The core resources are:

- `robot`
- `order`
- `map`
- `zoneSet`
- `navigationGraph`
- `instantAction`

Resource scope:

- `robot` represents the mobile robot in VDA5050 terminology.
- `order` follows VDA5050 order semantics. This API defines the management-side creation and read views for orders, while execution and state propagation are handled through Fleet Control.
- `map`, `zoneSet`, and `navigationGraph` are read-only translation views sourced from the Spatial API (OGC collections), translated in real time to VDA5050-compatible schemas. They are independent top-level resources.
- `zone` belongs to `zoneSet`, not to `map`.
- `instantAction` is the command surface for predefined actions such as `cancelOrder` and `factsheetRequest`, matching the VDA5050 instant action concept.
- `factsheet` is communicated by the mobile robot after a `factsheetRequest` instant action and is not modeled as a standalone primary resource.
- Errors and warnings are represented as part of mobile robot state and information, not as a separate alert resource.

## Required Capabilities

The API should support:

- Listing robots (all sites, with optional `siteId` and `unbound` filters)
- Retrieving robot details
- Creating robots (with or without site binding)
- Listing orders (all sites, with optional `siteId` filter)
- Retrieving order details
- Creating orders (site-bound, via site path)
- Retrieving fleet overview data (per site)
- Querying maps (per site, read-only translation)
- Querying zone sets (per site, read-only translation)
- Querying zones (under a zone set)
- Querying navigation graphs (per site, read-only translation)
- Triggering predefined instant actions such as `cancelOrder` and `factsheetRequest`

## Non-Goals

The following areas are out of scope for this API:

- Route planning
- Map editing
- Real-time robot communication
- Fleet Control message transport details
- Internal Spatial API implementation details

## Data Freshness

- Operational data (robot state, order status) should be near real time.
- A delay of a few seconds is acceptable.
- Translation views (map, zoneSet, navigationGraph) are translated in real time from the Spatial API on each read request.
- Real-time behavior is handled by the WebSocket API (`/ws`), not by synchronous HTTP endpoints.

## WebSocket Real-Time Data Streaming

> **Interface Definition**: The WebSocket API is defined in `asyncapi.yaml` using AsyncAPI 3.0.0 specification. This `requirements.md` document provides the design rationale and requirements; the `asyncapi.yaml` file contains the formal contract.

### Purpose

The WebSocket endpoint (`/ws`) provides real-time streaming of MQTT messages from the Fleet Control API to browser clients. This enables live visualization of robot states, order progress, and other operational data without polling.

### Connection Model

- **Endpoint**: `ws://host/ws` (same server as HTTP API)
- **Protocol**: WebSocket with JSON message format
- **Default behavior**: After connecting, the client receives all MQTT messages from all robots and all sites

### Supported MQTT Topics

All VDA5050 MQTT topics are supported:

| Topic | Description |
|---|---|
| `state` | Robot state reports |
| `order` | Order and order updates |
| `factsheet` | Robot capability and limit declaration |
| `connection` | Robot connection state notifications |
| `visualization` | High-frequency position and path updates |
| `instantActions` | Instant action commands and status |
| `zoneSet` | Zone set transfers |
| `responses` | Fleet control responses for robot requests |

### Message Protocol

#### Client → Server: Subscribe

Clients send a `subscribe` message to update filter conditions. Uses **replacement semantics**: each message completely replaces the current filter set.

```json
{
  "type": "subscribe",
  "filters": {
    "robotIds": ["Syrius.SOR-Carrier-001"],
    "siteIds": ["site-warehouse-a"],
    "topics": ["state", "connection"]
  }
}
```

**Filter fields (all optional):**

| Field | Type | Description |
|---|---|---|
| `robotIds` | string[] | Filter by robot identifier (`{manufacturer}.{serialNumber}` format) |
| `siteIds` | string[] | Filter by site identifier |
| `topics` | string[] | Filter by MQTT topic name |

- Omit a field or set to empty array to disable filtering on that dimension
- Send `{ "type": "subscribe", "filters": {} }` to receive all messages

#### Server → Client: Message

The server forwards MQTT messages wrapped in a standard envelope:

```json
{
  "type": "message",
  "topic": "vda5050/v3/Syrius/SOR-Carrier-001/state",
  "payload": { ... VDA5050 message payload ... }
}
```

- `topic`: Full MQTT topic path, for example `vda5050/v3/Syrius/SOR-Carrier-001/state`
- `payload`: Original VDA5050 message payload without transformation. Follows the VDA5050 JSON schema specification.

### Design Principles

1. **No data transformation**: MQTT message payloads are forwarded exactly as received. The WebSocket interface is a transparent tunnel.
2. **Dynamic filtering**: Filter conditions can be updated at any time without reconnecting. This allows UIs to adapt as the operator navigates between views.
3. **No server-side acknowledgement**: Subscribe messages are processed silently. The server does not confirm subscription state.
4. **One-way streaming**: The WebSocket is primarily a server-to-client broadcast channel. Client messages are limited to `subscribe` commands only.
5. **Multiple clients**: Each WebSocket connection maintains independent filter state. Multiple clients can subscribe to different data sets simultaneously.

### Non-Goals

- The WebSocket endpoint does not accept MQTT commands (orders, instant actions, etc.). Command submission remains via HTTP API.
- The WebSocket endpoint does not provide historical data or replay. It only streams messages received after the connection is established.
- Guaranteed message delivery is not required. Messages may be dropped under heavy load.

## Schema Compatibility Principles

The Fleet Management API should stay compatible with VDA5050 at the schema and concept level wherever the same business object is represented. This means that identical concepts should reuse the same field names and structure, while Fleet Management keeps its own management-side responsibilities such as order creation and aggregated views.

- `order` payloads should reuse the VDA5050 order shape as the base contract, including `orderId`, `orderUpdateId`, `nodes`, `edges`, and `actions`.
- A newly created order should use the VDA5050 convention of starting with `orderUpdateId = 0`.
- `instantAction` payloads should reuse VDA5050 action objects, including `actionId`, `actionType`, `actionParameters`, `blockingType`, and `retriable`.
- `factsheet` data should reuse the VDA5050 factsheet schema and field names when returned through management views.
- `map` data should align with VDA5050 map-related concepts, including `mapId`, `mapVersion`, `mapStatus`, and `mapDescriptor` where applicable.
- `zone` data should align with the VDA5050 zone set model, including `zoneSetId`, `mapId`, `zoneType`, `vertices`, and zone action-related fields where applicable.
- Robot state views should reuse VDA5050 state field names when they expose the same concept, such as `orderId`, `orderUpdateId`, `lastNodeId`, `lastNodeSequenceId`, `nodeStates`, `edgeStates`, `actionStates`, `instantActionStates`, `zoneActionStates`, `mobileRobotPosition`, `powerSupply`, `operatingMode`, `errors`, `information`, and `safetyState`.

Fleet Management may expose only a subset of these fields in a given view, but it should not rename a VDA5050 concept into a different schema name when the meaning is the same.

## Site Scope and Routing

### Site Semantics

Fleet Management is a cross-site deployment. Site is a **filtering dimension** (mutable context state), not a namespace identifier. This differs from the Spatial API where site is a namespace (ID composition part).

- Robot identifiers (`manufacturer.serialNumber`) are globally unique across sites.
- `siteId` on a robot is a mutable logical attribute that must be consistent with physical position.
- Orphan robots (`siteId = null`) are a valid business state, occurring during pre-registration, migration, import, or site deletion cascade.

### Resource Site Affinity Classification

| Category | Resources | Site Affinity | Orphan Possible |
|---|---|---|---|
| Movable resources | `robot`, `instantAction` | Site ID is mutable state | Yes (robot only) |
| Strong-bound resources | `order` | Site ID required at creation, immutable | No |
| Translation views | `map`, `zoneSet`, `navigationGraph` | Site ID always present (from Spatial collection) | No |

### Read vs Write Interface Patterns

**Read interfaces** — site prefix acts as filter:
- Movable resources: both `/resource` (all sites, including orphans) and `/sites/{siteId}/resource` (equivalent to `?siteId=xxx`, no orphans) are provided
- Strong-bound resources: both `/resource` (all sites) and `/sites/{siteId}/resource` are provided
- Translation views: only `/sites/{siteId}/resource` path style, no global listing
- Fleet overview: only `/sites/{siteId}/fleet/overview`, site context required

**Write interfaces** — site prefix acts as enforcement:
- Strong-bound resources (`order`): `POST /sites/{siteId}/orders` — site ID enforced in path
- Movable resources (`robot`): `POST /robots` (can create orphan) vs `POST /sites/{siteId}/robots` (already bound) — two write paths with different semantics
- `PATCH /robots/{robotId}` for changing `siteId`: fully free (null↔siteId), enabling orphan binding, cross-site migration, and voluntary orphan creation
- `instantAction` and `factsheet`: no site prefix, follow robot

### Operation Gate Rules

Operations that require site binding are enforced at API level (rejected on creation), not just at execution level:

- **Orders**: `siteId` must be specified in path at creation time and is immutable thereafter
- **Instant Actions**: classified by type. Site-bound types (order-related, map-related, zone-related, physical work) require robot site affiliation on creation. Non-site-bound types (robot self-maintenance, e.g., MQTT cert rotation) do not
- **Factsheet**: no site requirement; it is a robot self-observation
- **Robot site migration**: `PATCH siteId` requires robot to be idle (no executing order/instantAction)

### Translation Resources

`map`, `zoneSet`, and `navigationGraph` are read-only translation views sourced from the Spatial API (OGC collections), translated in real time to VDA5050-compatible schemas. They are independent top-level resources, not sub-resources of each other:

- Each maps to a distinct Spatial collection under the same site
- `zoneSet` and `navigationGraph` are peer resources alongside `map`, not nested under `map`
- Fleet Management stores only lightweight metadata (source collection mapping), not content
- `zone` belongs to `zoneSet`, not to `map`

### Site Management

Site is identified by a single ID with no additional data. Site CRUD is managed by the Spatial API; Fleet Management only references `siteId`. Site deletion is controlled and requires full cleanup: robots must be migrated away, orders completed/canceled, and translation relationships removed.

## VDA5050 Mapping Specification

This section defines the detailed mapping between VDA5050 MQTT concepts and Fleet Management HTTP API concepts.

### Message Header Mapping

VDA5050 MQTT messages contain common header fields. The HTTP API maps these as follows:

| VDA5050 Header | HTTP API Mapping | Notes |
|---|---|---|
| `headerId` | Not exposed | RESTful APIs use resource IDs and version control instead of message sequence numbers |
| `timestamp` | `lastUpdatedAt` | Represents when the data was last updated, not when it was created |
| `version` | `protocolVersion` | Exposed for debugging and compatibility checking |
| `manufacturer` | `manufacturer` | Preserved as a separate field |
| `serialNumber` | `serialNumber` | Preserved and used to compose `robotId` |

### Robot ID Composition

`robotId` is composed using the pattern: `{manufacturer}.{serialNumber}`

Example: `Syrius.SOR-Carrier-001`

### Connection State Mapping

The `connectionState` enumeration strictly follows the VDA5050 connection schema:

- `ONLINE`: Connection between mobile robot and broker is active
- `OFFLINE`: Connection has gone offline in a coordinated way (normal shutdown)
- `HIBERNATING`: Connection is active but mobile robot does not send state messages (power saving mode)
- `CONNECTION_BROKEN`: Connection has unexpectedly ended

### Robot State Views

#### RobotSummary (List View)

Contains high-frequency query fields from VDA5050 state:

| Field | Type | VDA5050 Source |
|---|---|---|
| `robotId` | string | Composed from manufacturer.serialNumber |
| `siteId` | string | Management-side logical site assignment. Null for orphan robots. |
| `displayName` | string | Management-side field |
| `connectionState` | enum | connection.connectionState |
| `operatingMode` | enum | state.operatingMode |
| `driving` | boolean | state.driving |
| `paused` | boolean | state.paused |
| `batteryLevel` | number | state.powerSupply.stateOfCharge |
| `charging` | boolean | state.powerSupply.charging |
| `lastUpdatedAt` | date-time | state.timestamp |

#### RobotDetail (Detail View)

Contains complete VDA5050 state plus management metadata:

| Field | Type | VDA5050 Source |
|---|---|---|
| All RobotSummary fields | - | - |
| `siteId` | string | Management-side logical site assignment. Null for orphan robots. Mutable via PATCH. |
| `manufacturer` | string | header.manufacturer |
| `serialNumber` | string | header.serialNumber |
| `protocolVersion` | string | header.version |
| `orderId` | string | state.orderId |
| `orderUpdateId` | integer | state.orderUpdateId |
| `lastNodeId` | string | state.lastNodeId |
| `lastNodeSequenceId` | integer | state.lastNodeSequenceId |
| `mobileRobotPosition` | object | state.mobileRobotPosition (full: x, y, theta, mapId) |
| `velocity` | object | state.velocity (vx, vy, omega) |
| `loads[]` | array | state.loads |
| `nodeStates[]` | array | state.nodeStates |
| `edgeStates[]` | array | state.edgeStates |
| `actionStates[]` | array | state.actionStates |
| `powerSupply` | object | state.powerSupply (complete) |
| `errors[]` | array | state.errors |
| `information[]` | array | state.information |
| `safetyState` | object | state.safetyState |
| `maps[]` | array | state.maps |
| `zoneSets[]` | array | state.zoneSets |
| `plannedPath` | object | state.plannedPath |
| `intermediatePath` | object | state.intermediatePath |
| `distanceSinceLastNode` | number | state.distanceSinceLastNode |
| `newBaseRequest` | boolean | state.newBaseRequest |
| `zoneRequests[]` | array | state.zoneRequests |
| `edgeRequests[]` | array | state.edgeRequests |

The `newBaseRequest`, `zoneRequests`, and `edgeRequests` fields are exposed as read-only observation of the robot's pending control requests. The actual grant/revoke responses are handled by the Fleet Control API via the `responses` topic and are not in scope of this HTTP API.

### Order Management Metadata

HTTP API adds minimal management metadata to VDA5050 order structure:

| Added Field | Type | Description |
|---|---|---|
| `siteId` | string | Site identifier. Required at creation via `POST /sites/{siteId}/orders` and immutable thereafter. |
| `createdAt` | date-time | Order creation timestamp |
| `status` | enum | Order status: QUEUED, RUNNING, SUCCEEDED, FAILED, CANCELED |
| `assignedRobotId` | string | Robot assigned to execute the order |

The underlying order content (orderId, orderUpdateId, nodes, edges, actions) remains fully VDA5050-compatible.

### Order Site Binding

Order `siteId` is enforced at creation time via the site path (`POST /sites/{siteId}/orders`) and is immutable for the lifetime of the order. Orders cannot be reassigned to a different site. If a robot needs to execute work in a different site, the robot must migrate first, then a new order must be created in the target site.

Order execution requires that the assigned robot's `siteId` matches the order's `siteId` at execution time. Cross-site execution is not allowed and violates the "sites are independent" principle.

### Instant Actions

Supports all VDA5050 predefined actions with extension capability:

**Mandatory actions** (must be supported by every robot):
- `cancelOrder`
- `startPause`
- `stopPause`

**Optional predefined actions:**
- `startHibernation`
- `stopHibernation`
- Other VDA5050 predefined actions as specified in the standard

**Extension:** Custom actions defined by robot manufacturers are allowed and should follow the VDA5050 action schema (actionId, actionType, blockingType, actionParameters).

### Instant Action Gate Classification

Instant actions are classified into two categories based on whether they require the robot to be affiliated with a site at creation time:

**Site-bound actions** (robot must have a `siteId`):
- Order-related: `cancelOrder`, `startPause`, `stopPause` (the referenced order belongs to a site)
- Map-related: actions that reference map data
- Zone-related: actions that reference zone data
- Physical work: actions that cause physical robot movement or manipulation

**Non-site-bound actions** (robot may be orphan):
- Robot self-maintenance: e.g., MQTT certificate rotation, software update
- Pure information queries: e.g., `factsheetRequest` (no site requirement for robot self-observation)

For site-bound actions, the API rejects creation if the robot's `siteId` is null (orphan). For non-site-bound actions, no site check applies.

Manufacturer-defined custom actions default to site-bound. Manufacturers can declare non-site-bound actions by marking them explicitly.

### Factsheet

The `GET /robots/{robotId}/factsheet` endpoint returns the **complete VDA5050 factsheet schema** including:
- `protocolVersion` (mapped from the VDA5050 factsheet message header `version`)
- `typeSpecification`
- `physicalParameters`
- `protocolLimits`
- `protocolFeatures`
- `mobileRobotGeometry`
- `loadSpecification`
- `mobileRobotConfiguration`

The `headerId` is not exposed (RESTful design pattern), and `timestamp` is mapped to `lastUpdatedAt`. The mapping follows the same header-to-field pattern as RobotDetail.

Data update mechanism (cache refresh, factsheetRequest trigger) is an implementation detail not specified at the API level.

### Navigation Graph

Navigation graph data is sourced from the **Spatial API** (OGC API Features) as a read-only translation view, not from VDA5050 order/state aggregation. It is a peer resource alongside `map` and `zoneSet`, not a sub-resource of `map`.

Node and edge fields stay aligned with VDA5050 order and state terminology where the same geometry concept is represented. Shared field names (such as `nodeId`, `edgeId`, `nodeDescriptor`, `orientation`, `orientationType`, `length`, `maximumSpeed`) match VDA 5050 exactly. However, VDA 5050 order-only dynamic fields (`sequenceId`, `released`) are omitted because they describe execution state, not static graph topology. Conversely, graph-structure fields (`startNodeId`, `endNodeId`) are added because they are required to express edge connectivity in a static navigation graph.

Navigation graph, `map`, and `zoneSet` are three independent translation resources, each mapping to a distinct Spatial collection. They share the same `siteId` context but are not nested under each other.

### Zone Type Enumeration

Zone types reference the VDA5050 standard definition:

- `BLOCKED`
- `LINE_GUIDED`
- `RELEASE`
- `COORDINATED_REPLANNING`
- `SPEED_LIMIT`
- `ACTION`
- `PRIORITY`
- `PENALTY`
- `DIRECTED`
- `BIDIRECTED`

### Zone Fields

The `Zone` schema in the Fleet Management API includes the following fields. Zone is a sub-resource of `zoneSet`, not of `map`.

**Base fields (from VDA5050 zone definition):**
- `zoneId` - Locally unique zone identifier within the zone set
- `zoneType` - Zone category (see Zone Type Enumeration above)
- `zoneDescriptor` - User-defined, human-readable name or descriptor
- `vertices` - Array of vertices defining the geometrical shape

**Context fields (from VDA5050 zoneSet wrapper):**
- `zoneSetId` - Globally unique identifier of the zone set that this zone belongs to
- `zoneSetDescriptor` - Human-readable name or descriptor of the zone set

**Conditional fields (depending on zoneType):**
- `releaseLossBehavior` - Required for `RELEASE` zones
- `maximumSpeed` - Required for `SPEED_LIMIT` zones
- `entryActions`, `duringActions`, `exitActions` - Required for `ACTION` zones
- `priorityFactor` - Required for `PRIORITY` zones
- `penaltyFactor` - Required for `PENALTY` zones
- `direction`, `directedLimitation` - Required for `DIRECTED` zones
- `direction`, `bidirectedLimitation` - Required for `BIDIRECTED` zones

The `zoneSetId` and `zoneSetDescriptor` fields provide context from the VDA5050 zoneSet wrapper object, which groups related zones together. This allows operators to understand which zone set a zone belongs to without requiring an additional API call.

Zone set is a peer translation resource alongside `map` and `navigationGraph`, sourcing from a distinct Spatial collection. A site may have multiple zone sets.

### Action Status Enumeration

Action statuses reference the VDA5050 standard definition:

- `WAITING`
- `INITIALIZING`
- `RUNNING`
- `PAUSED`
- `RETRIABLE`
- `FINISHED`
- `FAILED`

## Design Direction

The next design step is to translate these requirements into a resource model and API structure:

1. Confirm resource boundaries.
2. Define list, detail, and summary views.
3. Map resources to paths and operations.
4. Align schemas, examples, and error models.
5. Verify naming consistency with the repository documentation and product scope.

## Draft OpenAPI Path Outline

This is a rough path design based on the current requirements. It is intentionally minimal and should be refined together with the resource model.

### Site prefix convention

- `/sites/{siteId}/` acts as a filter on read paths (equivalent to `?siteId=xxx`)
- `/sites/{siteId}/` acts as an enforcement on write paths
- Translation views only use `/sites/{siteId}/` path style (no global listing)
- `?unbound=true` on `/robots` returns only orphan robots

### Robot-related paths

- `GET /robots` - list all robots across all sites, including orphans
- `GET /robots?siteId={siteId}` - list robots filtered by site (equivalent to `/sites/{siteId}/robots`)
- `GET /robots?unbound=true` - list only orphan robots
- `GET /sites/{siteId}/robots` - list robots for a specific site (no orphans, equivalent to `GET /robots?siteId=xxx`)
- `GET /robots/{robotId}` - get robot detail
- `POST /robots` - create a robot (can be orphan if `siteId` not provided)
- `POST /sites/{siteId}/robots` - create a robot with site binding
- `PATCH /robots/{robotId}` - update robot mutable fields including `siteId`
- `GET /robots/{robotId}/factsheet` - get robot factsheet (no site requirement)
- `GET /robots/{robotId}/instant-actions` - list instant actions for a robot
- `POST /robots/{robotId}/instant-actions` - trigger an instant action (gate by action type, see Operation Gate Rules)
- `GET /robots/{robotId}/instant-actions/{instantActionId}` - get instant action detail

### Order-related paths

- `GET /orders` - list all orders across all sites
- `GET /orders?siteId={siteId}` - list orders filtered by site (equivalent to `/sites/{siteId}/orders`)
- `GET /sites/{siteId}/orders` - list orders for a specific site (equivalent to `GET /orders?siteId=xxx`)
- `GET /orders/{orderId}` - get order detail
- `POST /sites/{siteId}/orders` - create an order for a specific site (site ID enforced in path, immutable after creation)

### Map-related paths (translation views, read-only)

- `GET /sites/{siteId}/maps` - list maps for a site
- `GET /sites/{siteId}/maps/{mapId}` - get map detail

### Zone set-related paths (translation views, read-only)

- `GET /sites/{siteId}/zonesets` - list zone sets for a site
- `GET /sites/{siteId}/zonesets/{zoneSetId}` - get zone set detail
- `GET /sites/{siteId}/zonesets/{zoneSetId}/zones` - list zones under a zone set
- `GET /sites/{siteId}/zonesets/{zoneSetId}/zones/{zoneId}` - get zone detail

### Navigation graph-related paths (translation views, read-only)

- `GET /sites/{siteId}/navigationgraphs` - list navigation graphs for a site
- `GET /sites/{siteId}/navigationgraphs/{navigationGraphId}` - get navigation graph detail

### Fleet overview paths

- `GET /sites/{siteId}/fleet/overview` - get fleet overview for a specific site (site context required)

### Notes

- `factsheet` is modeled as a robot-related view, not as a standalone primary resource.
- `factsheet` follows VDA5050 factsheet communication semantics and is exposed here as a management view only.
- `map`, `zoneSet`, and `navigationGraph` are peer translation resources, each mapping to a distinct Spatial collection.
- `zone` belongs to `zoneSet`, not to `map`.
- `instantAction` is robot-scoped and triggered via `POST /robots/{robotId}/instant-actions`. Gate rules apply at creation time.
- `orders` are created via site-scoped paths and managed in this API using VDA5050-aligned order concepts. Execution and robot-side lifecycle remain in Fleet Control.
- Robot `siteId` is mutable via `PATCH /robots/{robotId}`; consistency with physical position should be maintained.
- This outline keeps the first version focused on management views and order submission, with control actions separated from robot-side execution behavior.
