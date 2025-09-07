-- Add role column to existing profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Update existing user to be admin (replace with your actual email)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'nahushpatel880@gmail.com';

-- Add policy for admins to view all profiles for admin panel
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);