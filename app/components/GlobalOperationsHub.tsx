"use client";

import React, { useState, useEffect } from "react";

interface PortData {
  name: string;
  code: string;
  efficiency: string;
  dwellTime: string;
  status: "Optimal" | "Warning" | "Congested";
  throughput: string;
  coordinates: string;
  x: number;
  y: number;
}

const ports: PortData[] = [
  {
    name: "Singapore Hub",
    code: "SGP-SIN",
    efficiency: "98.7%",
    dwellTime: "14.2 hours",
    status: "Optimal",
    throughput: "120,400 TEU / day",
    coordinates: "1.3521° N, 103.8198° E",
    x: 760,
    y: 310,
  },
  {
    name: "Shanghai Terminal",
    code: "CHN-SHA",
    efficiency: "96.2%",
    dwellTime: "18.5 hours",
    status: "Optimal",
    throughput: "155,800 TEU / day",
    coordinates: "31.2304° N, 121.4737° E",
    x: 790,
    y: 220,
  },
  {
    name: "Rotterdam Port",
    code: "NLD-RTM",
    efficiency: "94.5%",
    dwellTime: "22.1 hours",
    status: "Warning",
    throughput: "92,100 TEU / day",
    coordinates: "51.9244° N, 4.4777° E",
    x: 480,
    y: 130,
  },
  {
    name: "Los Angeles Terminal",
    code: "USA-LAX",
    efficiency: "89.1%",
    dwellTime: "31.4 hours",
    status: "Congested",
    throughput: "78,500 TEU / day",
    coordinates: "33.7432° N, 118.2673° W",
    x: 180,
    y: 190,
  },
];

export default function GlobalOperationsHub() {
  const [selectedPort, setSelectedPort] = useState<PortData | null>(ports[0]);
  const [simulatedTime, setSimulatedTime] = useState("");
  const [congestionMode, setCongestionMode] = useState<boolean>(false);
  const [animatedEfficiency, setAnimatedEfficiency] = useState<number>(90);

  // System Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimulatedTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Metric Count-Up Effect on selection
  useEffect(() => {
    if (!selectedPort) return;
    
    // Parse target efficiency (e.g. 98.7% -> 98.7)
    const targetVal = parseFloat(selectedPort.efficiency);
    const startVal = targetVal - 12;
    setAnimatedEfficiency(startVal);

    let current = startVal;
    const duration = 400; // ms
    const stepTime = 20; // ms
    const increment = (targetVal - startVal) / (duration / stepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetVal) {
        setAnimatedEfficiency(targetVal);
        clearInterval(timer);
      } else {
        setAnimatedEfficiency(parseFloat(current.toFixed(1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [selectedPort]);

  // Route highlight matching: Check if route connects to selected port
  const isRouteHighlighted = (portA: string, portB: string) => {
    if (!selectedPort) return true;
    return selectedPort.code === portA || selectedPort.code === portB;
  };

  return (
    <section className="relative w-full py-24 px-6 lg:px-12 bg-obsidian border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div>
            <span className="text-[10px] text-gold font-orbitron tracking-widest uppercase block mb-1">
              // OPERATIONS TELEMETRY
            </span>
            <h2 className="text-3xl lg:text-5xl font-black uppercase text-white font-outfit">
              Global Operations <span className="gold-gradient-text">Hub</span>
            </h2>
            <p className="mt-2 text-xs lg:text-sm text-gray-400 max-w-lg">
              Live trans-oceanic vessel routing and situation intelligence dashboard. Toggled with Gemini synthesis flow-optimization.
            </p>
          </div>

          {/* Clean Controls Widget */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-gray-500 font-mono">SYS_CLOCK</span>
              <span className="font-mono text-cyber-blue font-bold">{simulatedTime || "CONNECTING..."}</span>
            </div>
            <button
              onClick={() => setCongestionMode(!congestionMode)}
              className={`px-4 py-2 text-[10px] font-orbitron uppercase tracking-widest border transition-all ${
                congestionMode
                  ? "bg-rose-500/10 border-rose-500 text-rose-400"
                  : "bg-white text-black border-white hover:bg-gold hover:border-gold"
              }`}
            >
              {congestionMode ? "Simulate Normal Flow" : "Simulate Congestion"}
            </button>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="relative w-full h-[320px] md:h-[480px] bg-[#0B1126] border border-white/5 flex flex-col justify-end overflow-hidden">
          
          <svg
            viewBox="0 0 1000 450"
            className="w-full h-full absolute inset-0 select-none opacity-80"
          >
            {/* Simple vector continent outlines */}
            {/* North America */}
            <path
              d="M 50 80 Q 120 70 200 90 T 260 140 T 300 240 L 280 260 L 250 250 L 200 230 L 160 210 L 120 220 L 80 160 Z"
              fill="rgba(5, 8, 20, 0.5)"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1.5"
            />
            {/* Eurasia / Africa */}
            <path
              d="M 400 120 Q 500 80 650 90 T 800 100 T 920 120 L 950 180 L 880 260 L 800 290 L 780 340 L 680 380 L 590 320 L 520 280 L 460 210 Z"
              fill="rgba(5, 8, 20, 0.5)"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1.5"
            />
            {/* South America */}
            <path
              d="M 240 280 L 290 300 L 330 350 L 310 420 L 280 440 L 250 370 Z"
              fill="rgba(5, 8, 20, 0.5)"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1.5"
            />
            {/* Australia */}
            <path
              d="M 820 340 Q 880 330 920 360 T 900 410 T 830 380 Z"
              fill="rgba(5, 8, 20, 0.5)"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1.5"
            />

            {/* Clean trade routes with active path highlighting */}
            {/* SGP to SHA */}
            <path
              d="M 760 310 Q 780 260 790 220"
              fill="none"
              stroke={congestionMode ? "#EF4444" : "#00D2FF"}
              strokeWidth={isRouteHighlighted("SGP-SIN", "CHN-SHA") ? "2" : "1"}
              strokeDasharray={congestionMode ? "4 4" : "none"}
              opacity={isRouteHighlighted("SGP-SIN", "CHN-SHA") ? "0.8" : "0.15"}
              className="transition-all duration-500"
            />
            {/* SHA to LAX */}
            <path
              d="M 790 220 Q 980 100 1000 160 M 0 160 Q 80 180 180 190"
              fill="none"
              stroke={congestionMode ? "#EF4444" : "#00D2FF"}
              strokeWidth={isRouteHighlighted("CHN-SHA", "USA-LAX") ? "2" : "1"}
              strokeDasharray={congestionMode ? "4 4" : "none"}
              opacity={isRouteHighlighted("CHN-SHA", "USA-LAX") ? "0.8" : "0.15"}
              className="transition-all duration-500"
            />
            {/* SGP to RTM */}
            <path
              d="M 760 310 Q 620 280 480 130"
              fill="none"
              stroke={congestionMode ? "#EF4444" : "#00D2FF"}
              strokeWidth={isRouteHighlighted("SGP-SIN", "NLD-RTM") ? "2" : "1"}
              strokeDasharray={congestionMode ? "4 4" : "none"}
              opacity={isRouteHighlighted("SGP-SIN", "NLD-RTM") ? "0.8" : "0.15"}
              className="transition-all duration-500"
            />
            {/* RTM to LAX */}
            <path
              d="M 480 130 Q 320 120 180 190"
              fill="none"
              stroke={congestionMode ? "#EF4444" : "#00D2FF"}
              strokeWidth={isRouteHighlighted("NLD-RTM", "USA-LAX") ? "2" : "1"}
              strokeDasharray={congestionMode ? "4 4" : "none"}
              opacity={isRouteHighlighted("NLD-RTM", "USA-LAX") ? "0.8" : "0.15"}
              className="transition-all duration-500"
            />

            {/* Port Dots */}
            {ports.map((port) => {
              const isSelected = selectedPort?.code === port.code;
              const hasAlert = congestionMode && (port.code === "USA-LAX" || port.code === "NLD-RTM");
              const strokeColor = hasAlert ? "#EF4444" : isSelected ? "#D4AF37" : "#00D2FF";

              return (
                <g
                  key={port.code}
                  className="cursor-pointer"
                  onClick={() => setSelectedPort(port)}
                >
                  <circle
                    cx={port.x}
                    cy={port.y}
                    r={isSelected ? "7" : "5"}
                    fill={strokeColor}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={port.x}
                    cy={port.y}
                    r={isSelected ? "13" : "9"}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity={isSelected ? "0.8" : "0.2"}
                    className="transition-all duration-300"
                  />
                  <text
                    x={port.x}
                    y={port.y - 14}
                    textAnchor="middle"
                    fill="#FFF"
                    fontSize="8"
                    fontWeight="600"
                    fontFamily="Orbitron"
                    letterSpacing="0.05em"
                  >
                    {port.code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Overlay Detail Card */}
          {selectedPort && (
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[320px] bg-[#050814]/95 border border-white/5 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-orbitron text-gray-500 tracking-wider">
                  TELEMETRY // {selectedPort.code}
                </span>
                
                <span
                  className={`text-[8px] font-orbitron font-semibold uppercase px-2 py-0.5 border ${
                    congestionMode && (selectedPort.code === "USA-LAX" || selectedPort.code === "NLD-RTM")
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      : selectedPort.status === "Optimal"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  {congestionMode && (selectedPort.code === "USA-LAX" || selectedPort.code === "NLD-RTM")
                    ? "Congested"
                    : selectedPort.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white uppercase font-outfit">
                  {selectedPort.name}
                </h3>
                <span className="text-[9px] text-gray-500 font-mono block mt-0.5">
                  COORD: {selectedPort.coordinates}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Efficiency</span>
                  <span className="text-base font-bold font-orbitron text-white">
                    {congestionMode && (selectedPort.code === "USA-LAX" || selectedPort.code === "NLD-RTM")
                      ? (animatedEfficiency - 15).toFixed(1) + "%"
                      : animatedEfficiency.toFixed(1) + "%"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Avg Dwell</span>
                  <span className="text-base font-bold font-orbitron text-white">
                    {congestionMode && (selectedPort.code === "USA-LAX" || selectedPort.code === "NLD-RTM")
                      ? "48.2 hrs"
                      : selectedPort.dwellTime}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex flex-col gap-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Capacity Velocity:</span>
                  <span className="font-mono text-white">
                    {congestionMode && (selectedPort.code === "USA-LAX" || selectedPort.code === "NLD-RTM")
                      ? "Restricted (30%)"
                      : "Nominal (95%)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Throughput:</span>
                  <span className="font-mono text-white">{selectedPort.throughput.split(" / ")[0]}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
