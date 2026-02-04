'use client';

import React, { useState } from 'react';
import { useMetaStore } from '../store/meta-store';
import { FacebookPage } from '../types';
import { AutomationBuilder } from './automation-builder';

export function PageList() {
  const { pages, isLoading } = useMetaStore();
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);

  if (isLoading && pages.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">FACEBOOK <span className="text-blue-500">PAGES</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/5 animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-lg mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/2 mb-6"></div>
              <div className="h-8 bg-white/10 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-3xl p-12 rounded-3xl border border-white/5 text-center space-y-4 shadow-inner">
        <div className="mx-auto w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
          <svg className="w-10 h-10 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">ESPERANDO <span className="text-blue-500">ACTIVOS</span></h2>
        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
          Las páginas aparecerán aquí automáticamente al sincronizar tus conectores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.3em] italic px-4">Activos de Facebook Detectados</h2>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="relative group">
            {/* Pulsing glow background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-slate-900/80 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 hover:border-blue-500/50 transition-all">
              {/* Massive Icon / Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-900/50 transform group-hover:rotate-3 transition-transform">
                  {page.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Info Header Style */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-blue-500/20">
                    {page.category}
                  </span>
                  <span className="text-[10px] bg-white/5 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-white/5">
                    ID: {page.page_id}
                  </span>
                </div>
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                  {page.name}
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">Seguidores</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{page.fan_count.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-px bg-white/10"></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">Estado API</p>
                    <p className="text-2xl font-black text-green-500 tracking-tighter flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      LISTO
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedPage(page)}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 uppercase tracking-widest italic text-sm border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  CONFIGURAR AUTOMATIZACIÓN
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPage && (
        <AutomationBuilder 
          page={selectedPage} 
          onClose={() => setSelectedPage(null)} 
        />
      )}
    </div>
  );
}
