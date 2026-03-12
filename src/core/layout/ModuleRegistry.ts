import { SystemStatusModule } from '@/components/modules/SystemStatusModule';
import { AiChatModule } from '@/components/modules/AiChatModule';
import { FocusModule } from '@/components/modules/FocusModule';
import { VulnerabilityModule } from '@/components/modules/VulnerabilityModule';
import { KnowledgeGraphModule } from '@/components/modules/KnowledgeGraphModule';
import { ComputeModule } from '@/components/modules/ComputeModule';
import { QuickTestModule } from '@/components/modules/QuickTestModule';
import { SettingsModule } from '@/components/modules/SettingsModule';

export interface ModuleProps {
  isExpanded?: boolean;
}

export interface ModuleConfig {
  id: string;
  name: string;
  component: React.FC<ModuleProps>;
  colSpan?: 1 | 2 | 3 | 4 | 5;
  rowSpan?: 1 | 2 | 3 | 4 | 5;
  theme?: 'light' | 'dark' | 'red' | 'transparent';
  expandedTheme?: 'light' | 'dark' | 'red' | 'transparent';
  shape?: 'square' | 'rect' | 'circle';
  expandable?: boolean;
}

export const MODULE_REGISTRY: Record<string, ModuleConfig> = {
  'system-status': { id: 'system-status', name: 'System Status', component: SystemStatusModule, theme: 'dark' },
  'ai-chat': { id: 'ai-chat', name: 'AI Chat Prompt', component: AiChatModule, colSpan: 3, expandable: true },
  'focus': { id: 'focus', name: 'Focus Timer', component: FocusModule, theme: 'red', shape: 'circle' },
  'vulnerability': { id: 'vulnerability', name: 'Vulnerability', component: VulnerabilityModule, expandable: true },
  'knowledge-graph': { id: 'knowledge-graph', name: 'Knowledge Graph', component: KnowledgeGraphModule, theme: 'dark', colSpan: 2, rowSpan: 2, expandable: true },
  'compute': { id: 'compute', name: 'Compute Monitor', component: ComputeModule },
  'quick-test': { id: 'quick-test', name: 'Quick Test', component: QuickTestModule, expandable: true },
  'settings': { id: 'settings', name: 'Settings', component: SettingsModule, theme: 'dark', expandedTheme: 'transparent', expandable: true },
};
