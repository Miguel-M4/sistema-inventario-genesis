ALTER TABLE public.herramientas
ADD COLUMN IF NOT EXISTS precio numeric(12, 2) NOT NULL DEFAULT 0;
