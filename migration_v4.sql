ALTER TABLE registration_log ADD COLUMN IF NOT EXISTS phone_company TEXT;
ALTER TABLE registration_log ADD COLUMN IF NOT EXISTS webhook_url TEXT;
ALTER TABLE registration_log ADD COLUMN IF NOT EXISTS verification_token TEXT;
