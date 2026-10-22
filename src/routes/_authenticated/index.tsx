import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, Plus, Users } from "lucide-react";
import { fetchLoans, formatDate } from "@/lib/loans";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BiblioTech" },
      { name: "description", content: "Overview of library book loans and borrowers." },
      { property: "og:title", content: "Dashboard — BiblioTech" },
      { property: "og:description", content: "Overview of library book loans and borrowers." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const { data: loans = [], isLoading } = useQuery({ queryKey: ["loans"], queryFn: fetchLoans });
  const active = loans.filter((l) => !l.returned_at);
  const borrowers = new Set(active.map((l) => l.borrower_id)).size;
  const stats = [
    { label: "Books on loan", value: active.length, icon: BookMarked },
    { label: "Active borrowers", value: borrowers, icon: Users },
    { label: "Total loans recorded", value: loans.length, icon: BookMarked },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-brand p-8 text-primary-foreground shadow-card">
        <p className="text-sm opacity-80">Welcome back, {user.email}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Your library at a glance</h1>
        <div className="mt-6 flex gap-3">
          <Button asChild variant="secondary">
            <Link to="/add-loan"><Plus className="h-4 w-4" /> New loan</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-3xl font-semibold">{isLoading ? "–" : s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-semibold">Recent loans</h2>
          <Link to="/users" className="text-sm font-medium text-primary hover:underline">View users</Link>
        </div>
        {active.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            {isLoading ? "Loading…" : "No books on loan yet."}
          </p>
        ) : (
          <ul className="divide-y">
            {active.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{l.book_title}</p>
                  <Link to="/users/$id" params={{ id: l.borrower_id }} className="text-muted-foreground hover:text-primary">
                    {l.user_full_name}
                  </Link>
                </div>
                <span className="text-muted-foreground">{formatDate(l.borrow_date)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
