export interface MetaDeveloper {
  id: string;
  name: string;
  email: string;
  app_id: string;
  app_secret: string;
  created_at: string;
}

export interface FacebookPage {
  id: string;
  page_id: string;
  name: string;
  access_token: string;
  fan_count: number;
  category?: string;
  developer_id?: string;
  created_at: string;
}

export interface AutomationConfig {
  id: string;
  page_id: string;
  config_name: string;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
}
export interface RegistrationLog {
  id: string;
  automation_client_name: string;
  phone_company: string; // New
  phone_number: string;
  client_name: string;
  company_name: string; // Local/Negocio
  make: string;
  n8n: string;
  email: string;
  password?: string;
  facebook_account: string;
  meta_account: string;
  developers_account: string;
  business_address: string;
  business_phone: string;
  website: string;
  business_portfolio: string;
  app_id: string;
  phone_id: string; 
  waba_id: string;
  business_verification_status: string;
  system_token: string; // Will label as "Token Permanente"
  webhook_url: string; // New
  verification_token: string; // New
  pin: string;
  status: string;
  notes: Record<string, any>;
  created_at: string;
}
