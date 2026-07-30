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
- `instantAction`

Resource scope:

- `robot` represents the mobile robot in VDA5050 terminology.
- `order` follows VDA5050 order semantics. This API defines the management-side creation and read views for orders, while execution and state propagation are handled through Fleet Control.
- `map` represents spatial reference data and is split into `navigation graph` and `zone`.
- `instantAction` is the command surface for predefined actions such as `cancelOrder` and `factsheetRequest`, matching the VDA5050 instant action concept.
- `factsheet` is communicated by the mobile robot after a `factsheetRequest` instant action and is not modeled as a standalone primary resource.
- Errors and warnings are represented as part of mobile robot state and information, not as a separate alert resource.

## Required Capabilities

The API should support:

- Listing robots
- Retrieving robot details
- Listing orders
- Retrieving order details
- Creating orders
- Retrieving fleet overview data
- Querying maps
- Querying navigation graphs
- Querying zones
- Triggering predefined instant actions such as `cancelOrder` and `factsheetRequest`

## Non-Goals

The following areas are out of scope for this API:

- Route planning
- Map editing
- Real-time robot communication
- Fleet Control message transport details
- Internal Spatial API implementation details

## Data Freshness

- Data should be near real time.
- A delay of a few seconds is acceptable.
- Real-time behavior will be handled by asynchronous APIs, not by this OpenAPI contract.

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

## Design Direction

The next design step is to translate these requirements into a resource model and API structure:

1. Confirm resource boundaries.
2. Define list, detail, and summary views.
3. Map resources to paths and operations.
4. Align schemas, examples, and error models.
5. Verify naming consistency with the repository documentation and product scope.

## Draft OpenAPI Path Outline

This is a rough path design based on the current requirements. It is intentionally minimal and should be refined together with the resource model.

### Robot-related paths

- `GET /robots` - list robots
- `GET /robots/{robotId}` - get robot detail
- `GET /robots/{robotId}/factsheet` - get robot factsheet data as a robot-related view

### Order-related paths

- `GET /orders` - list orders
- `GET /orders/{orderId}` - get order detail
- `POST /orders` - create an order for management submission

### Order schema notes

- The creation payload should accept the VDA5050-compatible order structure rather than a simplified custom order shape.
- Order summary and detail views may add management metadata, but the underlying order content should remain VDA5050-compatible.

### Instant action paths

- `POST /instant-actions` - trigger an instant action such as `cancelOrder` or `factsheetRequest`
- `GET /robots/{robotId}/instant-actions` - list instant actions for a robot state view, if history is exposed
- `GET /robots/{robotId}/instant-actions/{instantActionId}` - get instant action detail from the robot state view, if needed

### Instant action schema notes

- Instant actions should be modeled as arrays of VDA5050 action objects.
- The action fields should remain compatible with the VDA5050 action schema and action status model.

### Map-related paths

- `GET /maps` - list maps
- `GET /maps/{mapId}` - get map detail
- `GET /maps/{mapId}/navigation-graph` - get the navigation graph part of a map
- `GET /maps/{mapId}/zones` - list zones under a map
- `GET /maps/{mapId}/zones/{zoneId}` - get a specific zone

### Map and zone schema notes

- Map details should reuse VDA5050-compatible identifiers and status fields where they describe the same map concept.
- Zones should follow the VDA5050 zone set structure, including zone identifiers, type, geometry vertices, and zone-specific actions when exposed.
- If the management API exposes a navigation graph view, its node and edge fields should stay aligned with the VDA5050 order and state terminology rather than introducing a second naming scheme for the same geometry.

### Fleet overview paths

- `GET /fleet/overview` - get fleet-level summary data

### Notes

- `factsheet` is modeled as a robot-related view, not as a standalone primary resource.
- `factsheet` follows VDA5050 factsheet communication semantics and is exposed here as a management view only.
- `navigation graph` and `zone` are treated as map sub-resources.
- `instantAction` is modeled as a top-level command resource. Any history exposed under `robot` should be treated as a robot state view.
- `orders` are created and managed in this API using VDA5050-aligned order concepts. Execution and robot-side lifecycle remain in Fleet Control.
- This outline keeps the first version focused on management views and order submission, with control actions separated from robot-side execution behavior.
