# SyriusOrbit Fleet Management API Requirements

## Purpose

The SyriusOrbit Fleet Management API provides the HTTP management surface for fleet operators and frontend operators. It is intended for operational visibility and management, not for real-time robot communication.

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

- `robot` is the primary fleet entity.
- `order` is the core scheduling and execution entity, aligned with VDA5050 semantics.
- `map` represents spatial reference data and is split into `navigation graph` and `zone`.
- `instantAction` is a separate immediate control capability and must be considered in the requirement analysis.
- `factsheet` is returned as part of `robot` detail and is not modeled as a standalone primary resource.
- Alerts are not modeled as a separate resource; they are displayed as part of robot information.

## Required Capabilities

The API should support:

- Listing robots
- Retrieving robot details
- Listing orders
- Retrieving order details
- Retrieving fleet overview data
- Querying maps
- Querying navigation graphs
- Querying zones
- Supporting instantAction-related capabilities

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

## Design Direction

The next design step is to translate these requirements into a resource model and API structure:

1. Confirm resource boundaries.
2. Define list, detail, and summary views.
3. Map resources to paths and operations.
4. Align schemas, examples, and error models.
5. Verify naming consistency with the repository documentation and product scope.
