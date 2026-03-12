// src/core/shell/StorageManager.ts
// 检查点 3：模型与数据的物理隔离配置 (Scoped Storage)
// 确保每个模块都有独立的 /storage 目录，防止文件混乱。

import { nanoid } from 'nanoid';

export class StorageManager {
  /**
   * 当一个新模块被载入时，系统自动为其创建隔离的存储目录
   * @param moduleName 模块名称
   * @returns 分配的唯一 module_id
   */
  static allocateStorage(moduleName: string): string {
    const moduleId = `${moduleName}_${nanoid(8)}`;
    const storagePath = this.getStoragePath(moduleId);
    
    // 在真实的 Electron 环境中，这里会使用 fs-extra 创建物理文件夹
    // import fs from 'fs-extra';
    // fs.ensureDirSync(storagePath);
    
    console.log(`[Storage Manager] Allocated scoped storage for [${moduleName}] at [${storagePath}]`);
    
    return moduleId;
  }

  /**
   * 获取模块的私有存储路径 (Path Sandboxing)
   */
  static getStoragePath(moduleId: string): string {
    // 锁定在应用的 userData 目录下的隔离文件夹中
    // const userDataPath = app.getPath('userData');
    const userDataPath = '/app_data'; 
    return `${userDataPath}/storage/modules/${moduleId}`;
  }
}
