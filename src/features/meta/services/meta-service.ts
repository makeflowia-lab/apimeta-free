'use server';

import { executeQuery } from '@/shared/lib/db';
import { MetaDeveloper, FacebookPage, AutomationConfig, RegistrationLog } from '../types';

// DB Initialization
export async function ensureTablesExist() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS meta_developers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT,
      app_id TEXT UNIQUE NOT NULL,
      app_secret TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS facebook_pages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      access_token TEXT NOT NULL,
      fan_count INTEGER DEFAULT 0,
      category TEXT,
      developer_id UUID REFERENCES meta_developers(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS registration_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      notes JSONB DEFAULT '{}'::jsonb,
      phone_number_id TEXT,
      waba_id TEXT,
      phone_company TEXT,
      webhook_url TEXT,
      verification_token TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS automation_configs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_id TEXT UNIQUE NOT NULL,
      config_name TEXT NOT NULL,
      settings JSONB DEFAULT '{}'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
  ];

  for (const q of queries) {
    await executeQuery(q);
  }
  console.log('[MetaService] Database integrity verified');
}

// Developer Management
export async function getDevelopers() {
  console.log('[MetaService] Fetching developers');
  return executeQuery<MetaDeveloper>('SELECT * FROM meta_developers ORDER BY created_at DESC');
}

export async function createDeveloper(data: Omit<MetaDeveloper, 'id' | 'created_at'>) {
  const query = `
    INSERT INTO meta_developers (name, email, app_id, app_secret)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await executeQuery<MetaDeveloper>(query, [data.name, data.email, data.app_id, data.app_secret]);
  return result[0];
}

export async function updateDeveloper(id: string, data: Partial<MetaDeveloper>) {
  const fields = Object.entries(data)
    .filter(([key, value]) => ['name', 'email', 'app_id', 'app_secret'].includes(key) && value !== undefined)
    .map(([key, _], index) => `${key} = $${index + 2}`);
  
  if (fields.length === 0) return null;

  const query = `UPDATE meta_developers SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
  const values = Object.entries(data)
    .filter(([key, value]) => ['name', 'email', 'app_id', 'app_secret'].includes(key) && value !== undefined)
    .map(([_, value]) => value);

  const result = await executeQuery<MetaDeveloper>(query, [id, ...values]);
  return result[0];
}

export async function deleteDeveloper(id: string) {
  // Cascading deletion of pages should be handled by DB or manually
  await executeQuery('DELETE FROM facebook_pages WHERE developer_id = $1', [id]);
  const query = 'DELETE FROM meta_developers WHERE id = $1';
  await executeQuery(query, [id]);
}

// Page Management
export async function getPages() {
  return executeQuery<FacebookPage>('SELECT * FROM facebook_pages ORDER BY fan_count DESC');
}

export async function upsertPage(data: Omit<FacebookPage, 'id' | 'created_at'>) {
  console.log(`[MetaService] Intentando persistir página: ${data.name} (${data.page_id})`);
  const query = `
    INSERT INTO facebook_pages (page_id, name, access_token, fan_count, category, developer_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (page_id) DO UPDATE SET
      name = EXCLUDED.name,
      access_token = EXCLUDED.access_token,
      fan_count = EXCLUDED.fan_count,
      category = EXCLUDED.category,
      developer_id = EXCLUDED.developer_id
    RETURNING *
  `;
  try {
    const result = await executeQuery<FacebookPage>(query, [
      data.page_id,
      data.name,
      data.access_token,
      data.fan_count,
      data.category,
      data.developer_id
    ]);
    console.log(`[MetaService] Página persistida con éxito: ${data.name}`);
    return result[0];
  } catch (error) {
    console.error(`[MetaService] Error al persistir página ${data.name}:`, error);
    throw error;
  }
}

// Automations
export async function getAutomations(pageId?: string) {
  const query = pageId 
    ? 'SELECT * FROM automation_configs WHERE page_id = $1'
    : 'SELECT * FROM automation_configs ORDER BY created_at DESC';
  const params = pageId ? [pageId] : [];
  return executeQuery<AutomationConfig>(query, params);
}

export async function createAutomation(data: Omit<AutomationConfig, 'id' | 'created_at'>) {
  const query = `
    INSERT INTO automation_configs (page_id, config_name, settings, is_active)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (page_id) DO UPDATE SET
      config_name = EXCLUDED.config_name,
      settings = EXCLUDED.settings,
      is_active = EXCLUDED.is_active
    RETURNING *
  `;
  const result = await executeQuery<AutomationConfig>(query, [
    data.page_id,
    data.config_name,
    data.settings,
    data.is_active
  ]);
  return result[0];
}

// Registration Logs
export async function getRegistrationLogs() {
  const query = 'SELECT *, phone_number_id as phone_id FROM registration_log ORDER BY created_at DESC';
  return executeQuery<RegistrationLog>(query);
}

export async function createRegistrationLog(data: Omit<RegistrationLog, 'id' | 'created_at'>) {
  const query = `
    INSERT INTO registration_log (
      automation_client_name, phone_company, phone_number, client_name, company_name, 
      make, n8n, email, password, facebook_account, meta_account, 
      developers_account, business_address, business_phone, website, 
      business_portfolio, app_id, phone_number_id, waba_id, 
      business_verification_status, system_token, webhook_url, 
      verification_token, pin, status, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
    RETURNING id, automation_client_name, phone_company, phone_number, client_name, company_name, 
              make, n8n, email, password, facebook_account, meta_account, 
              developers_account, business_address, business_phone, website, 
              business_portfolio, app_id, phone_number_id as phone_id, waba_id, 
              business_verification_status, system_token, webhook_url, 
              verification_token, pin, status, notes, created_at
  `;
  const result = await executeQuery<RegistrationLog>(query, [
    data.automation_client_name,
    data.phone_company,
    data.phone_number,
    data.client_name,
    data.company_name,
    data.make,
    data.n8n,
    data.email,
    data.password,
    data.facebook_account,
    data.meta_account,
    data.developers_account,
    data.business_address,
    data.business_phone,
    data.website,
    data.business_portfolio,
    data.app_id,
    data.phone_id,
    data.waba_id,
    data.business_verification_status,
    data.system_token,
    data.webhook_url,
    data.verification_token,
    data.pin,
    data.status,
    data.notes
  ]);
  return result[0];
}

export async function updateRegistrationLog(id: string, data: Partial<RegistrationLog>) {
  // Whitelist of valid columns in database
  const allowedColumns = [
    'automation_client_name', 'phone_company', 'phone_number', 'client_name', 
    'company_name', 'make', 'n8n', 'email', 'password', 'facebook_account', 
    'meta_account', 'developers_account', 'business_address', 'business_phone', 
    'website', 'business_portfolio', 'app_id', 'phone_number_id', 'waba_id', 
    'business_verification_status', 'system_token', 'webhook_url', 
    'verification_token', 'pin', 'status', 'notes'
  ];

  const filteredData = Object.entries(data)
    .filter(([key, value]) => {
      const dbKey = key === 'phone_id' ? 'phone_number_id' : key;
      return allowedColumns.includes(dbKey) && value !== undefined;
    })
    .reduce((obj, [key, value]) => {
      const dbKey = key === 'phone_id' ? 'phone_number_id' : key;
      return { ...obj, [dbKey]: value };
    }, {} as Record<string, any>);

  const fields = Object.keys(filteredData).map((key, index) => `${key} = $${index + 2}`);
  
  if (fields.length === 0) return null;

  const query = `
    UPDATE registration_log 
    SET ${fields.join(', ')} 
    WHERE id = $1 
    RETURNING *, phone_number_id as phone_id
  `;
  
  const values = Object.values(filteredData);

  const result = await executeQuery<RegistrationLog>(query, [id, ...values]);
  return result[0];
}

export async function deleteRegistrationLog(id: string) {
  const query = 'DELETE FROM registration_log WHERE id = $1';
  await executeQuery(query, [id]);
}

// Syncing Logic
import { fetchFacebookPages } from './meta-api-client';

export async function syncDeveloperPages(developerId: string) {
  // 1. Get developer details
  const devs = await executeQuery<MetaDeveloper>('SELECT * FROM meta_developers WHERE id = $1', [developerId]);
  if (devs.length === 0) throw new Error('Developer not found');
  const dev = devs[0];

  // 2. Fetch pages from Meta (using App Secret or a long-lived token - for now we assume app_secret is the token for simplicity or we should handle the flow)
  // NOTE: In a real app, we'd need a valid User Access Token. For this admin, we'll assume the provided secret is a valid system user token or similar.
  const pages = await fetchFacebookPages(dev.app_secret);

  // 3. Upsert pages
  const results = await Promise.all(pages.map((page: any) => 
    upsertPage({ ...page, developer_id: developerId })
  ));

  return results;
}
