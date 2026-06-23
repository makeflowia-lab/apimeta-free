'use client';

import React, { useEffect, useState } from 'react';
import { useMetaStore } from '@/features/meta/store/meta-store';
import { DeveloperForm } from '@/features/meta/components/developer-form';
import { DeveloperList } from '@/features/meta/components/developer-list';
import { PageList } from '@/features/meta/components/page-list';
import { RegistrationLogForm } from '@/features/meta/components/registration-log-form';
import { RegistrationLogList } from '@/features/meta/components/registration-log-list';

export default function DashboardPage() {
  const { fetchInitialData, isLoading, error } = useMetaStore();
  const [activeTab, setActiveTab] = useState<'management' | 'bitacora'>('bitacora');
  const [showAddDev, setShowAddDev] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="w-full px-4 md:px-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              Log <span className="text-blue-500">Manager</span>
            </h1>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
          </div>
          
          <button 
            onClick={() => setShowAddLog(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl transition-all font-black italic tracking-widest text-sm uppercase shadow-2xl shadow-blue-900/60 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 flex items-center gap-3"
          >
            <span className="text-xl">+</span> Nuevo Registro
          </button>
        </div>

        {/* Content Area - Full Width */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-6">
             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter whitespace-nowrap">
                Control de <span className="text-blue-500">Registros Activos</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          <RegistrationLogList />
        </div>
      </div>

      {/* Modals - Fixed Scroll Visibility */}
      {showAddLog && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-y-auto pt-10 pb-20 px-4">
          <div className="flex justify-center items-start min-h-full">
            <div className="w-full max-w-7xl animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden mb-12">
                <RegistrationLogForm 
                  onSuccess={() => setShowAddLog(false)} 
                  onCancel={() => setShowAddLog(false)} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
