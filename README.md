# BiblioTech - Library Book Loan App

Aplikacija "BiblioTech" je web platforma za upravljanje bibliotečkim pozajmicama. Frontend aplikacije je razvijen u React-u, dok se za backend, autentifikaciju i bazu podataka koristi Supabase.

Live demo: [BiblioTech na Lovable](https://book-borrower-beacon.lovable.app)

## Glavne funkcionalnosti
- **Autentifikacija:** Aplikacija zahtijeva prijavu (Login/Register) kako bi se pristupilo sistemu.
- **Add Loan (Dodavanje pozajmice):** Forma za unos imena korisnika, naziva knjige i datuma pozajmice.
- **Users (Korisnici):** Lista svih korisnika koji su pozajmili knjige.
- **Detaljni prikaz:** Klikom na određenog korisnika izlistavaju se sve knjige koje on trenutno ima kod sebe.

## Tehnologije
- **Frontend:** React, Tailwind CSS
- **Backend & Baza:** Supabase
- **Sigurnost:** Row Level Security (RLS) policies

## Postavka baze podataka (Supabase SQL)
Aplikacija koristi relacijsku bazu podataka sa tabelama `borrowers` i `loans`. Baza je osigurana pomoću RLS-a:

```sql
begin;
create table public.borrowers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now(),
  unique (first_name, last_name)
);
grant select, insert, update, delete on public.borrowers to authenticated;
grant all on public.borrowers to service_role;
alter table public.borrowers enable row level security;
create policy "Librarians manage borrowers" on public.borrowers
  for all to authenticated using (auth.uid() is not null)
  with check (auth.uid() is not null);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
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
```
