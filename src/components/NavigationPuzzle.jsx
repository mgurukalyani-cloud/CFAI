import React, { useState } from 'react';

export default function NavigationPuzzle() {
  // Complete 8-node syllabus database with precise academic parameters & profiling weights
  const [syllabusNodes] = useState([
    {
      id: 'co1_peas',
      title: 'Agent PEAS Model',
      co: 'CO1: Introduction',
      icon: '🤖',
      metrics: [
        { label: 'Environment Type', value: 'Partially Observable' },
        { label: 'Sensory Processing', value: 'O(N) Complexity' },
        { label: 'Actuator Execution Flow', value: 'O(1) Real-Time' },
        { label: 'Knowledge Base', value: 'Static Rule Sets' }
      ],
      graphWeights: { nodes: 10, runtime: 5, memory: 8, efficiency: 95 }
    },
    {
      id: 'co1_ds',
      title: 'Complexity Aware Python DS',
      co: 'CO1: Core Units',
      icon: '🐍',
      metrics: [
        { label: 'State Representation', value: 'Dataclasses & Typing' },
        { label: 'Open Set Priority Q', value: 'Heaps / Dict / Set' },
        { label: 'Recursion Depth Limits', value: 'Stack Overhead' },
        { label: 'Trace Logging System', value: 'Step-by-Step Active' }
      ],
      graphWeights: { nodes: 25, runtime: 15, memory: 35, efficiency: 80 }
    },
    {
      id: 'co2_bfs',
      title: 'Uninformed BFS/DFS Search',
      co: 'CO2: Graph Space',
      icon: '🌳',
      metrics: [
        { label: 'Time Complexity Bound', value: 'O(b^d) / O(b^m)' },
        { label: 'Memory Allocation Peak', value: 'O(b^d) Exponential' },
        { label: 'Closed / Open Sets', value: 'Graph Traversal' },
        { label: 'Tie-Breaking Strategy', value: 'FIFO / LIFO Queue' }
      ],
      graphWeights: { nodes: 95, runtime: 85, memory: 90, efficiency: 15 }
    },
    {
      id: 'co2_astar',
      title: 'A* & Heuristic Design',
      co: 'CO2: Heuristics',
      icon: '✨',
      metrics: [
        { label: 'Admissibility Intution', value: 'h(n) <= h*(n)' },
        { label: 'Consistency Condition', value: 'h(n) <= c(n,a,n\') + h(n\')' },
        { label: 'Empirical Node Profile', value: 'Optimal F(n) Bounds' },
        { label: 'Memory Bounded Variant', value: 'IDA* Concept Only' }
      ],
      graphWeights: { nodes: 35, runtime: 20, memory: 70, efficiency: 90 }
    },
    {
      id: 'co3_backtrack',
      title: 'CSP Backtracking Model',
      co: 'CO3: Constraints',
      icon: '🧩',
      metrics: [
        { label: 'Variable Selection Logic', value: 'MRV & Degree Heuristics' },
        { label: 'Value Ordering Rule', value: 'LCV (Least Constraining)' },
        { label: 'Constraint Propagation', value: 'Forward Checking' },
        { label: 'Local Search Variant', value: 'Min-Conflicts' }
      ],
      graphWeights: { nodes: 55, runtime: 50, memory: 25, efficiency: 75 }
    },
    {
      id: 'co3_ac3',
      title: 'Arc Consistency (AC-3)',
      co: 'CO3: Propagation',
      icon: '🔗',
      metrics: [
        { label: 'Time Complexity Upper', value: 'O(c * d^3)' },
        { label: 'Domain Reduction Rate', value: 'Highly Adaptive' },
        { label: 'Explainability Trace', value: 'Constraint Failure Log' },
        { label: 'SAT-Intuition Engine', value: 'Light Modeling Tool' }
      ],
      graphWeights: { nodes: 20, runtime: 45, memory: 30, efficiency: 85 }
    },
    {
      id: 'co4_minimax',
      title: 'Minimax Matrix & Depth',
      co: 'CO4: Adversarial',
      icon: '⚔️',
      metrics: [
        { label: 'Game Tree Complexity', value: 'O(b^m) Traversal' },
        { label: 'Evaluation Functions', value: 'Static Utility Maps' },
        { label: 'Resource Cutoff Limits', value: 'Iterative Deepening' },
        { label: 'Stochastic Decisions', value: 'Expectimax Concept' }
      ],
      graphWeights: { nodes: 90, runtime: 95, memory: 75, efficiency: 20 }
    },
    {
      id: 'co4_alphabeta',
      title: 'Alpha-Beta Pruning Engine',
      co: 'CO4: Optimization',
      icon: '✂️',
      metrics: [
        { label: 'Pruned Branch Efficiency', value: 'O(b^(m/2)) Optimal' },
        { label: 'Search Bounds Condition', value: 'Alpha >= Beta Cutoff' },
        { label: 'Multi-Agent Reasoning', value: 'Rational Game State' },
        { label: 'Policy Selection Mode', value: 'Bounded Rationality' }
      ],
      graphWeights: { nodes: 40, runtime: 35, memory: 45, efficiency: 95 }
    }
  ]);

  const [selectedNode, setSelectedNode] = useState('co2_astar');

  // Fetch the graph weights for the currently selected syllabus item
  const currentWeights = syllabusNodes.find(n => n.id === selectedNode)?.graphWeights || { nodes: 0, runtime: 0, memory: 0, efficiency: 0 };

  return (
    <div style={styles.gridCanvasWrapper}>
      
      {/* MODULE MAIN TITLE HEADER */}
      <div style={styles.headerControlPanelRow}>
        <div>
          <h2 style={styles.gridSectionMasterHeadingText}>AI Core Syllabus Diagnostic Profiler Terminal</h2>
          <p style={styles.gridSectionSubtextSupportiveLabel}>
            Empirical runtime verification, heuristic accuracy, and memory space bounds evaluation console.
          </p>
        </div>
      </div>

      {/* 📦 HIGH-IMPRESSION MATRIX GRID (2 Rows x 4 Columns = Perfect Square Boxes) */}
      <div style={styles.perfectSquareBoxesGridStructure}>
        {syllabusNodes.map((node) => {
          const isCurrentActive = selectedNode === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              style={{
                ...styles.infrastructureSquareCardNodeBox,
                borderColor: isCurrentActive ? '#0284c7' : '#e2e8f0',
                backgroundColor: isCurrentActive ? '#f0f9ff' : '#ffffff',
                boxShadow: isCurrentActive ? '0 10px 15px -3px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              {/* Card Meta Badge Info Row */}
              <div style={styles.cardHeaderIconAndTitleRow}>
                <div style={{ ...styles.nodeIconAvatarBadge, backgroundColor: isCurrentActive ? '#e0f2fe' : '#f8fafc' }}>
                  {node.icon}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={styles.cardBlockMainTitleText}>{node.title}</h4>
                  <span style={styles.coBadgeTag}>{node.co}</span>
                </div>
              </div>

              {/* High-Density Structural Table Data Core */}
              <div style={styles.metricTableStructureSheet}>
                {node.metrics.map((metric, mIdx) => (
                  <div key={mIdx} style={styles.tableRowBorderLine}>
                    <span style={styles.tableKeyLabelText}>{metric.label}</span>
                    <span style={styles.tableValueOutputDataText}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 📊 LIVE EMPIRICAL PROFILING GRAPH PANEL */}
      <div style={styles.graphAnalyticsPanelFrame}>
        <div style={styles.graphPanelHeaderRow}>
          <h4 style={styles.graphPanelTitle}>📊 Real-Time Algorithmic Execution Benchmarks</h4>
          <span style={styles.liveConsoleBadge}>LOG STREAM ATTACHED: {syllabusNodes.find(n => n.id === selectedNode)?.title}</span>
        </div>
        
        <div style={styles.visualizationGraphChassisContainerWell}>
          {/* Bar 1: Node Expansions */}
          <div style={styles.graphColumnChassisStructure}>
            <div style={styles.barGraphTrackBackgroundChassis}>
              <div style={{ ...styles.barGraphActiveFillIndicatorProgress, height: `${currentWeights.nodes}%`, backgroundColor: '#3a86ff' }} />
            </div>
            <span style={styles.barValuePercentageLabelsRow}>{currentWeights.nodes}%</span>
            <span style={styles.barDescriptionMicroLabel}>Node Expansions</span>
          </div>

          {/* Bar 2: Execution Time */}
          <div style={styles.graphColumnChassisStructure}>
            <div style={styles.barGraphTrackBackgroundChassis}>
              <div style={{ ...styles.barGraphActiveFillIndicatorProgress, height: `${currentWeights.runtime}%`, backgroundColor: '#ff006e' }} />
            </div>
            <span style={styles.barValuePercentageLabelsRow}>{currentWeights.runtime}%</span>
            <span style={styles.barDescriptionMicroLabel}>Runtime Metric</span>
          </div>

          {/* Bar 3: Peak Memory Allocation */}
          <div style={styles.graphColumnChassisStructure}>
            <div style={styles.barGraphTrackBackgroundChassis}>
              <div style={{ ...styles.barGraphActiveFillIndicatorProgress, height: `${currentWeights.memory}%`, backgroundColor: '#8338ec' }} />
            </div>
            <span style={styles.barValuePercentageLabelsRow}>{currentWeights.memory}%</span>
            <span style={styles.barDescriptionMicroLabel}>Peak Memory Heap</span>
          </div>

          {/* Bar 4: Heuristic/Pruning Efficiency */}
          <div style={styles.graphColumnChassisStructure}>
            <div style={styles.barGraphTrackBackgroundChassis}>
              <div style={{ ...styles.barGraphActiveFillIndicatorProgress, height: `${currentWeights.efficiency}%`, backgroundColor: '#38b000' }} />
            </div>
            <span style={styles.barValuePercentageLabelsRow}>{currentWeights.efficiency}%</span>
            <span style={styles.barDescriptionMicroLabel}>Agent Efficiency</span>
          </div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  gridCanvasWrapper: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: '100%', boxSizing: 'border-box' },
  headerControlPanelRow: { borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' },
  gridSectionMasterHeadingText: { fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0', letterSpacing: '-0.2px' },
  gridSectionSubtextSupportiveLabel: { fontSize: '12px', color: '#64748b', margin: 0 },

  // 🎯 PERFECT SQUARE MATRIX (Grid mapping 4 elements per row evenly)
  perfectSquareBoxesGridStructure: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', width: '100%' },
  infrastructureSquareCardNodeBox: { border: '1px solid', borderRadius: '14px', padding: '14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  cardHeaderIconAndTitleRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  nodeIconAvatarBadge: { fontSize: '18px', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBlockMainTitleText: { fontSize: '13px', fontWeight: '800', color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  coBadgeTag: { fontSize: '9px', color: '#0369a1', fontWeight: '700', backgroundColor: '#e0f2fe', padding: '1px 5px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' },

  // High Density Inner Academic Key-Value Sheets
  metricTableStructureSheet: { display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8fafc' },
  tableRowBorderLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', borderBottom: '1px solid #e2e8f0', gap: '6px' },
  tableKeyLabelText: { fontSize: '10px', color: '#475569', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tableValueOutputDataText: { fontSize: '9.5px', color: '#0f172a', fontWeight: '700', fontFamily: 'monospace', backgroundColor: '#ffffff', padding: '1px 4px', borderRadius: '4px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' },

  // 📈 HIGH-ATTENTION METRICS GRAPH CORES
  graphAnalyticsPanelFrame: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  graphPanelHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  graphPanelTitle: { fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 },
  liveConsoleBadge: { fontSize: '10px', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', fontFamily: 'monospace' },
  visualizationGraphChassisContainerWell: { width: '100%', height: '130px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', boxSizing: 'border-box' },
  graphColumnChassisStructure: { width: '80px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  barGraphTrackBackgroundChassis: { width: '10px', flex: 1, backgroundColor: '#e2e8f0', borderRadius: '9999px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  barGraphActiveFillIndicatorProgress: { width: '100%', borderRadius: '9999px', transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  barValuePercentageLabelsRow: { fontSize: '10px', fontWeight: '700', color: '#0f172a', margin: '2px 0' },
  barDescriptionMicroLabel: { fontSize: '10px', color: '#64748b', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap' }
};
