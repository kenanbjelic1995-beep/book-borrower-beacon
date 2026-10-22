CREATE TABLE public.borrowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (first_name, last_name)
);
CREATE TABLE public.loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id uuid NOT NULL REFERENCES public.borrowers(id) ON DELETE CASCADE,
  user_full_name text NOT NULL,
  book_title text NOT NULL,
  borrow_date date NOT NULL DEFAULT current_date,
  returned_at timestamptz,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX loans_borrower_idx ON public.loans(borrower_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.borrowers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loans TO authenticated;
GRANT ALL ON public.borrowers TO service_role;
GRANT ALL ON public.loans TO service_role;
ALTER TABLE public.borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Librarians manage borrowers" ON public.borrowers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Librarians manage loans" ON public.loans FOR ALL TO authenticated USING (true) WITH CHECK (true);