import { supabase } from "@/lib/supabase";

export type Loan = {
  id: string;
  borrower_id: string;
  user_full_name: string;
  book_title: string;
  borrow_date: string;
  returned_at: string | null;
};

export type Borrower = { id: string; first_name: string; last_name: string };

export async function fetchLoans(): Promise<Loan[]> {
  const { data, error } = await supabase
    .from("loans")
    .select("id, borrower_id, user_full_name, book_title, borrow_date, returned_at")
    .order("borrow_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBorrowers(): Promise<Borrower[]> {
  const { data, error } = await supabase
    .from("borrowers")
    .select("id, first_name, last_name")
    .order("last_name");
  if (error) throw error;
  return data;
}

export async function createLoan(input: {
  firstName: string;
  lastName: string;
  bookTitle: string;
  borrowDate: string;
}) {
  const first_name = input.firstName.trim();
  const last_name = input.lastName.trim();
  const { data: existing, error: findErr } = await supabase
    .from("borrowers")
    .select("id")
    .ilike("first_name", first_name)
    .ilike("last_name", last_name)
    .maybeSingle();
  if (findErr) throw findErr;
  let borrowerId = existing?.id;
  if (!borrowerId) {
    const { data, error } = await supabase
      .from("borrowers")
      .insert({ first_name, last_name })
      .select("id")
      .single();
    if (error) throw error;
    borrowerId = data.id;
  }
  const { error } = await supabase.from("loans").insert({
    borrower_id: borrowerId,
    user_full_name: `${first_name} ${last_name}`,
    book_title: input.bookTitle.trim(),
    borrow_date: input.borrowDate,
  });
  if (error) throw error;
  return borrowerId;
}

export function formatDate(d: string) {
  return new Date(d + (d.length === 10 ? "T00:00:00" : "")).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
