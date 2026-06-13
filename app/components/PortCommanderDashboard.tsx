"use client";

import React, { useState, useEffect } from "react";

interface VesselSchedule {
  id: string;
  name: string;
  eta: string;
  dwell: string;
  berth: string;
  risk: boolean;
}

interface AGV {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
}

export default function PortCommanderDashboard() {
  // --- Section 1: Berth Scheduler States ---
  const [vessels, setVessels] = useState<VesselSchedule[]>([
    { id: "v1", name: "Oceanus Leviathan", eta: "08:00", dwell: "18h", berth: "Berth A", risk: true },
    { id: "v2", name: "MSC Aurelia", eta: "11:30", dwell: "12h", berth: "Berth B", risk: false },
    { id: "v3", name: "Maersk Titan", eta: "15:00", dwell: "24h", berth: "Berth C", risk: false },
  ]);
  const [schedulingStatus, setSchedulingStatus] = useState("MANUAL REVIEW");
  const [isSolving, setIsSolving] = useState(false);
  const [solverLogs, setSolverLogs] = useState<string[]>([]);
  const [solvingProgress, setSolvingProgress] = useState(0);

  const handleDragBerth = (vesselId: string, targetBerth: string) => {
    setVessels(vessels.map(v => {
      if (v.id === vesselId) {
        return {
          ...v,
          berth: targetBerth,
          risk: targetBerth === "Berth A"
        };
      }
      return v;
    }));
  };

  const handleOptimizeBerths = () => {
    if (isSolving) return;
    setIsSolving(true);
    setSolverLogs([]);
    setSolvingProgress(0);
    setSchedulingStatus("OPTIMIZING...");

    const logs = [
      "[SYS] Initializing re-routing optimization solvers...",
      "[DATA] Pulling marine buoy wind logs: gusts 18.2 kts.",
      "[WARN] Berth A wind limits exceeded (thr: 12 kts). Flagging vessel risk.",
      "[CALC] Computing alternative schedules. Minimizing dwell shift.",
      "[EXEC] Moving Oceanus Leviathan to Berth C. Shifting Maersk Titan to Berth A.",
      "[SYS] Berth schedule constraints solved. Deployment ready."
    ];

    // Progress bar animation
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += 5;
      if (prog >= 100) {
        setSolvingProgress(100);
        clearInterval(progInterval);
      } else {
        setSolvingProgress(prog);
      }
    }, 100);

    // Logs sequence
    logs.forEach((log, index) => {
      setTimeout(() => {
        setSolverLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          // Finish solving
          setTimeout(() => {
            setVessels(vessels.map(v => {
              if (v.id === "v1") return { ...v, berth: "Berth C", risk: false };
              if (v.id === "v3") return { ...v, berth: "Berth A", risk: false };
              return v;
            }));
            setIsSolving(false);
            setSchedulingStatus("OPTIMIZED");
          }, 300);
        }
      }, (index + 1) * 350);
    });
  };

  // --- Section 2: AGV Traffic Controller States ---
  const [bottleneckNode, setBottleneckNode] = useState<string | null>(null);
  const [agvs, setAgvs] = useState<AGV[]>([
    { id: "AGV-01", x: 50, y: 50, targetX: 250, targetY: 50, progress: 0 },
    { id: "AGV-02", x: 250, y: 150, targetX: 450, targetY: 150, progress: 0 },
    { id: "AGV-03", x: 50, y: 150, targetX: 250, targetY: 150, progress: 0 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAgvs(prevAgvs =>
        prevAgvs.map(agv => {
          let nextProgress = agv.progress + 0.02;
          
          if (nextProgress >= 1) {
            nextProgress = 0;
            const isBlocked = bottleneckNode === "Node B";
            
            if (agv.id === "AGV-01") {
              if (isBlocked) {
                if (agv.x === 50 && agv.y === 50) {
                  return { ...agv, x: 50, y: 50, targetX: 250, targetY: 150, progress: 0 };
                } else if (agv.x === 250 && agv.y === 150) {
                  return { ...agv, x: 250, y: 150, targetX: 450, targetY: 50, progress: 0 };
                } else {
                  return { ...agv, x: 450, y: 50, targetX: 50, targetY: 50, progress: 0 };
                }
              } else {
                if (agv.x === 50 && agv.y === 50) {
                  return { ...agv, x: 50, y: 50, targetX: 250, targetY: 50, progress: 0 };
                } else if (agv.x === 250 && agv.y === 50) {
                  return { ...agv, x: 250, y: 50, targetX: 450, targetY: 50, progress: 0 };
                } else {
                  return { ...agv, x: 450, y: 50, targetX: 50, targetY: 50, progress: 0 };
                }
              }
            } else if (agv.id === "AGV-02") {
              if (agv.x === 250 && agv.y === 150) {
                return { ...agv, x: 250, y: 150, targetX: 450, targetY: 150, progress: 0 };
              } else if (agv.x === 450 && agv.y === 150) {
                return { ...agv, x: 450, y: 150, targetX: 50, targetY: 150, progress: 0 };
              } else {
                return { ...agv, x: 50, y: 150, targetX: 250, targetY: 150, progress: 0 };
              }
            } else {
              if (agv.x === 50 && agv.y === 150) {
                return { ...agv, x: 50, y: 150, targetX: 250, targetY: 150, progress: 0 };
              } else {
                return { ...agv, x: 250, y: 150, targetX: 50, targetY: 150, progress: 0 };
              }
            }
          }

          return {
            ...agv,
            progress: nextProgress,
            x: agv.x + (agv.targetX - agv.x) * nextProgress,
            y: agv.y + (agv.targetY - agv.y) * nextProgress
          };
        })
      );
    }, 40);

    return () => clearInterval(timer);
  }, [bottleneckNode]);

  // --- Section 3: Predictive Maintenance States ---
  const [craneHealth, setCraneHealth] = useState(34);
  const [maintenanceScheduled, setMaintenanceScheduled] = useState(false);
  const [repairProgress, setRepairProgress] = useState(0);

  const handleRepair = () => {
    setMaintenanceScheduled(true);
    setRepairProgress(0);
  };

  useEffect(() => {
    if (!maintenanceScheduled) return;
    const interval = setInterval(() => {
      setRepairProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCraneHealth(98);
          setMaintenanceScheduled(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [maintenanceScheduled]);

  return (
    <section className="relative w-full py-24 px-6 lg:px-12 bg-obsidian border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-white/5">
          <span className="text-[10px] text-gold font-orbitron tracking-widest uppercase block mb-1">
            // LIVE PORT COMMAND
          </span>
          <h2 className="text-3xl lg:text-5xl font-black uppercase text-white font-outfit">
            Port Commander <span className="gold-gradient-text">Dashboard</span>
          </h2>
          <p className="mt-2 text-xs lg:text-sm text-gray-400 max-w-lg">
            Real-time scheduler, vehicle routing logs, and predictive mechanical maintenance console.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Panel 1: Scheduler */}
          <div className="lg:col-span-6 card-panel p-6 rounded-none bg-[#0B1126] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-5">
                <span className="text-[10px] font-orbitron text-gray-500 uppercase">
                  01 // Berth Repositioning Scheduler
                </span>
                <span className={`text-[8px] font-orbitron px-2 py-0.5 border ${
                  vessels.some(v => v.risk) ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  {schedulingStatus}
                </span>
              </div>

              {/* Solver Console Output during Active state */}
              {isSolving ? (
                <div className="bg-[#050814] p-5 border border-white/5 font-mono text-[9px] text-gray-400 flex flex-col gap-1.5 min-h-[200px]">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                    <span className="text-gold font-orbitron uppercase text-[8px]">// RESOLUTION ENGINE LOGS</span>
                    <span className="text-white">{solvingProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-navy mb-2">
                    <div className="h-full bg-gold transition-all duration-100" style={{ width: `${solvingProgress}%` }}></div>
                  </div>
                  {solverLogs.map((log, i) => (
                    <div key={i} className={log.includes("[WARN]") ? "text-rose-400" : log.includes("[SUCCESS]") || log.includes("[EXEC]") ? "text-gold" : "text-gray-400"}>
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                /* Vessel schedule list */
                <div className="flex flex-col gap-3">
                  {vessels.map((vessel) => (
                    <div
                      key={vessel.id}
                      className={`p-4 bg-[#050814]/80 border transition-all duration-300 ${
                        vessel.risk ? "border-rose-500" : "border-white/5"
                      } flex justify-between items-center`}
                    >
                      <div>
                        <span className="text-[8px] font-mono text-gray-500">SHIP:</span>
                        <h4 className="text-xs font-bold text-white font-outfit uppercase mt-0.5">{vessel.name}</h4>
                        <div className="flex gap-4 mt-2 text-[9px] font-mono text-gray-400">
                          <span>ETA: <strong className="text-cyber-blue font-orbitron font-normal">{vessel.eta}</strong></span>
                          <span>DWELL: {vessel.dwell}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 bg-obsidian p-1 border border-white/5">
                          {["Berth A", "Berth B", "Berth C"].map((b) => (
                            <button
                              key={b}
                              onClick={() => handleDragBerth(vessel.id, b)}
                              className={`px-2 py-1 text-[8px] font-orbitron transition-all ${
                                vessel.berth === b
                                  ? "bg-white text-black font-bold"
                                  : "text-gray-500 hover:text-white"
                              }`}
                            >
                              {b.split(" ")[1]}
                            </button>
                          ))}
                        </div>

                        {vessel.risk && (
                          <span className="text-xs text-rose-500 font-bold">⚠️</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {vessels.some(v => v.risk) && !isSolving && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-mono">
                  🚨 CONFLICT: Oceanus Leviathan scheduled in Berth A. Wind warnings suggest slip hazard. Move vessel.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <button
                onClick={handleOptimizeBerths}
                disabled={isSolving}
                className="w-full py-2.5 bg-white hover:bg-gold text-black text-[10px] font-orbitron font-bold tracking-widest uppercase transition-all disabled:opacity-40"
              >
                {isSolving ? "Optimizing Layout..." : "Resolve Scheduler Conflicts"}
              </button>
            </div>
          </div>

          {/* Panel 2: AGV PATHFINDER */}
          <div className="lg:col-span-6 card-panel p-6 rounded-none bg-[#0B1126] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-5">
                <span className="text-[10px] font-orbitron text-gray-500 uppercase">
                  02 // Automated Guided Vehicles Paths
                </span>
                <span className={`text-[8px] font-orbitron px-2 py-0.5 border ${
                  bottleneckNode ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-cyber-blue/10 border-cyber-blue/20 text-cyber-blue"
                }`}>
                  {bottleneckNode ? "Rerouting..." : "Normal Flow"}
                </span>
              </div>

              <div className="relative aspect-video w-full overflow-hidden border border-white/5 bg-[#050814] p-4 flex flex-col justify-between">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200">
                  <line x1="50" y1="50" x2="450" y2="50" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3" />
                  <line x1="50" y1="150" x2="450" y2="150" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3" />
                  <line x1="250" y1="50" x2="250" y2="150" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2" strokeDasharray="3 3" />

                  {bottleneckNode === "Node B" && (
                    <path d="M 50 50 L 250 150 L 450 50" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 2" />
                  )}

                  <g>
                    <circle cx="50" cy="50" r="5" fill="#0B1126" stroke="#00D2FF" strokeWidth="1" />
                    <text x="50" y="38" textAnchor="middle" fill="#555" fontSize="7" fontFamily="Orbitron">Node A</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setBottleneckNode(bottleneckNode === "Node B" ? null : "Node B")}>
                    <circle
                      cx="250"
                      cy="50"
                      r="7"
                      fill={bottleneckNode === "Node B" ? "#EF4444" : "#0B1126"}
                      stroke={bottleneckNode === "Node B" ? "#F87171" : "#00D2FF"}
                      strokeWidth="1.5"
                    />
                    <text x="250" y="36" textAnchor="middle" fill={bottleneckNode === "Node B" ? "#EF4444" : "#555"} fontSize="7" fontFamily="Orbitron" fontWeight="bold">
                      B
                    </text>
                  </g>

                  <g>
                    <circle cx="450" cy="50" r="5" fill="#0B1126" stroke="#00D2FF" strokeWidth="1" />
                    <text x="450" y="38" textAnchor="middle" fill="#555" fontSize="7" fontFamily="Orbitron">Node C</text>
                  </g>

                  <g>
                    <circle cx="50" cy="150" r="5" fill="#0B1126" stroke="#00D2FF" strokeWidth="1" />
                    <text x="50" y="165" textAnchor="middle" fill="#555" fontSize="7" fontFamily="Orbitron">Node D</text>
                  </g>

                  <g>
                    <circle cx="250" cy="150" r="5" fill="#0B1126" stroke="#00D2FF" strokeWidth="1" />
                    <text x="250" y="165" textAnchor="middle" fill="#555" fontSize="7" fontFamily="Orbitron">Node E</text>
                  </g>

                  <g>
                    <circle cx="450" cy="150" r="5" fill="#0B1126" stroke="#00D2FF" strokeWidth="1" />
                    <text x="450" y="165" textAnchor="middle" fill="#555" fontSize="7" fontFamily="Orbitron">Node F</text>
                  </g>

                  {agvs.map((agv) => (
                    <g key={agv.id}>
                      <circle
                        cx={agv.x}
                        cy={agv.y}
                        r="4"
                        fill={agv.id === "AGV-01" && bottleneckNode === "Node B" ? "#D4AF37" : "#00D2FF"}
                      />
                      <text
                        x={agv.x}
                        y={agv.y - 8}
                        textAnchor="middle"
                        fill="#FFF"
                        fontSize="6"
                        fontFamily="Orbitron"
                      >
                        {agv.id}
                      </text>
                    </g>
                  ))}
                </svg>

                <div className="w-full flex justify-between items-center text-[8px] text-gray-600 font-mono mt-auto z-10">
                  <span>ROUTING SCHEMATIC // LANES ACTIVE</span>
                  <span className="text-gold font-bold">CLICK NODE B TO BLOCK</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Panel 3: Machinery health */}
        <div className="card-panel p-8 rounded-none bg-[#0B1126] border border-white/5 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 mb-6 gap-3">
            <span className="text-[10px] font-orbitron text-gray-500 uppercase">
              03 // Machinery Mechanical Telemetry
            </span>
            <span className={`text-[8px] font-orbitron px-2 py-0.5 border ${
              craneHealth > 50 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}>
              {craneHealth > 50 ? "NOMINAL" : "MAINTENANCE PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 flex flex-col gap-6">
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">CRANE LINE 4 // ENGINE ROTOR</span>
                <div className="flex justify-between items-end text-xs mb-1 text-gray-300">
                  <span>Hoist Motor Temp:</span>
                  <span className={craneHealth > 50 ? "text-white" : "text-rose-400 font-bold"}>
                    {craneHealth > 50 ? "68°C" : "118°C (HIGH RISK)"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-obsidian rounded-none overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${craneHealth > 50 ? "bg-cyber-blue" : "bg-rose-500"}`}
                    style={{ width: `${craneHealth}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">CRANE LINE 4 // GEAR VIBRATION</span>
                <div className="flex justify-between items-end text-xs mb-1 text-gray-300">
                  <span>Vibration Frequency:</span>
                  <span className={craneHealth > 50 ? "text-white" : "text-rose-400 font-bold"}>
                    {craneHealth > 50 ? "2.4 mm/s" : "8.9 mm/s (ANOMALY)"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-obsidian rounded-none overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${craneHealth > 50 ? "bg-cyber-blue" : "bg-rose-500"}`}
                    style={{ width: `${craneHealth > 50 ? 92 : 42}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col justify-center gap-4 md:border-l border-white/5 md:pl-8">
              {craneHealth < 50 ? (
                <>
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-mono">
                    ⚠ Warning: Crane hoist motor failure predicted within 48h. Schedule preventive service now.
                  </div>
                  <button
                    onClick={handleRepair}
                    disabled={maintenanceScheduled}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-orbitron text-[10px] font-bold tracking-widest uppercase transition-all"
                  >
                    {maintenanceScheduled ? `MAINTENANCE AT ${repairProgress}%` : "Deploy Maintenance Crew"}
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                    ✓ Calibration cycle completed. Engine sensors reporting standard mechanical thresholds.
                  </div>
                  <button
                    onClick={() => setCraneHealth(34)}
                    className="w-full py-2.5 border border-white/10 hover:border-gold hover:text-gold text-white font-orbitron text-[10px] font-bold tracking-widest uppercase transition-all"
                  >
                    Trigger Telemetry Anomaly
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
