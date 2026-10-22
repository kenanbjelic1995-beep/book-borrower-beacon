import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, type Loan } from "@/lib/loans";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/users/$id")({
  head: () => ({
    meta: [
      { title: "User details — BiblioTech" },
      { name: "description", content: "Books currently borrowed by this library user." },
      { property: "og:title", content: "User details — BiblioTech" },
      { property: "og:description", content: "Books currently borrowed by this library user." },
    ],
  }),
  component: UserDetail,
});

function UserDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["borrower", id],
    queryFn: async () => {
      const [{ data: b, error: e1 }, { data: loans, error: e2 }] = await Promise.all([
        supabase.from("borrowers").select("id, first_name, last_name, created_at").eq("id", id).maybeSingle(),
        supabase
          .from("loans")
          .select("id, borrower_id, user_full_name, book_title, borrow_date, returned_at")
          .eq("borrower_id", id)
          .order("borrow_date", { ascending: false }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { borrower: b, loans: (loans ?? []) as Loan[] };
    },
  });

  async function markReturned(loanId: string) {
    const { error } = await supabase.from("loans").update({ returned_at: new Date().toISOString() }).eq("id", loanId);
    if (error) { toast.error(error.message); return; }
    toast.success("Marked as returned");
    qc.invalidateQueries();
  }

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!data?.borrower) return <p className="text-muted-foreground">User not found.</p>;

  const { borrower, loans } = data;
  const active = loans.filter((l) => !l.returned_at);

  return (
    <div>
      <Link to="/users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All users
      </Link>
      <div className="mt-4 flex items-center gap-4 rounded-xl border bg-card p-6 shadow-card">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-lg font-semibold text-primary-foreground">
          {borrower.first_name[0]}
          {borrower.last_name[0]}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold">
            {borrower.first_name} {borrower.last_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {active.length} book{active.length === 1 ? "" : "s"} on loan · {loans.length} total · member since{" "}
            {formatDate(borrower.created_at)}
          </p>
        </div>
      </div>

      <h2 className="mt-8 font-semibold">Currently borrowed</h2>
      <div className="mt-3 overflow-hidden rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Book title</th>
              <th className="px-5 py-3 font-medium">Borrow date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {active.map((l) => (
              <tr key={l.id}>
                <td className="px-5 py-3 font-medium">{l.book_title}</td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(l.borrow_date)}</td>
                <td className="px-5 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => markReturned(l.id)}>Mark returned</Button>
                </td>
              </tr>
            ))}
            {active.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">No books currently borrowed.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
