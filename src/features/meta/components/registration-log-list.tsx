'use client';

import React, { useState } from 'react';
import { useMetaStore } from '../store/meta-store';
import { ExcelExportService } from '../services/excel-export-service';
import { RegistrationLog } from '../types';
import { RegistrationLogForm } from './registration-log-form';

export function RegistrationLogList() {
  const { registrationLogs, fetchInitialData, deleteRegistrationLog, isLoading } = useMetaStore();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<RegistrationLog | null>(null);

  const handleExport = () => {
    ExcelExportService.exportLogs(registrationLogs, 'bitacora-registro-meta');
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro de "${name}"? Esta acción no se puede deshacer.`)) {
      await deleteRegistrationLog(id);
    }
  };

  if (registrationLogs.length === 0 && !isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Bitácora Vacía</h3>
        <p className="text-gray-400 max-w-xs mx-auto">Aún no has registrado ningún proceso de alta de número en Meta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-black text-white flex items-center gap-3 italic">
            BITÁCORA DE <span className="text-blue-500">REGISTROS</span>
            <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded-md font-black italic">{registrationLogs.length} ITEMS</span>
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all text-sm font-bold shadow-lg"
            title="Descargar reporte completo en Excel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            EXPORTAR EXCEL
          </button>
          <button
            onClick={() => fetchInitialData()}
            disabled={isLoading}
            className={`p-2 text-gray-400 hover:text-white transition-colors ${isLoading ? 'animate-spin opacity-50' : ''}`}
            title="Refrescar datos de Meta"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Modal de Edición */}
        {editingLog && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-y-auto pt-10 pb-20 px-4">
            <div className="flex justify-center items-start min-h-full">
              <div className="w-full max-w-7xl animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden mb-12">
                  <RegistrationLogForm 
                    initialData={editingLog}
                    onSuccess={() => setEditingLog(null)} 
                    onCancel={() => setEditingLog(null)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {registrationLogs.map((log) => {
          const isExpanded = expandedLog === log.id;
          
          const statusColors = {
            verified: 'bg-green-500/20 text-green-500 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
            pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
            failed: 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
          };

          return (
            <div 
              key={log.id} 
              className={`bg-white/5 backdrop-blur-xl p-6 rounded-2xl border ${isExpanded ? 'border-blue-500/30 bg-white/[0.07]' : 'border-white/10'} hover:border-blue-500/30 transition-all group relative overflow-hidden`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-5">
                  <div className={`h-14 w-14 ${log.status === 'verified' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'} rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform duration-500`}>
                    <svg className={`w-7 h-7 ${log.status === 'verified' ? 'text-green-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-xl text-white tracking-tight">{log.company_name || 'SIN NOMBRE'}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md border-2 uppercase font-black italic tracking-wider ${statusColors[log.status as keyof typeof statusColors] || statusColors.pending}`}>
                        {log.status === 'verified' ? 'ÉXITO' : log.status === 'pending' ? 'PENDIENTE' : 'ERROR'}
                      </span>
                    </div>
                    <p className="text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-blue-400 font-black italic tracking-widest">{log.phone_number}</span>
                      <span className="text-gray-700">/</span>
                      <span className="text-gray-300 font-bold uppercase text-[12px]">{log.client_name || 'SIN CLIENTE'}</span>
                      <span className="text-gray-700">/</span>
                      <span className="text-gray-500 font-medium text-xs font-mono">{new Date(log.created_at).toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => ExcelExportService.exportLogs([log], `registro-${log.company_name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="p-2.5 bg-green-600/10 text-green-400 border border-green-600/20 rounded-xl hover:bg-green-600/20 transition-all"
                    title="Exportar esta ficha a Excel"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setEditingLog(log)}
                    className="p-2.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl hover:bg-blue-600/20 transition-all"
                    title="Editar este registro"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(log.id, log.company_name)}
                    className="p-2.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl hover:bg-red-600/20 transition-all"
                    title="Eliminar este registro"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    className={`text-xs px-5 py-2.5 rounded-xl border font-black italic transition-all uppercase tracking-widest flex items-center gap-2 ${
                      isExpanded ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/40' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {isExpanded ? 'CERRAR FICHA' : 'VER FICHA TÉCNICA'}
                    <svg className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  {/* Bloque 1: Origen & Contacto */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-3">01 ORIGEN & CONTACTO</h5>
                    <div className="grid gap-3">
                      <DetailItem label="Compañía Telefónica" value={log.phone_company} />
                      <DetailItem label="Número Celular" value={log.phone_number} highlight />
                      <DetailItem label="Nombre del Cliente" value={log.client_name} />
                      <DetailItem label="Local / Negocio" value={log.company_name} />
                      <div className="flex gap-4 pt-1">
                        <DetailItem label="MAKE" value={log.make} small />
                        <DetailItem label="N8N" value={log.n8n} small />
                      </div>
                    </div>
                  </div>

                  {/* Bloque 2: Cuentas & Acceso */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] border-l-4 border-purple-500 pl-3">02 CUENTAS & ACCESO</h5>
                    <div className="grid gap-3">
                      <DetailItem label="Email de Acceso" value={log.email} />
                      <DetailItem label="Contraseña" value={log.password} isSecret />
                      <DetailItem label="Facebook Fan Page" value={log.facebook_account} />
                      <DetailItem label="Admin de Meta" value={log.meta_account} />
                      <DetailItem label="Cuenta Developers" value={log.developers_account} />
                    </div>
                  </div>

                  {/* Bloque 3: Datos Comerciales */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] border-l-4 border-green-500 pl-3">03 DATOS COMERCIALES</h5>
                    <div className="grid gap-3">
                      <DetailItem label="Dirección" value={log.business_address} />
                      <DetailItem label="Teléfono Comercial" value={log.business_phone} />
                      <DetailItem label="Sitio Web" value={log.website} />
                      <DetailItem label="Portfolio ID" value={log.business_portfolio} />
                    </div>
                  </div>

                  {/* Bloque 4: Meta IDs & Tokens */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] border-l-4 border-yellow-500 pl-3">04 META IDs & TOKENS</h5>
                    <div className="grid gap-3">
                      <DetailItem label="App ID" value={log.app_id} fontMono />
                      <DetailItem label="Phone ID" value={log.phone_id} fontMono />
                      <DetailItem label="WABA ID" value={log.waba_id} fontMono />
                      <DetailItem label="PIN 6-Dígitos" value={log.pin} fontMono highlight />
                    </div>
                  </div>

                  {/* Bloque Inferior: Webhook y Token Permanente */}
                  {(log.webhook_url || log.system_token) && (
                    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-black/30 rounded-2xl border border-white/5">
                      {log.webhook_url && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">WebHook de Recepción</label>
                          <p className="text-[10px] font-mono text-blue-300 break-all select-all cursor-pointer">{log.webhook_url}</p>
                        </div>
                      )}
                      {log.verification_token && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Token de Verificación</label>
                          <p className="text-[10px] font-mono text-cyan-300 break-all select-all">{log.verification_token}</p>
                        </div>
                      )}
                      {log.system_token && (
                        <div className="md:col-span-2 space-y-1 border-t border-white/5 pt-3">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Token Permanente (System User)</label>
                          <div className="flex gap-2">
                             <p className="text-[9px] font-mono text-blue-300/60 break-all leading-relaxed bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 w-full select-all">{log.system_token}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {log.notes?.text && (
                    <div className="lg:col-span-4 bg-white/[0.03] p-5 rounded-2xl border border-white/5 italic">
                      <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Observaciones del Analista</h5>
                      <p className="text-sm text-gray-400">"{log.notes.text}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailItem({ label, value, isSecret = false, fontMono = false, highlight = false, small = false }: { label: string; value?: string | null; isSecret?: boolean, fontMono?: boolean, highlight?: boolean, small?: boolean }) {
  if (!value) return null;
  return (
    <div className="group/item">
      <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter mb-0.5">{label}</p>
      <p className={`text-white truncate ${fontMono ? 'font-mono' : ''} ${highlight ? 'text-blue-400 font-black' : 'text-[13px] font-medium'} ${small ? 'text-xs' : ''}`}>
        {isSecret ? '••••••••' : value}
      </p>
    </div>
  );
}
