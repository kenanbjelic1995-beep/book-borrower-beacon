import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchBorrowers, fetchLoans } from "@/lib/loans";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/users/")({
  head: () => ({
    meta: [
      { title: "Users — BiblioTech" },
      { name: "description", content: "All library users who have borrowed books." },
      { property: "og:title", content: "Users — BiblioTech" },
      { property: "og:description", content: "All library users who have borrowed books." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UsersList,
});

function UsersList() {
  const [q, setQ] = useState("");
  const borrowers = useQuery({ queryKey: ["borrowers"], queryFn: fetchBorrowers });
  const loans = useQuery({ queryKey: ["loans"], queryFn: fetchLoans });

  const rows = (borrowers.data ?? [])
    .map((b) => {
      const mine = (loans.data ?? []).filter((l) => l.borrower_id === b.id);
      return { ...b, active: mine.filter((l) => !l.returned_at).length, total: mine.length };
    })
    .filter((b) => `${b.first_name} ${b.last_name}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everyone who has borrowed a book.</p>
        </div>
        <Input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Books on loan</th>
              <th className="px-5 py-3 font-medium">Total loans</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-muted/50">
                <td className="px-5 py-3">
                  <Link to="/users/$id" params={{ id: b.id }} className="font-medium text-primary hover:underline">
                    {b.first_name} {b.last_name}
                  </Link>
                </td>
                <td className="px-5 py-3">{b.active}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.total}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-muted-foreground">
                  {borrowers.isLoading ? "Loading…" : "No users yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
