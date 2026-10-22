-- Run once in the SQL Editor of your user-owned Supabase project.
-- All registered accounts are librarians and share records, as in BiblioTech.
-- Does not transfer any existing Cloud records or accounts.
begin;

create table public.borrowers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.borrowers to authenticated;
grant all on public.borrowers to service_role;
alter table public.borrowers enable row level security;
create policy "Librarians manage borrowers" on public.borrowers
  for all to authenticated using (auth.uid() is not null)
  with check (auth.uid() is not null);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id),
  user_full_name text not null,
  book_title text not null,
  borrow_date date not null default current_date,
  returned_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);
grant select, insert, update, delete on public.loans to authenticated;
grant all on public.loans to service_role;
alter table public.loans enable row level security;
create policy "Librarians manage loans" on public.loans
  for all to authenticated using (auth.uid() is not null)
  with check (auth.uid() is not null);

create index loans_borrower_id_idx on public.loans(borrower_id);
commit;