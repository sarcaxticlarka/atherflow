"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import GlobalOperationsHub from "./components/GlobalOperationsHub";
import IngestionPipeline from "./components/IngestionPipeline";
import PortCommanderDashboard from "./components/PortCommanderDashboard";
import RoiCalculator from "./components/RoiCalculator";

const sectionsList = [
  { id: "hero", label: "Hero Portal" },
  { id: "operations-hub", label: "Operations Hub" },
  { id: "ingestion-pipeline", label: "Ingestion Pipeline" },
  { id: "commander-dashboard", label: "Commander Dashboard" },
  { id: "roi-calculator", label: "ROI Impact" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // IntersectionObserver scroll tracker
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when section occupies the center
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionsList.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-obsidian text-foreground overflow-x-hidden relative font-outfit">
      
      {/* FLOATING DOT SIDEBAR NAV (Highly premium detail) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 hidden lg:flex">
        {sectionsList.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="group flex items-center justify-end gap-3 cursor-pointer"
            >
              {/* Tooltip on hover */}
              <span className={`text-[8px] font-orbitron tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isActive ? "text-gold font-bold" : "text-gray-500"
              }`}>
                {sec.label}
              </span>
              {/* Dot */}
              <span className={`h-2 w-2 rounded-full border transition-all duration-300 ${
                isActive 
                  ? "bg-gold border-gold scale-125 shadow-[0_0_8px_rgba(212,175,55,0.6)]" 
                  : "bg-transparent border-white/20 group-hover:border-white/50"
              }`}></span>
            </a>
          );
        })}
      </div>

      {/* 1. MINIMAL FLOATING NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-[#050814]/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="font-orbitron font-black text-lg tracking-[0.2em] text-white">
              AETHER<span className="text-gold font-light">FLOW</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-10 text-[10px] font-orbitron tracking-[0.2em] text-gray-400 uppercase">
            <a href="#operations-hub" className={`hover:text-gold transition-colors ${activeSection === "operations-hub" ? "text-gold" : ""}`}>Operations</a>
            <a href="#ingestion-pipeline" className={`hover:text-gold transition-colors ${activeSection === "ingestion-pipeline" ? "text-gold" : ""}`}>Ingestion</a>
            <a href="#commander-dashboard" className={`hover:text-gold transition-colors ${activeSection === "commander-dashboard" ? "text-gold" : ""}`}>Commander</a>
            <a href="#roi-calculator" className={`hover:text-gold transition-colors ${activeSection === "roi-calculator" ? "text-gold" : ""}`}>ROI Impact</a>
          </nav>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-[9px] text-gray-500 font-mono tracking-widest uppercase">
              STATUS: // NOMINAL
            </span>
            <a
              href="#roi-calculator"
              className="px-5 py-2.5 bg-white hover:bg-gold text-black text-[10px] font-orbitron tracking-widest uppercase transition-all duration-300 font-bold rounded-none"
            >
              Get Quote
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO PAGE REDESIGN */}
      <section id="hero" className="relative w-full min-h-screen pt-36 pb-24 px-6 lg:px-12 flex flex-col justify-between overflow-hidden border-b border-white/5">
        
        {/* Giant background lettering */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span className="text-[20vw] font-black tracking-tighter text-[#0B1126]/60 font-outfit select-none">
            AETHERFLOW
          </span>
        </div>

        <div></div>

        {/* Center Container Content Grid */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto">
          
          {/* Left Column: Subtle Info Box */}
          <div className="lg:col-span-3 flex flex-col gap-6 text-left order-2 lg:order-1">
            <div className="border-l border-gold/40 pl-4 py-2">
              <span className="text-[10px] text-gold font-orbitron tracking-widest uppercase block mb-1">
                // PLATFORM WHY
              </span>
              <h3 className="text-xl font-bold font-outfit text-white uppercase tracking-wide">
                Tailoring autonomous solutions for ports
              </h3>
            </div>
            
            <div className="card-panel p-6 rounded-none border border-white/5 bg-[#0B1126]/80 flex flex-col gap-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Move cargo effortlessly. Orchestrate berth allocations, crane workloads, and terminal routes in real-time.
              </p>
              <a
                href="#operations-hub"
                className="w-fit px-4 py-2 bg-cyber-blue text-black font-orbitron font-semibold text-[10px] tracking-widest uppercase transition-all hover:bg-white"
              >
                Launch Hub
              </a>
            </div>
          </div>

          {/* Center Column: Big Cinematic Port Frame */}
          <div className="lg:col-span-6 relative aspect-[4/3] w-full border border-white/10 overflow-hidden shadow-2xl order-1 lg:order-2">
            <Image
              src="/hero_port.png"
              alt="Cinematic automated port terminal"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
          </div>

          {/* Right Column: Key Details list */}
          <div className="lg:col-span-3 flex flex-col gap-6 order-3">
            <div className="card-panel p-6 rounded-none border border-white/5 bg-[#0B1126]/80 flex flex-col gap-4">
              <span className="text-[10px] text-cyber-blue font-orbitron tracking-widest uppercase block border-b border-white/5 pb-2">
                SYSTEM TELEMETRY
              </span>
              
              <ul className="text-xs text-gray-400 flex flex-col gap-3">
                <li className="flex justify-between items-center">
                  <span>Berth Scheduler</span>
                  <span className="text-[9px] text-green-400 font-mono font-bold uppercase">● Autonomous</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>AGV Pathfinding</span>
                  <span className="text-[9px] text-green-400 font-mono font-bold uppercase">● Active</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Machinery Health</span>
                  <span className="text-[9px] text-gold font-mono font-bold uppercase">● Predictive</span>
                </li>
              </ul>
            </div>

            {/* Statistics block */}
            <div className="card-panel p-5 rounded-none border border-white/5 bg-[#0B1126]/85 flex justify-between items-center gap-4">
              <div>
                <span className="text-2xl font-bold font-orbitron text-white leading-none">450+</span>
                <span className="text-[9px] text-gray-500 font-orbitron uppercase block mt-0.5">Industry leaders trust us</span>
              </div>
              
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-crimson border-2 border-navy flex items-center justify-center text-[8px] font-bold text-white">U1</div>
                <div className="h-7 w-7 rounded-full bg-gold border-2 border-navy flex items-center justify-center text-[8px] font-bold text-black">U2</div>
                <div className="h-7 w-7 rounded-full bg-cyber-blue border-2 border-navy flex items-center justify-center text-[8px] font-bold text-black">U3</div>
              </div>
            </div>
          </div>

        </div>

        {/* Hero Footer Details */}
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 border-t border-white/5 gap-4 relative z-10">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            AETHERFLOW OS // TERMINAL ORCHESTRATOR
          </span>
          <span className="text-[10px] text-gold font-orbitron tracking-widest uppercase">
            LEADING THE WAY FORWARD
          </span>
        </div>

      </section>

      {/* 3. CORE REDESIGNED SECTIONS */}
      <main className="w-full flex flex-col">
        
        <div id="operations-hub">
          <GlobalOperationsHub />
        </div>

        <div id="ingestion-pipeline">
          <IngestionPipeline />
        </div>

        <div id="commander-dashboard">
          <PortCommanderDashboard />
        </div>

        <div id="roi-calculator">
          <RoiCalculator />
        </div>

      </main>

      {/* 4. CLEAN B2B FOOTER */}
      <footer className="w-full bg-[#050814] border-t border-white/5 py-20 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="flex flex-col gap-4">
            <span className="font-orbitron font-black text-base tracking-[0.2em] text-white">
              AETHER<span className="text-gold font-light">FLOW</span>
            </span>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Sleek, automated terminal operating system powered by Gemini synthesis. Elevating container efficiency globally.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white text-xs uppercase tracking-widest font-orbitron font-bold">Platform</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-500">
              <li><a href="#operations-hub" className="hover:text-white transition-colors">Operations Hub</a></li>
              <li><a href="#ingestion-pipeline" className="hover:text-white transition-colors">Ingestion Feed</a></li>
              <li><a href="#commander-dashboard" className="hover:text-white transition-colors">Commander Portal</a></li>
              <li><a href="#roi-calculator" className="hover:text-white transition-colors">ROI calculator</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white text-xs uppercase tracking-widest font-orbitron font-bold">Telemetry Nodes</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-500">
              <li>Singapore Hub: <span className="text-cyber-blue font-mono font-bold">ONLINE</span></li>
              <li>Shanghai Hub: <span className="text-cyber-blue font-mono font-bold">ONLINE</span></li>
              <li>Rotterdam Hub: <span className="text-gold font-mono font-bold">WARNING</span></li>
              <li>Los Angeles Hub: <span className="text-rose-500 font-mono font-bold">CONGESTED</span></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-orbitron font-bold">Briefings</h4>
            <button className="py-2 px-4 bg-white hover:bg-gold text-black rounded-none font-orbitron text-[10px] tracking-widest uppercase transition-all duration-300 font-bold">
              Request Simulation
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono text-gray-600">
          <span>© 2026 AETHERFLOW INC. ALL PRIVILEGES SECURED.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">SECURITY</a>
            <a href="#" className="hover:text-white">PRIVACY</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
