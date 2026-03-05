
-- Create a public storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true);

-- Allow anyone to read (public bucket)
CREATE POLICY "Public read access for generated images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'generated-images');

-- Allow service role (edge functions) to insert
CREATE POLICY "Service role insert for generated images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'generated-images');
