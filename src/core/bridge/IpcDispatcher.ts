// src/core/bridge/IpcDispatcher.ts
// 检查点 2：IPC 通信模式是否「分层」(Communication Pattern)
// 这是一个明确的 ipcMain 分发器（Dispatcher），包含权限过滤器。

export class IpcDispatcher {
  /**
   * 权限过滤器：检查模块是否有权访问特定资源
   * @param moduleId 发起请求的模块 ID
   * @param resource 请求访问的资源或操作
   */
  static validateAccess(moduleId: string, resource: string): boolean {
    // 模拟权限校验逻辑：主进程会检查该模块 ID 是否有权访问这个数据库或 API
    console.log(`[IPC Dispatcher] Validating access for module [${moduleId}] to resource [${resource}]`);
    
    // 假设 manifest.json 中定义了权限，这里进行比对
    // if (!manifest[moduleId].permissions.includes(resource)) return false;
    
    return true;
  }

  /**
   * 统一的 IPC 消息分发入口
   */
  static dispatch(moduleId: string, action: string, payload: any) {
    if (!this.validateAccess(moduleId, action)) {
      throw new Error(`[IPC Security] Access denied for module ${moduleId} to action ${action}`);
    }
    
    // 路由到具体的处理逻辑 (例如：SQLite 读写、ONNX 推理)
    console.log(`[IPC Dispatcher] Routing action [${action}] from module [${moduleId}]`, payload);
    
    // return Router.handle(action, payload);
  }
}
