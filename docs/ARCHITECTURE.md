# NODE_LEARN OS 架构说明

为了在当前 Web 预览环境中展示您所设计的“垂直集成金字塔架构 (V2.2)”以及“微前端 (Module Federation)”理念，我们对目录结构进行了如下划分。

由于当前环境为基于浏览器的 Next.js 预览环境，无法直接运行 Electron、本地 SQLite 或 ONNX 模型，因此我们：
1. **构建了完整的 UI 外壳 (Shell)**：使用 React + Tailwind + Framer Motion 还原了 Nothing 风格的 Bento Grid 界面。
2. **预留了架构目录**：在 `src/` 下为您预留了完整的金字塔架构目录，供您后续在本地 Electron 环境中直接接入。
3. **提供了 Electron 专属依赖配置**：请查看根目录下的 `package.electron.json`。

## 目录结构预留 (The Pyramid Architecture)

```text
/src
├── core/                       # [顶层/中层] 系统核心层 (The Shell / Container)
│   ├── shell/                  # Electron 外壳与窗口管理
│   ├── bridge/                 # 全局总线 (Event Bus / Signal Bridge)
│   └── layout/                 # 动态网格控制器 (Layout Engine)
│
├── modules/                    # [中层/底层] 模块插件层 (The Modules / Widgets)
│   ├── focus/                  # 示例：专注模块 (Tomato Timer)
│   │   ├── view/               # UI 与交互组件 (React)
│   │   ├── logic/              # 路由、权限与信号 (Zustand)
│   │   └── runtime/            # 私有容器层 (SQLite, Models)
│   │
│   ├── ai-chat/                # 示例：AI 对话模块
│   └── knowledge-graph/        # 示例：知识图谱模块
│
└── lib/
    ├── contracts/              # 通讯协议 (Data Contract - Zod Schemas)
    └── capabilities/           # 隔离与高性能计算 (ONNX, SQLite wrappers)
```

## 依赖说明 (Dependencies)

您要求的依赖已分为两部分处理：
1. **UI 与模组开发 (UI & Module Federation)**：`framer-motion`, `zustand`, `zod`, `nanoid` 等已直接安装在当前项目的 `package.json` 中，以驱动当前的预览界面。
2. **核心底座与隔离计算 (Electron & Core)**：`electron`, `better-sqlite3`, `onnxruntime-node` 等原生依赖已配置在 `package.electron.json` 中。在您本地开发时，可直接将其合并到主 `package.json` 中。
