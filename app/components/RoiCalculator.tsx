"use client";

import React, { useState } from "react";

export default function RoiCalculator() {
  const [capacity, setCapacity] = useState<number>(5000000); // TEUs
  const [waitTime, setWaitTime] = useState<number>(24); // Hours

  // B2B Formulas
  const averageVesselCapacity = 10000; // TEU per ship
  const annualShips = Math.round(capacity / averageVesselCapacity);
  
  const turnaroundSavingRate = 0.35;
  const hoursSavedPerShip = waitTime * turnaroundSavingRate;
  const totalHoursSaved = Math.round(annualShips * hoursSavedPerShip);
  
  const hourlyCost = 4500;
  const totalCostSaved = totalHoursSaved * hourlyCost;
  
  const idlingFuelTonsPerH = 1.8;
  const fuelReductionRate = 0.40;
  const fuelSavedTons = Math.round(annualShips * (waitTime * idlingFuelTonsPerH) * fuelReductionRate);
  
  const co2ReducedTons = Math.round(fuelSavedTons * 3.114);

  // Environmental Equivalencies
  const treesPlanted = Math.round(co2ReducedTons * 16.5);
  const carsRemoved = Math.round(co2ReducedTons / 4.6);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return `$${val.toLocaleString()}`;
  };

  // Dynamic bar height percentages (clamped)
  const traditionalHeight = Math.max(30, Math.min(100, Math.round((waitTime / 24) * 80)));
  const aetherFlowHeight = Math.max(20, Math.min(95, Math.round(traditionalHeight * 0.65)));

  return (
    <section className="relative w-full py-24 px-6 lg:px-12 bg-obsidian border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-white/5">
          <span className="text-[10px] text-gold font-orbitron tracking-widest uppercase block mb-1">
            // TRANSFORMATION ROI
          </span>
          <h2 className="text-3xl lg:text-5xl font-black uppercase text-white font-outfit">
            Proven. Trusted. <span className="gold-gradient-text">Scalable.</span>
          </h2>
          <p className="mt-2 text-xs lg:text-sm text-gray-400 max-w-lg">
            Dynamic efficiency calculations projecting operational savings, time turnaround, and CO2 emissions reductions.
          </p>
        </div>

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mt-4">
          
          {/* Left Column: Sliders and Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest block">
                ENTER PORT PARAMETERS
              </span>

              {/* Slider 1: Capacity */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end text-xs">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px]">Annual Volume (TEUs)</span>
                  <span className="font-orbitron font-bold text-white">{(capacity / 1000000).toFixed(1)} Million</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={20000000}
                  step={500000}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                  <span>1.0M TEU</span>
                  <span>10.0M TEU</span>
                  <span>20.0M TEU</span>
                </div>
              </div>

              {/* Slider 2: Dwell wait times */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end text-xs">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px]">Average Vessel Dwell</span>
                  <span className="font-orbitron font-bold text-white">{waitTime} Hours</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={72}
                  step={1}
                  value={waitTime}
                  onChange={(e) => setWaitTime(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                  <span>6 hrs</span>
                  <span>36 hrs</span>
                  <span>72 hrs</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#0B1126] border border-white/5 font-mono text-[10px] text-gray-500 flex flex-col gap-1 mt-6">
              <div>Vessels processed / year: <span className="text-white">~{annualShips}</span></div>
              <div>Average ship cargo volume: <span className="text-white">10,000 TEU</span></div>
            </div>
          </div>

          {/* Right Column: B2B Metrics & Bar Chart */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 3 Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="card-panel p-5 bg-[#0B1126] border border-white/5 flex flex-col justify-between h-32">
                <span className="text-[9px] text-gray-500 font-orbitron uppercase tracking-widest">Savings Projected</span>
                <span className="text-3xl font-black font-orbitron text-gold block my-1">
                  {formatCurrency(totalCostSaved)}
                </span>
                <span className="text-[9px] text-gray-400 font-mono">Demurrage / Fuel</span>
              </div>

              <div className="card-panel p-5 bg-[#0B1126] border border-white/5 flex flex-col justify-between h-32">
                <span className="text-[9px] text-gray-500 font-orbitron uppercase tracking-widest">Turnaround Time</span>
                <div>
                  <span className="text-3xl font-black font-orbitron text-white block">
                    -35%
                  </span>
                  <span className="text-[9px] text-gold font-orbitron font-bold block mt-0.5">
                    {hoursSavedPerShip.toFixed(1)}h Saved / Ship
                  </span>
                </div>
              </div>

              <div className="card-panel p-5 bg-[#0B1126] border border-white/5 flex flex-col justify-between h-32">
                <span className="text-[9px] text-gray-500 font-orbitron uppercase tracking-widest">Carbon Reduced</span>
                <div>
                  <span className="text-3xl font-black font-orbitron text-white block">
                    -{co2ReducedTons.toLocaleString()} t
                  </span>
                  <span className="text-[9px] text-cyber-blue font-orbitron font-bold block mt-0.5">
                    -40% Fuel Waste
                  </span>
                </div>
              </div>

            </div>

            {/* Flat Comparative chart (Inspired by 'OPTIMIZED FOR SAVINGS' Bar chart in image 2) */}
            <div className="card-panel p-6 bg-[#0B1126] border border-white/5">
              <span className="text-[9px] font-orbitron text-gray-500 uppercase tracking-widest block mb-4">
                PORT DWELL COST BREAKDOWN
              </span>

              <div className="flex flex-col gap-4">
                {/* Bar 1: Traditional */}
                <div>
                  <div className="flex justify-between items-end text-xs text-gray-400 mb-1">
                    <span>Traditional Logistics Operations</span>
                    <span className="font-bold text-white font-mono">{traditionalHeight}%</span>
                  </div>
                  <div className="h-4 w-full bg-obsidian border border-white/5">
                    <div className="h-full bg-white/20 transition-all duration-500 ease-out" style={{ width: `${traditionalHeight}%` }}></div>
                  </div>
                </div>

                {/* Bar 2: AetherFlow */}
                <div>
                  <div className="flex justify-between items-end text-xs text-gray-400 mb-1">
                    <span>AetherFlow Deployment</span>
                    <span className="font-bold text-gold font-mono">{aetherFlowHeight}%</span>
                  </div>
                  <div className="h-4 w-full bg-obsidian border border-white/5">
                    <div className="h-full bg-gold transition-all duration-500 ease-out" style={{ width: `${aetherFlowHeight}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-gray-500 mt-6 pt-4 border-t border-white/5 gap-2">
                <span>Equivalent offset: <strong className="text-white font-mono">{treesPlanted.toLocaleString()} trees</strong> grown for 10 years</span>
                <span>Vehicles offset: <strong className="text-cyber-blue font-mono">{carsRemoved.toLocaleString()} cars / yr</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
