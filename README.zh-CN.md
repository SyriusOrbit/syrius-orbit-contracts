# syrius-orbit-contracts

`syrius-orbit-contracts` 是 SyriusOrbit 的契约仓库。SyriusOrbit 是一个面向室内自主移动机器人（AMR）的空间信息与调度服务平台，基于边云协同架构构建。

本仓库是平台中所有 API 契约的唯一事实来源。

本仓库定义了两套 API：

- SyriusOrbit Spatial API：基于 OpenAPI 的契约套件，用于空间数据与地理信息服务，并与 OGC API 系列保持一致。
- SyriusOrbit Fleet API：基于 AsyncAPI 的契约套件，用于机器人通信、调度与车队消息，并与 VDA 5050 及相关机器人互操作标准保持一致。

## SyriusOrbit 平台上下文

SyriusOrbit 采用混合边云系统架构：

- 边缘侧：
	- 一个使用 C++ 实现的本地 Daemon
	- 一个轻量级 C++ SDK，用于机器人业务应用
- 云侧：
	- 一个 Java Spring Cloud 微服务集群，提供企业级能力

该平台提供空间数据服务、机器人调度和任务执行能力。

## 边缘架构

边缘技术栈包括：

- C++ Daemon：
	- 处理低延迟本地交互
	- 适配机器人协议
	- 暴露 HTTP 和 MQTT 服务接口
- C++ SDK：
	- 可选的集成层，用于机器人业务程序
	- AMR 开发者可以直接集成 Daemon，而无需使用 SDK

本地 Daemon 与云服务暴露完全一致的接口。主要差异在于传输安全行为：

- 本地边缘通信：
	- 不启用 TLS
	- 访问控制依赖操作系统文件权限
- 云通信：
	- 强制使用 TLS 1.3
	- 强制使用双向 TLS（mTLS）
	- 使用 OAuth2 JWT 进行身份识别和授权

## 云架构

云端技术栈基于 Java Spring Cloud 微服务，提供以下能力：

- 多租户管理
- 机器人调度
- 任务执行服务
- 空间数据服务
- 地图版本管理
- 使用运筹优化求解器的路径规划（包括 TSP）
- 资源锁定
- 移动实体特征服务
- 数字孪生服务

## 标准覆盖范围

下列所有标准都必须通过以下方式被严格定义和约束：

- OpenAPI 用于 SyriusOrbit Spatial API
- AsyncAPI 用于 SyriusOrbit Fleet API

### SyriusOrbit Fleet API 标准

- VDA 5050：用于 AGV/AMR 车队与车队管理系统之间任务下发和状态反馈的标准化通信接口。
- MRIS（Mobile Robot Interoperability Standard）：用于机器人、调度器和外部企业系统之间机器人状态交换的互操作标准。
- ISO 21423（Robotics - Industrial mobile robots - Communications and interoperability）：一旦该标准正式发布，将支持这一面向工业移动机器人的互操作标准。

### SyriusOrbit Spatial API 标准（OGC API 系列）

- OGC API Common：定义共享的、面向资源和 REST 风格模式的 OGC API 基础。
- OGC API Features：用于创建、更新和查询地理要素数据的标准接口。
- OGC API Maps：用于获取静态或动态地图输出的标准地图渲染接口。
- OGC API Coverages：用于访问栅格和点云等覆盖数据的标准接口。
- OGC API Routes：用于计算和获取路线结果的标准路径规划接口。
- OGC API Moving Features：用于按空间和时间查询移动实体轨迹的标准接口。
- OGC API Schemas（OGC API Common Part 3）：用于发布与编码格式无关的逻辑地理模式的标准机制。

## 仓库在生态中的角色

本仓库是 SyriusOrbit 生态中 API 契约的唯一事实来源。

所有组件都必须从这些契约生成代码，或基于这些契约实现：

- C++ SDK
- C++ Daemon
- Java 云微服务
- TypeScript 前端控制台
- 集成测试套件

这种契约优先的方式确保了跨语言的接口一致性、兼容性以及整个平台中可预测的集成行为。