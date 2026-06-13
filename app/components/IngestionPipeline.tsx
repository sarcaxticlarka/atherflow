"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TelemetryPoint {
  time: number;
  wind: number;
  pressure: number;
  tide: number;
}

export default function IngestionPipeline() {
  const [textActive, setTextActive] = useState(false);
  const [textData, setTextData] = useState<any>(null);
  const [visionActive, setVisionActive] = useState(false);
  const [telemetryActive, setTelemetryActive] = useState(false);
  const [telemetryStream, setTelemetryStream] = useState<TelemetryPoint[]>([]);
  const streamRef = useRef<TelemetryPoint[]>([]);

  const mockManifests = [
    {
      id: "EDI-902-MSK",
      vessel: "Oceanus Leviathan",
      containers: 12450,
      cargoType: "Electronics / Industrial",
      origin: "Shanghai (SHA)",
      destination: "Singapore (SIN)",
    },
    {
      id: "EDI-144-MSC",
      vessel: "MSC Aurelia",
      containers: 8400,
      cargoType: "General merchandise",
      origin: "Rotterdam (RTM)",
      destination: "Los Angeles (LAX)",
    },
  ];

  useEffect(() => {
    let history: TelemetryPoint[] = [];
    for (let i = 0; i < 20; i++) {
      history.push({
        time: i,
        wind: 14 + Math.sin(i / 2) * 3 + Math.random(),
        pressure: 1012 + Math.cos(i / 3) * 2,
        tide: 2.1 + Math.sin(i / 4) * 0.5,
      });
    }
    setTelemetryStream(history);
    streamRef.current = history;

    const interval = setInterval(() => {
      if (!telemetryActive) return;
      const nextTime = streamRef.current.length;
      const newPoint: TelemetryPoint = {
        time: nextTime,
        wind: 14 + Math.sin(nextTime / 2) * 3 + Math.random(),
        pressure: 1012 + Math.cos(nextTime / 3) * 2,
        tide: 2.1 + Math.sin(nextTime / 4) * 0.5,
      };
      const updated = [...streamRef.current.slice(1), newPoint];
      streamRef.current = updated;
      setTelemetryStream(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [telemetryActive]);

  const isSynthesizing = textActive && visionActive && telemetryActive;

  return (
    <section className="relative w-full py-24 px-6 lg:px-12 bg-obsidian border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-white/5">
          <span className="text-[10px] text-gold font-orbitron tracking-widest uppercase block mb-1">
            // INGESTION ARCHITECTURE
          </span>
          <h2 className="text-3xl lg:text-5xl font-black uppercase text-white font-outfit">
            Multimodal <span className="gold-gradient-text">Ingestion Pipeline</span>
          </h2>
          <p className="mt-2 text-xs lg:text-sm text-gray-400 max-w-lg">
            Unifying fragmented manifests, crane camera feeds, and sensors into a single, high-fidelity operations stream.
          </p>
        </div>

        {/* Spacious Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          
          {/* Left Column: Streams List (Input slots) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Stream 1: Text */}
            <div className="card-panel p-6 rounded-none bg-[#0B1126] border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-orbitron text-gray-500 uppercase">STREAM 01 // TEXT</span>
                  <h3 className="text-sm font-bold text-white uppercase mt-0.5">EDI Shipping Manifest</h3>
                </div>
                <span className={`text-[8px] font-orbitron px-2 py-0.5 border ${
                  textActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-gray-400"
                }`}>
                  {textActive ? "SYNCED" : "STANDBY"}
                </span>
              </div>

              {!textActive ? (
                <div className="flex gap-2">
                  {mockManifests.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => { setTextActive(true); setTextData(m); }}
                      className="flex-1 py-2 text-[9px] font-orbitron uppercase border border-white/10 text-white hover:border-gold hover:text-gold transition-all"
                    >
                      Load {m.id}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-[#050814] p-4 border border-white/5 font-mono text-[10px] text-gray-400 relative">
                  <button onClick={() => { setTextActive(false); setTextData(null); }} className="absolute top-2 right-2 text-gray-600 hover:text-white">✕</button>
                  <div className="text-gold font-orbitron mb-1">PARSED LOG:</div>
                  <div>VESSEL: <strong className="text-white">{textData?.vessel}</strong></div>
                  <div>CARGO: {textData?.cargoType}</div>
                  <div>COUNT: {textData?.containers} TEUs</div>
                  <div className="text-emerald-400 mt-1">// STATUS: READY</div>
                </div>
              )}
            </div>

            {/* Stream 2: Vision */}
            <div className="card-panel p-6 rounded-none bg-[#0B1126] border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-orbitron text-gray-500 uppercase">STREAM 02 // VISION</span>
                  <h3 className="text-sm font-bold text-white uppercase mt-0.5">Quay Crane CCTV Feed</h3>
                </div>
                <button
                  onClick={() => setVisionActive(!visionActive)}
                  className={`text-[8px] font-orbitron px-2 py-0.5 border uppercase ${
                    visionActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  {visionActive ? "DISCONNECT" : "CONNECT FEED"}
                </button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden border border-white/5 bg-[#050814]">
                <Image
                  src="/cctv_feed.png"
                  alt="Quay crane cctv lock tracking"
                  fill
                  sizes="30vw"
                  className={`object-cover transition-opacity duration-300 ${visionActive ? "opacity-75" : "opacity-10"}`}
                />
                
                {/* Vision Overlays */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between font-mono text-[9px] text-gray-500 pointer-events-none select-none">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-white">
                      <span className={`h-1.5 w-1.5 rounded-full ${visionActive ? "bg-rose-500 animate-pulse" : "bg-gray-600"}`}></span>
                      REC CAM_04
                    </span>
                    <span>1080p</span>
                  </div>

                  {visionActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[30%] h-[40%] border border-cyber-blue relative">
                        <span className="absolute -top-4 left-0 text-[7px] text-cyber-blue bg-[#050814] px-1 font-bold">
                          LOCK_ALIGN // 99.8%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <span>FPS: {visionActive ? "60.0" : "0.0"}</span>
                    <span>19:42:15 UTC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream 3: Telemetry */}
            <div className="card-panel p-6 rounded-none bg-[#0B1126] border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-orbitron text-gray-500 uppercase">STREAM 03 // METEO</span>
                  <h3 className="text-sm font-bold text-white uppercase mt-0.5">Buoy Marine Sensors</h3>
                </div>
                <button
                  onClick={() => setTelemetryActive(!telemetryActive)}
                  className={`text-[8px] font-orbitron px-2 py-0.5 border uppercase ${
                    telemetryActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  {telemetryActive ? "DISCONNECT" : "CONNECT SYNC"}
                </button>
              </div>

              {/* Minimal Line chart */}
              <div className="w-full h-24 bg-[#050814] border border-white/5 p-2 flex flex-col justify-between">
                <div className="flex justify-between text-[8px] font-mono text-gray-500">
                  <span>WIND: {telemetryActive ? telemetryStream[telemetryStream.length-1]?.wind.toFixed(1) + " kts" : "OFFLINE"}</span>
                  <span>TIDE: {telemetryActive ? telemetryStream[telemetryStream.length-1]?.tide.toFixed(2) + " m" : "OFFLINE"}</span>
                </div>

                <svg className="w-full h-12 overflow-visible">
                  {telemetryActive && telemetryStream.length > 0 && (
                    <path
                      d={telemetryStream
                        .map((p, idx) => {
                          const x = (idx / (telemetryStream.length - 1)) * 100;
                          const y = 40 - ((p.wind - 5) / 20) * 35;
                          return `${idx === 0 ? "M" : "L"} ${x}% ${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#00D2FF"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>

                <div className="flex justify-between text-[7px] text-gray-600 font-mono">
                  <span>-20s</span>
                  <span>LIVE SENSORS</span>
                  <span>NOW</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: AI Synthesis Terminal output */}
          <div className="lg:col-span-7 flex flex-col h-full self-stretch justify-between">
            <div className="card-panel p-8 rounded-none border border-white/5 bg-[#0B1126] flex-1 flex flex-col justify-between min-h-[400px]">
              
              <div>
                {/* Header info */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${isSynthesizing ? "bg-gold animate-ping" : "bg-gray-700"}`}></span>
                    <span className="text-xs font-orbitron text-white tracking-widest uppercase">
                      Gemini Synthesis Engine
                    </span>
                  </div>
                  <span className={`text-[8px] font-orbitron px-2 py-0.5 border ${
                    isSynthesizing ? "bg-gold/10 border-gold/30 text-gold" : "bg-white/5 border-white/10 text-gray-500"
                  }`}>
                    {isSynthesizing ? "CORE ACTIVE" : "WAITING FOR INPUTS"}
                  </span>
                </div>

                {/* Synthesis Output */}
                {!isSynthesizing ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-gray-500">
                    <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <div className="max-w-xs text-xs flex flex-col gap-1">
                      <span className="font-bold text-gray-400 uppercase tracking-wider">Telemetry Incomplete</span>
                      <span>Connect and synchronize Shipping Manifest, CCTV Feed, and Meteo Sensors on the left to activate Gemini core logic.</span>
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-xs text-gray-400 flex flex-col gap-4">
                    <div className="p-5 bg-[#050814] border border-gold/20 relative">
                      <span className="text-[9px] font-orbitron text-gold block mb-3 uppercase tracking-widest">// AUTOMATED COMMAND PROTOCOL</span>
                      <p className="text-white text-sm font-outfit font-medium mb-3">
                        Berth repositioning and hoist dampening adjustment approved for <strong className="text-cyber-blue font-orbitron">{textData?.vessel}</strong>.
                      </p>
                      
                      <ul className="space-y-2 list-none pl-0 text-[11px] leading-relaxed">
                        <li className="flex gap-2">
                          <span className="text-gold">●</span>
                          <span><strong>Meteo Alert:</strong> Gusts at {telemetryStream[telemetryStream.length-1]?.wind.toFixed(1)} kts require dampening shifts.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-gold">●</span>
                          <span><strong>Computer Vision:</strong> Quay locks target locked and verified (confidence: 99.8%).</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-gold">●</span>
                          <span><strong>Platform Command:</strong> Shift vessel to Berth C to avoid low-tide wind shear limits.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-gray-500 pt-2 border-t border-white/5">
                      <span>CMD_ID: ATH-GEM-89021</span>
                      <span className="text-green-400">STATE: NOMINAL_FLOW</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-white/5 pt-6 flex">
                <button
                  disabled={!isSynthesizing}
                  className={`w-full py-3 text-xs font-orbitron tracking-widest uppercase font-bold transition-all ${
                    isSynthesizing
                      ? "bg-gold text-black hover:bg-white"
                      : "bg-[#050814] text-gray-600 cursor-not-allowed border border-white/5"
                  }`}
                >
                  Execute Synthesis Output
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
