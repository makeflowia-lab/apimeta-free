import * as XLSX from 'xlsx';
import { RegistrationLog } from '../types';

export class ExcelExportService {
  /**
   * Exporta la bitácora de registros a un archivo Excel (.xlsx)
   */
  static exportLogs(logs: RegistrationLog[], fileName: string = 'bitacora-meta'): void {
    // 1. Preparar y ordenar los datos según la lista estricta del usuario
    const flattenedData = logs.map(log => ({
      'COMPAÑÍA TELEFÓNICA': log.phone_company || '',
      'NÚMERO CELULAR': log.phone_number || '',
      'NOMBRE DEL CLIENTE': log.client_name || '',
      'NOMBRE DEL LOCAL / NEGOCIO': log.company_name || '',
      'MAKE': log.make || '',
      'N8N': log.n8n || '',
      'EMAIL': log.email || '',
      'CONTRASEÑA': log.password || '',
      'FACEBOOK FAN PAGE': log.facebook_account || '',
      'META': log.meta_account || '',
      'DEVELOPERS': log.developers_account || '',
      'DIRECCIÓN': log.business_address || '',
      'TELÉFONO DEL NEGOCIO': log.business_phone || '',
      'SITIO WEB': log.website || '',
      'PORTFOLIO COMERCIAL': log.business_portfolio || '',
      'IDENTIFICADOR DE LA APP': log.app_id || '',
      'IDENTIFICADOR DE NÚMERO DE TELÉFONO': log.phone_id || '',
      'IDENTIFICADOR DE LA CUENTA DE WHATSAPP BUSINESS': log.waba_id || '',
      'VERIFICACIÓN DEL NEGOCIO': log.business_verification_status || '',
      'TOKEN PERMANENTE': log.system_token || '',
      'WEBHOOK': log.webhook_url || '',
      'TOKEN DE VERIFICACION': log.verification_token || '',
      'PIN': log.pin || '',
      'ESTADO': log.status === 'verified' ? 'ÉXITO' : log.status === 'pending' ? 'PENDIENTE' : 'ERROR',
      'NOTAS': log.notes?.text || '',
      'FECHA DE REGISTRO': new Date(log.created_at).toLocaleString()
    }));

    // 2. Crear el libro y la hoja
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bitácora');

    // 3. Formatear anchos de columna (opcional pero profesional)
    const wscols = [
      { wch: 25 }, // COMPAÑÍA TELEFÓNICA
      { wch: 20 }, // NÚMERO CELULAR
      { wch: 25 }, // NOMBRE DEL CLIENTE
      { wch: 30 }, // NOMBRE DEL LOCAL / NEGOCIO
      { wch: 20 }, // MAKE
      { wch: 20 }, // N8N
      { wch: 25 }, // EMAIL
      { wch: 15 }, // CONTRASEÑA
      { wch: 25 }, // FACEBOOK FAN PAGE
      { wch: 25 }, // META
      { wch: 25 }, // DEVELOPERS
      { wch: 40 }, // DIRECCIÓN
      { wch: 20 }, // TELÉFONO DEL NEGOCIO
      { wch: 25 }, // SITIO WEB
      { wch: 25 }, // PORTFOLIO COMERCIAL
      { wch: 20 }, // APP ID
      { wch: 20 }, // PHONE ID
      { wch: 20 }, // WABA ID
      { wch: 25 }, // VERIFICACIÓN
      { wch: 50 }, // TOKEN PERMANENTE
      { wch: 40 }, // WEBHOOK
      { wch: 25 }, // TOKEN VERIFICACIÓN
      { wch: 10 }, // PIN
      { wch: 12 }, // ESTADO
      { wch: 30 }, // NOTAS
      { wch: 20 }, // FECHA
    ];
    worksheet['!cols'] = wscols;

    // 4. Generar el archivo y trigger download
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${fileName}-${dateStr}.xlsx`);
  }
}
