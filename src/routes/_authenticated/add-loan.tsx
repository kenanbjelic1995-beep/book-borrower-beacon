import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createLoan } from "@/lib/loans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/add-loan")({
  head: () => ({
    meta: [
      { title: "Add Loan — BiblioTech" },
      { name: "description", content: "Record a new borrowed book." },
      { property: "og:title", content: "Add Loan — BiblioTech" },
      { property: "og:description", content: "Record a new borrowed book." },
    ],
  }),
  component: AddLoan,
});

const today = () => new Date().toISOString().slice(0, 10);

function AddLoan() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({ firstName: "", lastName: "", bookTitle: "", borrowDate: today() });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mutation = useMutation({
    mutationFn: createLoan,
    onSuccess: (borrowerId) => {
      qc.invalidateQueries();
      toast.success("Loan recorded");
      navigate({ to: "/users/$id", params: { id: borrowerId } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl font-semibold">Record a loan</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter the borrower and the book they're taking.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-xl border bg-card p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required value={form.firstName} onChange={set("firstName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required value={form.lastName} onChange={set("lastName")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="book">Book title</Label>
          <Input id="book" required value={form.bookTitle} onChange={set("bookTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Borrow date</Label>
          <Input id="date" type="date" required value={form.borrowDate} onChange={set("borrowDate")} />
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save loan"}
        </Button>
      </form>
    </div>
  );
}
