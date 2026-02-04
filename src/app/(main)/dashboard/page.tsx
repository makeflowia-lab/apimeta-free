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
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Log <span className="text-blue-500">Manager</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setShowAddLog(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl transition-all font-black italic tracking-widest text-sm uppercase shadow-xl shadow-blue-900/40 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
          >
            + Nuevo Registro
          </button>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Content Area - Only Bitacora */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-2">
             <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                Control de <span className="text-blue-500">Registros Activos</span>
              </h2>
              <div className="h-0.5 flex-1 bg-white/5"></div>
          </div>
          <RegistrationLogList />
        </div>
      </div>

      {/* Modals */}
      {showAddLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl my-8">
            <RegistrationLogForm 
              onSuccess={() => setShowAddLog(false)} 
              onCancel={() => setShowAddLog(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
