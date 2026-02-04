'use client';

import { useState } from 'react';
import { useMetaStore } from '../store/meta-store';
import { DeveloperForm } from './developer-form';
import { MetaDeveloper } from '../types';

export function DeveloperList() {
  const { developers, syncPages, deleteDeveloper, isLoading } = useMetaStore();
  const [editingDev, setEditingDev] = useState<MetaDeveloper | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el conector "${name}"? Se perderán todas las páginas sincronizadas de este desarrollador.`)) {
      await deleteDeveloper(id);
    }
  };

  if (editingDev) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white italic uppercase tracking-widest">
            GESTIÓN DE <span className="text-blue-500">CONECTOR</span>
          </h3>
          <button 
            onClick={() => setEditingDev(null)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-xs font-bold"
          >
            VOLVER AL PANEL
          </button>
        </div>
        <DeveloperForm 
          initialData={editingDev} 
          onSuccess={() => setEditingDev(null)}
          onCancel={() => setEditingDev(null)}
        />
      </div>
    );
  }

  if (developers.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Sin Conectores Activos</h3>
        <p className="text-gray-400 max-w-xs mx-auto text-sm">Añade una cuenta de desarrollador para empezar a sincronizar páginas de Facebook.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
          CONECTORES <span className="text-blue-500">CONFIGURADOS</span>
          <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded-md font-black italic">{developers.length} ACCOUNTS</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {developers.map((dev) => (
          <div key={dev.id} className="bg-white/5 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-blue-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
               <button 
                onClick={() => setEditingDev(dev)}
                className="p-2 bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 border border-white/10 rounded-lg transition-all"
                title="Editar Conector"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                onClick={() => handleDelete(dev.id, dev.name)}
                className="p-2 bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 border border-white/10 rounded-lg transition-all"
                title="Eliminar Conector"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black text-sm text-white tracking-tight uppercase italic truncate max-w-[200px]">{dev.name}</h4>
                  <p className="text-gray-500 text-[10px] font-bold">{dev.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-600 uppercase">APP ID</span>
                  <span className="text-gray-400">{dev.app_id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-600 uppercase">TOKEN STATUS</span>
                  <span className="text-green-500 font-bold">● ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Added: {new Date(dev.created_at).toLocaleDateString()}</span>
              <button 
                onClick={() => syncPages(dev.id)}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-xl hover:bg-blue-600 text-blue-400 hover:text-white transition-all text-xs font-black italic tracking-widest disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    SINCRONIZANDO...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    SINCRONIZAR PÁGINAS
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
