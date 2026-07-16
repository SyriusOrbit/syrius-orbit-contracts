# syrius-orbit-contracts

中文版本请见 [README.zh-CN.md](README.zh-CN.md)

`syrius-orbit-contracts` is the contract repository for SyriusOrbit, a spatial information and scheduling service platform for indoor Autonomous Mobile Robots (AMRs) built on an edge-cloud collaborative architecture.

This repository is the single source of truth for all API contracts used across the platform.

The repository defines two API suites:

- SyriusOrbit Spatial API: the OpenAPI-based contract suite for spatial data and geospatial services, aligned with the OGC API family.
- SyriusOrbit Fleet API: the AsyncAPI-based contract suite for robot communication, scheduling, and fleet messaging, aligned with VDA 5050 and related robot interoperability standards.

## SyriusOrbit Platform Context

SyriusOrbit is designed as a hybrid edge-cloud system:

- Edge side:
	- A local Daemon implemented in C++
	- A lightweight C++ SDK for robot business applications
- Cloud side:
	- A Java Spring Cloud microservice cluster for enterprise capabilities

The platform provides spatial data services, robot scheduling, and task execution.

## Edge Architecture

The edge stack includes:

- C++ Daemon:
	- Handles low-latency local interactions
	- Adapts robot protocols
	- Exposes HTTP and MQTT service interfaces
- C++ SDK:
	- Optional integration layer for robot business programs
	- AMR developers can integrate directly with the Daemon without using the SDK

The local Daemon and cloud services expose fully consistent interfaces. The key difference is transport security behavior:

- Local edge communication:
	- TLS is not enabled
	- Access control relies on operating system file permissions
- Cloud communication:
	- TLS 1.3 is mandatory
	- Mutual TLS (mTLS) is mandatory
	- OAuth2 JWT is used for identity and authorization

## Cloud Architecture

The cloud stack is implemented with Java Spring Cloud microservices and delivers:

- Tenant-aware management
- Robot scheduling
- Task execution services
- Spatial data services
- Map version management
- Route planning with operations research solvers (including TSP)
- Resource locking
- Moving feature services
- Digital twin services

## Standards Coverage

All standards listed below must be strictly defined and constrained through:

- OpenAPI for the SyriusOrbit Spatial API
- AsyncAPI for the SyriusOrbit Fleet API

### SyriusOrbit Fleet API Standards

- VDA 5050: Standardized communication interface for task dispatch and state feedback between AGV/AMR fleets and fleet management systems.
- MRIS (Mobile Robot Interoperability Standard): Interoperability standard for robot state exchange among robots, schedulers, and external enterprise systems.
- ISO 21423 (Robotics - Industrial mobile robots - Communications and interoperability): Planned support for this upcoming industrial mobile robot interoperability standard once it is formally published.

### SyriusOrbit Spatial API Standards (OGC API Family)

- OGC API Common: Core OGC API foundation defining shared resource-oriented and RESTful patterns.
- OGC API Features: Standard interface for creating, updating, and querying geospatial feature data.
- OGC API Maps: Standard map rendering interface for retrieving static or dynamic map outputs.
- OGC API Coverages: Standard access interface for coverage data such as rasters and point clouds.
- OGC API Routes: Standard route-planning interface for computing and retrieving route results.
- OGC API Moving Features: Standard interface for querying trajectories of moving entities over space and time.
- OGC API Schemas (OGC API Common Part 3): Standard mechanism for publishing logical geospatial schemas independent of encoding format.

## Repository Role in the Ecosystem

This repository is the only source of truth for API contracts in the SyriusOrbit ecosystem.

All components must generate code from, or implement against, these contracts:

- C++ SDK
- C++ Daemon
- Java cloud microservices
- TypeScript frontend console
- Integration test suites

This contract-first approach ensures strict interface consistency, compatibility across languages, and predictable integration behavior across the full platform.
