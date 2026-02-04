'use client';

import React, { useState } from 'react';
import { useMetaStore } from '../store/meta-store';

import { MetaDeveloper } from '../types';

interface Props {
  initialData?: MetaDeveloper | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DeveloperForm({ initialData, onSuccess, onCancel }: Props) {
  const { addDeveloper, updateDeveloper, isLoading, error } = useMetaStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    app_id: initialData?.app_id || '',
    app_secret: initialData?.app_secret || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await updateDeveloper(initialData.id, formData);
    } else {
      await addDeveloper(formData);
    }
    
    if (!initialData) {
      setFormData({ name: '', email: '', app_id: '', app_secret: '' });
    }
    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Source Connector
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
         <div className="h-12 w-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
         </div>
         <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {initialData ? 'CONFIGURAR' : 'CONECTAR'} <span className="text-blue-500">CUENTA META</span>
            </h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sincronización Maestra de Activos de Facebook</p>
         </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-red-400 font-medium">
            <span className="font-bold uppercase block mb-1">Error de Conexión</span>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">NOMBRE DE LA CUENTA</label>
            <input
              type="text"
              required
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Meta Business Suite - Principal"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">CORREO DEL DESARROLLADOR</label>
            <input
              type="email"
              required
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@tuempresa.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">META APP ID</label>
            <input
              type="text"
              required
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xs"
              value={formData.app_id}
              onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
              placeholder="1234567890..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider ml-1">SYSTEM ACCESS TOKEN (LLAVE)</label>
            <input
              type="password"
              required
              className="w-full bg-slate-900 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-xs"
              value={formData.app_secret}
              onChange={(e) => setFormData({ ...formData, app_secret: e.target.value })}
              placeholder="EAAB..."
            />
            <p className="text-[9px] text-gray-500 mt-1 italic leading-tight">Este token permite escanear automáticamente todas tus páginas.</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-xs"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 text-sm uppercase tracking-wider italic"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>{initialData ? 'ACTUALIZAR CONECTOR' : 'CONECTAR AHORA'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
