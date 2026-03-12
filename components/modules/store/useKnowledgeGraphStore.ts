import { create } from 'zustand';
import * as d3 from 'd3';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: number;
  level: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
}

interface KnowledgeGraphState {
  nodes: GraphNode[];
  links: GraphLink[];
  isGenerating: boolean;
  hasGenerated: boolean;
  setGraphData: (nodes: GraphNode[], links: GraphLink[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  generateGraph: (text: string, aiResponse: string, apiEndpoint: string) => Promise<void>;
}

export const useKnowledgeGraphStore = create<KnowledgeGraphState>((set) => ({
  nodes: [],
  links: [],
  isGenerating: false,
  hasGenerated: false,
  setGraphData: (nodes, links) => set({ nodes, links, hasGenerated: true }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  generateGraph: async (text, aiResponse, apiEndpoint) => {
    set({ isGenerating: true });

    // Get modelName from AiChatStore (we can't easily import the hook here, so we will pass it or read it)
    // Actually, we can just import the store state directly
    const { useAiChatStore } = await import('@/components/modules/AiChatModule');
    const modelName = useAiChatStore.getState().modelName;

    const prompt = `
You are a knowledge graph generator. Based on the user's personal views (Input) and the AI's response (Context), extract core direction nodes from the personal views. Then connect them to principles and detailed breakdowns based on the context.

Input: ${text}
Context: ${aiResponse}

Ensure the graph is top-down: core views (level 0) connect to principles (level 1), which connect to details (level 2).

You MUST return ONLY a valid JSON object with the following structure, and nothing else:
{
  "nodes": [
    { "id": "string", "label": "string", "group": number, "level": number }
  ],
  "links": [
    { "source": "string", "target": "string", "label": "string" }
  ]
}
`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          system_prompt: "You are a JSON generator. Output only valid JSON.",
          input: prompt
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      let content = data.response || data.content || data.choices?.[0]?.message?.content || "";
      
      // Clean up markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const parsed = JSON.parse(content);
      if (parsed.nodes && parsed.links) {
        set({ nodes: parsed.nodes, links: parsed.links, hasGenerated: true });
      }
    } catch (error) {
      console.error('Error generating graph:', error);
      set({
        nodes: [
          { id: "error", label: "图谱生成失败", group: 1, level: 0 },
          { id: "error_detail", label: "请检查网络或重试", group: 1, level: 1 }
        ],
        links: [
          { source: "error", target: "error_detail", label: "状态" }
        ],
        hasGenerated: true
      });
    } finally {
      set({ isGenerating: false });
    }
  }
}));
