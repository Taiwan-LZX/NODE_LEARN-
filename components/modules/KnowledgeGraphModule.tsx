'use client';
import { useEffect, useRef } from 'react';
import { ModuleProps } from '@/src/core/layout/ModuleRegistry';
import { useAiChatStore } from '@/components/modules/AiChatModule';
import { useKnowledgeGraphStore, GraphNode, GraphLink } from '@/components/modules/store/useKnowledgeGraphStore';
import { Loader2, Network } from 'lucide-react';
import * as d3 from 'd3';

export function KnowledgeGraphModule({ isExpanded }: ModuleProps) {
  const { nodes, links, isGenerating, hasGenerated, generateGraph } = useKnowledgeGraphStore();
  const { text, aiResponse, apiEndpoint } = useAiChatStore();
  const svgRef = useRef<SVGSVGElement>(null);

  const handleGenerateGraph = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating || !text) return;
    await generateGraph(text, aiResponse, apiEndpoint);
  };

  useEffect(() => {
    if (!isExpanded || !hasGenerated || !svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40))
      .force("x", d3.forceX<GraphNode>().strength(0.1).x(d => width / 2 + (d.group * 100 - 150)))
      .force("y", d3.forceY<GraphNode>().strength(0.1).y(height / 2));

    // Add a group for zooming/panning
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-width", 1.5);

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node circles
    node.append("circle")
      .attr("r", d => d.level === 0 ? 24 : d.level === 1 ? 18 : 12)
      .attr("fill", d => {
        if (d.level === 0) return "#EB0000"; // Core nodes are red
        // Different shades of gray/white for other levels
        return d.level === 1 ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)";
      })
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 2);

    // Node labels
    node.append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", d => (d.level === 0 ? 32 : d.level === 1 ? 26 : 20))
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-family", "monospace")
      .attr("font-size", d => d.level === 0 ? "12px" : "10px")
      .attr("opacity", 0.8);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [isExpanded, hasGenerated, nodes, links]);

  // Unloaded State UI
  if (!hasGenerated) {
    return (
      <div className="flex flex-col h-full">
        <div className="font-mono uppercase text-[11px] tracking-wider flex items-center gap-2">
          <Network size={12} />
          KNOWLEDGE_GRAPH
        </div>
        
        <div className="mb-10">
          <div className={`${isExpanded ? 'text-4xl mt-8' : 'text-2xl mt-2'} font-black leading-none transition-all opacity-50`}>
            AWAITING_CONTEXT
          </div>
          <div className="font-mono uppercase text-[11px] tracking-wider text-accent-red mt-2">
            &gt;&gt; 0 NODES DETECTED
          </div>
        </div>

        {isExpanded ? (
          <div className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center">
            <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
              <Network size={24} className="text-white/40" />
            </div>
            <p className="font-mono text-[10px] opacity-40 max-w-[250px] text-center leading-relaxed mb-8">
              Graph will be synthesized from your personal views and AI responses.
            </p>
            
            <button
              onClick={handleGenerateGraph}
              disabled={isGenerating || !text}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:hover:bg-white/5 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Synthesizing...
                </>
              ) : (
                'Organize Graph'
              )}
            </button>
          </div>
        ) : (
          <>
            <svg className="absolute -right-5 -bottom-5 opacity-10 hidden md:block" width="200" height="200" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="2" fill="white"/>
              <circle cx="20" cy="30" r="2" fill="white"/>
              <circle cx="80" cy="40" r="2" fill="white"/>
              <circle cx="40" cy="80" r="2" fill="white"/>
              <line x1="50" y1="50" x2="20" y2="30" stroke="white" strokeWidth="0.5"/>
              <line x1="50" y1="50" x2="80" y2="40" stroke="white" strokeWidth="0.5"/>
              <line x1="50" y1="50" x2="40" y2="80" stroke="white" strokeWidth="0.5"/>
            </svg>
            <div className="font-mono uppercase text-[11px] tracking-wider z-10 mt-auto opacity-50">
              {text ? 'Click to organize' : 'Input required'}
            </div>
          </>
        )}
      </div>
    );
  }

  // Loaded State UI
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center shrink-0 mb-4 z-10">
        <div className="font-mono uppercase text-[11px] tracking-wider flex items-center gap-2">
          <Network size={12} className="text-accent-red" />
          KNOWLEDGE_GRAPH
        </div>
        {isExpanded && (
          <button
            onClick={handleGenerateGraph}
            disabled={isGenerating}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 bg-white/5 hover:bg-white/10 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={10} className="animate-spin" /> : 'Regenerate'}
          </button>
        )}
      </div>
      
      {!isExpanded ? (
        <>
          <div className="mb-10">
            <div className="text-2xl mt-2 font-black leading-none transition-all truncate">
              {nodes.filter(n => n.level === 0).map(n => n.label).join(' & ') || 'Synthesized Graph'}
            </div>
            <div className="font-mono uppercase text-[11px] tracking-wider text-accent-red mt-2">
              &gt;&gt; {nodes.length} Nodes / {links.length} Links
            </div>
          </div>
          
          {/* Mini preview for unexpanded state */}
          <svg className="absolute -right-5 -bottom-5 opacity-20 hidden md:block" width="150" height="150" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="4" fill="#EB0000"/>
            <circle cx="20" cy="30" r="2" fill="white"/>
            <circle cx="80" cy="40" r="2" fill="white"/>
            <circle cx="40" cy="80" r="2" fill="white"/>
            <line x1="50" y1="50" x2="20" y2="30" stroke="white" strokeWidth="0.5"/>
            <line x1="50" y1="50" x2="80" y2="40" stroke="white" strokeWidth="0.5"/>
            <line x1="50" y1="50" x2="40" y2="80" stroke="white" strokeWidth="0.5"/>
          </svg>
          <div className="font-mono uppercase text-[11px] tracking-wider z-10 mt-auto opacity-50">Click to expand</div>
        </>
      ) : (
        <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center -mt-12">
          <svg ref={svgRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 font-mono text-[10px] uppercase tracking-widest space-y-2 bg-black/60 p-4 rounded-xl backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent-red"></span>
              Core Views
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white/80"></span>
              Principles
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white/40"></span>
              Details
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
