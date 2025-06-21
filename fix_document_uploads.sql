-- Fix document_uploads table and permissions
-- Run this in the Supabase SQL Editor

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.document_uploads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL,
    file_type text NOT NULL,
    upload_status text NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')),
    extracted_data jsonb, -- Store parsed data from the document
    error_message text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

-- Grant permissions to service role (this is crucial for API access)
GRANT ALL ON public.document_uploads TO service_role;

-- Create policy for service role to bypass RLS
DROP POLICY IF EXISTS "Allow service role full access to document uploads" ON public.document_uploads;
CREATE POLICY "Allow service role full access to document uploads"
ON public.document_uploads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to manage document uploads" ON public.document_uploads;
CREATE POLICY "Allow authenticated users to manage document uploads"
ON public.document_uploads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_document_uploads_updated_at ON public.document_uploads;
CREATE TRIGGER set_document_uploads_updated_at
    BEFORE UPDATE ON public.document_uploads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 