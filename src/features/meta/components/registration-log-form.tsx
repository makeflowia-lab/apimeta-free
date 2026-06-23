'use client';

import { useState, type ReactNode, type FormEvent } from 'react';
import { useMetaStore } from '../store/meta-store';
import { RegistrationLog } from '../types';

interface Props {
  initialData?: RegistrationLog | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Order Group Helper
const FormSection = ({ title, number, children }: { title: string; number: string; children: ReactNode }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
      <span className="text-blue-500 font-bold text-xs">{number}</span>
      <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest">{title}</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

export function RegistrationLogForm({ initialData, onSuccess, onCancel }: Props) {
  const { addRegistrationLog, updateRegistrationLog } = useMetaStore();
  const [formData, setFormData] = useState({
    // Strict Order Fields
    phone_company: initialData?.phone_company || '',
    phone_number: initialData?.phone_number || '',
    client_name: initialData?.client_name || '',
    company_name: initialData?.company_name || '',
    make: initialData?.make || '',
    n8n: initialData?.n8n || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    facebook_account: initialData?.facebook_account || '',
    meta_account: initialData?.meta_account || '',
    developers_account: initialData?.developers_account || '',
    business_address: initialData?.business_address || '',
    business_phone: initialData?.business_phone || '',
    website: initialData?.website || '',
    business_portfolio: initialData?.business_portfolio || '',
    app_id: initialData?.app_id || '',
    phone_id: initialData?.phone_id || '',
    waba_id: initialData?.waba_id || '',
    business_verification_status: initialData?.business_verification_status || '',
    system_token: initialData?.system_token || '',
    webhook_url: initialData?.webhook_url || '',
    verification_token: initialData?.verification_token || '',
    pin: initialData?.pin || '',
    // Internal/Aux
    status: initialData?.status || 'pending',
    notes_text: (initialData?.notes as any)?.text || '',
    automation_client_name: initialData?.automation_client_name || 'Registrado desde Formulario'
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.company_name || !formData.phone_number) return;

    const { notes_text, ...cleanData } = formData;
    const finalData = {
      ...cleanData,
      notes: { text: notes_text }
    };

    if (initialData) {
      await updateRegistrationLog(initialData.id, finalData as any);
    } else {
      await addRegistrationLog(finalData as any);
    }

    // Reset form
    setFormData({
      phone_company: '',
      phone_number: '',
      client_name: '',
      company_name: '',
      make: '',
      n8n: '',
      email: '',
      password: '',
      facebook_account: '',
      meta_account: '',
      developers_account: '',
      business_address: '',
      business_phone: '',
      website: '',
      business_portfolio: '',
      app_id: '',
      phone_id: '',
      waba_id: '',
      business_verification_status: '',
      system_token: '',
      webhook_url: '',
      verification_token: '',
      pin: '',
      status: 'pending',
      notes_text: '',
      automation_client_name: 'Registrado desde Formulario'
    });
    
    onSuccess?.();
  };

  const inputClass = "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm";
  const labelClass = "text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1";



  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-3xl p-6 md:p-12 rounded-[3rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center gap-6 mb-4 relative z-10">
        <div className="h-12 w-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight italic">BITÁCORA <span className="text-blue-500">DE REGISTRO</span></h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Configuración Maestra de WhatsApp Business</p>
        </div>
      </div>

      <FormSection title="Datos de Contacto" number="01">
        <div className="space-y-2">
          <label className={labelClass}>COMPAÑÍA TELEFÓNICA</label>
          <input
            type="text"
            value={formData.phone_company}
            onChange={(e) => setFormData({ ...formData, phone_company: e.target.value })}
            placeholder="Ej. Telcel, AT&T, etc."
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>NÚMERO CELULAR</label>
          <input
            type="text"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            placeholder="+52 1 55..."
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>NOMBRE DEL CLIENTE</label>
          <input
            type="text"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="Nombre de la persona"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>NOMBRE DEL LOCAL / NEGOCIO</label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            placeholder="Nombre comercial"
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>MAKE</label>
          <input
            type="text"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            placeholder="Organización / Escenario"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>N8N</label>
          <input
            type="text"
            value={formData.n8n}
            onChange={(e) => setFormData({ ...formData, n8n: e.target.value })}
            placeholder="Instancia / Workflow"
            className={inputClass}
          />
        </div>
      </FormSection>

      <FormSection title="Credenciales y Cuentas" number="02">
        <div className="space-y-2">
          <label className={labelClass}>EMAIL</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="correo@ejemplo.com"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>CONTRASEÑA</label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Contraseña de acceso"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>FACEBOOK FAN PAGE</label>
          <input
            type="text"
            value={formData.facebook_account}
            onChange={(e) => setFormData({ ...formData, facebook_account: e.target.value })}
            placeholder="Link o Nombre de Página"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>META</label>
          <input
            type="text"
            value={formData.meta_account}
            onChange={(e) => setFormData({ ...formData, meta_account: e.target.value })}
            placeholder="Admin de Negocio"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>DEVELOPERS</label>
          <input
            type="text"
            value={formData.developers_account}
            onChange={(e) => setFormData({ ...formData, developers_account: e.target.value })}
            placeholder="Cuenta de Desarrollador"
            className={inputClass}
          />
        </div>
      </FormSection>

      <FormSection title="Información Comercial" number="03">
        <div className="lg:col-span-2 space-y-2">
          <label className={labelClass}>DIRECCIÓN</label>
          <input
            type="text"
            value={formData.business_address}
            onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
            placeholder="Dirección fiscal completa"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>TELÉFONO DEL NEGOCIO</label>
          <input
            type="text"
            value={formData.business_phone}
            onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
            placeholder="Tel. de oficina"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>SITIO WEB</label>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>PORTFOLIO COMERCIAL</label>
          <input
            type="text"
            value={formData.business_portfolio}
            onChange={(e) => setFormData({ ...formData, business_portfolio: e.target.value })}
            placeholder="ID de Portfolio Meta"
            className={inputClass}
          />
        </div>
      </FormSection>

      <FormSection title="Identificadores Técnicos" number="04">
        <div className="space-y-2">
          <label className={labelClass}>IDENTIFICADOR DE LA APP</label>
          <input
            type="text"
            value={formData.app_id}
            onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
            placeholder="App ID"
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>IDENTIFICADOR DE NÚMERO DE TELÉFONO</label>
          <input
            type="text"
            value={formData.phone_id}
            onChange={(e) => setFormData({ ...formData, phone_id: e.target.value })}
            placeholder="Phone ID"
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>IDENTIFICADOR DE LA CUENTA DE WHATSAPP BUSINESS</label>
          <input
            type="text"
            value={formData.waba_id}
            onChange={(e) => setFormData({ ...formData, waba_id: e.target.value })}
            placeholder="WABA ID"
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
      </FormSection>

      <FormSection title="Verificación y Tokens" number="05">
        <div className="space-y-2">
          <label className={labelClass}>VERIFICACIÓN DEL NEGOCIO</label>
          <input
            type="text"
            value={formData.business_verification_status}
            onChange={(e) => setFormData({ ...formData, business_verification_status: e.target.value })}
            placeholder="Estado de verificación"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>TOKEN PERMANENTE</label>
          <input
            type="text"
            value={formData.system_token}
            onChange={(e) => setFormData({ ...formData, system_token: e.target.value })}
            placeholder="Access Token"
            className={`${inputClass} font-mono text-[10px]`}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>WEBHOOK</label>
          <input
            type="text"
            value={formData.webhook_url}
            onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
            placeholder="Endpoint de recepción"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>TOKEN DE VERIFICACION</label>
          <input
            type="text"
            value={formData.verification_token}
            onChange={(e) => setFormData({ ...formData, verification_token: e.target.value })}
            placeholder="Verify Token"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>PIN</label>
          <input
            type="text"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            placeholder="PIN de 6 dígitos"
            className={`${inputClass} tracking-[0.5em] font-bold`}
          />
        </div>
      </FormSection>

      {/* Estado */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <span className="text-blue-500 font-bold text-xs">06</span>
          <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest">Validación de Registro</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-4 space-y-2">
            <label className={labelClass}>Estado del Proceso</label>
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-white/5">
              {['pending', 'verified', 'failed'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`flex-1 py-5 rounded-xl text-xs font-black uppercase transition-all ${
                    formData.status === s 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-1px]' 
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {s === 'pending' ? 'Pendiente' : s === 'verified' ? '¡Sincronizado!' : 'Error de Conexión'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-6 rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-sm"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4 text-xl uppercase tracking-tighter italic group"
        >
          <span>{initialData ? 'Actualizar Ficha' : 'Guardar Bitácora'}</span>
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
