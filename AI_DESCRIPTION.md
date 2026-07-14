# AI Description

This document defines AI-facing context, writing rules, and execution workflow for the SyriusOrbit contract repository.

## Scope and Source of Truth

`syrius-orbit-contracts` is the single source of truth for all interface contracts in SyriusOrbit.

This repository contains:

- OpenAPI contracts for synchronous HTTP APIs
- AsyncAPI contracts for asynchronous MQTT messaging

All downstream components must implement or generate code from these contracts, including C++ Daemon, optional C++ SDK integrations, Java cloud services, TypeScript console applications, and integration tests.

## Architecture Snapshot

SyriusOrbit is a spatial information and scheduling platform for indoor AMRs with edge-cloud collaboration.

- Edge side:
	- C++ local Daemon for low-latency interaction and robot protocol adaptation
	- Optional C++ SDK for application integration through local IPC
	- AMR applications can integrate directly with the Daemon without using the SDK
	- HTTP and MQTT interfaces exposed by the Daemon
- Cloud side:
	- Java Spring Cloud microservices
	- Robot scheduling, task execution, spatial data services, map version management
	- Route planning with operations research solvers (including TSP)
	- Resource locking, moving feature services, and digital twin services

Local and cloud interfaces are intentionally aligned.

- Local communication: no TLS, access control via operating system file permissions
- Cloud communication: TLS 1.3, mTLS, and OAuth2 JWT authorization

## Standards and Support Status

- VDA 5050: Standardized interface for task dispatch and state feedback between AMRs and fleet management systems.
- MRIS (Mobile Robot Interoperability Standard): Standardized interoperability model for robot state exchange with schedulers and external enterprise systems.
- ISO 21423: Planned support after the standard is formally published.
- OGC API Common: Shared foundation for OGC API resource-oriented REST patterns.
- OGC API Features: Standard interface for creating, updating, and querying geospatial features.
- OGC API Maps: Standard interface for requesting rendered map outputs.
- OGC API Coverages: Standard interface for accessing coverage data such as rasters and point clouds.
- OGC API Routes: Standard interface for route planning and route result retrieval.
- OGC API Moving Features: Standard interface for querying trajectories of moving objects over space and time.
- OGC API Schemas: Standard mechanism for publishing logical geospatial schemas independent of encoding format.

## Contract Authoring Rules

All contract definitions must satisfy these requirements:

- Numeric fields must explicitly declare `format` (for example `int64`, `float`, `double`)
- Time fields must use `date-time` in RFC 3339 format
- Every operation must define an explicit `operationId`
- Response codes must include at least `200`, `400`, `404`, and `500`

## Specification Flexibility and Project Profiling

Many supported standards cannot be fully and uniquely constrained by a single interface description language alone (such as OpenAPI or AsyncAPI), and therefore allow compliant implementation flexibility beyond schema text.

For OGC APIs, official OGC OpenAPI examples demonstrate valid standard-conformant patterns, but they are not the only valid way to satisfy the standards.

This project intentionally reduces that flexibility for SyriusOrbit scenarios by defining stricter, contract-first expressions in OpenAPI and AsyncAPI.

Authoring guidance:

- Use OGC official examples in the `ogc_official_examples/` directory as primary style and structure references
- Keep SyriusOrbit YAML files as close as practical to those example authoring conventions
- Apply project-specific strict constraints when multiple standard-compliant modeling choices are possible

## Agent Workflow (Codex, Claude Code, and Similar Tools)

When an AI agent updates this repository, use the workflow below:

1. Read related contract files and neighboring specs before editing.
2. Make the smallest change set that satisfies the request.
3. Preserve naming style, file organization, and existing schema conventions.
4. Verify structural consistency across related OpenAPI and AsyncAPI files.
5. Summarize what changed, why it changed, and what remains out of scope.

## Validation and Definition of Done

A change is complete only when all checks below pass:

- No schema-level contradiction with related contracts in this repository
- Required authoring rules in this document are fully satisfied
- Paths, operations, schemas, and message models are internally consistent
- Modified examples remain valid with updated schema constraints
- No unrelated files are changed

## Change Boundaries and Safety Rules

- Do not introduce breaking changes unless explicitly requested.
- Do not rewrite large sections when a scoped edit is sufficient.
- Do not invent unsupported product features or standards claims.
- If a required detail is unknown, keep behavior conservative and note the assumption explicitly.

## Language Policy (Mandatory)

The entire SyriusOrbit project is English-only.

- Do not use any non-English text in contracts, documentation, comments, examples, metadata, or AI-generated content.
- Keep identifiers, summaries, and descriptions fully in English.
- If non-English content is found, replace it with equivalent English text.

This policy is mandatory for both human-authored and AI-generated artifacts.

## Quick Checklist for AI Agents

Before finalizing any change, confirm all items below:

- Scope is contract-focused and aligned with repository purpose
- Standards references match the support status in this file
- Authoring rules (`format`, `date-time`, `operationId`, status codes) are satisfied
- Output text is fully English
- Change summary is explicit and limited to actual edits