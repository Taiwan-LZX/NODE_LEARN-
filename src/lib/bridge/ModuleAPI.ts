// src/lib/bridge/ModuleAPI.ts
// 检查点 1：依赖边界是否明确 (Dependency Boundary)
// UI 层 (components/modules/) 严禁直接 import 'better-sqlite3' 或 'onnxruntime-node'。
// 它们必须通过这个统一的 API 接口与底层交互。

export class ModuleAPI {
  private moduleId: string;

  constructor(moduleId: string) {
    this.moduleId = moduleId;
  }

  /**
   * 向主进程发送请求 (底层通过 IPC 传输)
   */
  async request(action: string, payload: any): Promise<any> {
    console.log(`[ModuleAPI] Module ${this.moduleId} requesting ${action}`);
    
    // 在 Electron 环境中，这里会调用 window.electron.ipcRenderer.invoke
    // return await window.electron.ipcRenderer.invoke('module-request', {
    //   moduleId: this.moduleId,
    //   action,
    //   payload
    // });
    
    return Promise.resolve({ status: 'simulated_success' });
  }

  // 封装常用的底层能力调用
  async queryDatabase(sql: string, params: any[]) {
    return this.request('db:query', { sql, params });
  }

  async runInference(modelName: string, input: any) {
    return this.request('ai:infer', { modelName, input });
  }
}
