import { Container, buttonClass } from "@/components/ui";
import { confirmSubscriber, removeSubscriber } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Subscriber } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "In attesa",
  confirmed: "Confermato",
  unsubscribed: "Disiscritto",
};

export default async function AdminIscrittiPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const [{ data: subscribersData }, { data: profilesData }] = await Promise.all([
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
  ]);

  const subscribers = (subscribersData as Subscriber[]) ?? [];
  const profiles = (profilesData as Profile[]) ?? [];
  const confirmed = subscribers.filter((subscriber) => subscriber.status === "confirmed").length;

  return (
    <Container className="py-10">
      <h1 className="t-h2 mt-2">Iscritti</h1>

      <dl className="mt-6 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
        {[
          { label: "Newsletter confermati", value: confirmed },
          { label: "In attesa di conferma", value: subscribers.length - confirmed },
          { label: "Account area riservata", value: profiles.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-5">
            <dt className="ui text-[0.82rem] font-medium text-ink">{stat.label}</dt>
            <dd className="mt-2 text-3xl leading-none text-ink num">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {/* ------------------------------------------------------------ Newsletter */}
      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
          <h2 className="t-h3">Newsletter</h2>
          <a href="/admin/iscritti/export?tipo=newsletter" className={cn(buttonClass("outline", "sm"))}>
            Esporta CSV
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule">
                {["Email", "Stato", "Provenienza", "Iscritto il", "Azioni"].map((heading) => (
                  <th key={heading} className="col-head py-3 pr-4 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-rule">
                  <td className="py-3 pr-4 text-[0.9rem] text-ink">{subscriber.email}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "col-head",
                        subscriber.status === "confirmed"
                          ? "text-accent"
                          : subscriber.status === "pending"
                            ? "text-warning"
                            : "text-ink-3",
                      )}
                    >
                      {statusLabels[subscriber.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 meta">{subscriber.source ?? "—"}</td>
                  <td className="py-3 pr-4 meta">{formatShortDate(subscriber.created_at)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      {subscriber.status === "pending" ? (
                        <form action={confirmSubscriber}>
                          <input type="hidden" name="id" value={subscriber.id} />
                          <button type="submit" className="ui text-[0.82rem] font-medium text-accent transition-colors hover:text-ink">
                            Conferma
                          </button>
                        </form>
                      ) : null}
                      <form action={removeSubscriber}>
                        <input type="hidden" name="id" value={subscriber.id} />
                        <button type="submit" className="ui text-[0.82rem] font-medium text-danger transition-colors hover:text-ink">
                          Elimina
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!subscribers.length ? <p className="py-8 text-[0.95rem] text-ink-2">Nessun iscritto per ora.</p> : null}
      </section>

      {/* --------------------------------------------------------------- Account */}
      <section className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
          <h2 className="t-h3">Account area riservata</h2>
          <a href="/admin/iscritti/export?tipo=account" className={cn(buttonClass("outline", "sm"))}>
            Esporta CSV
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule">
                {["Nome", "Email", "Studio", "Ruolo", "Registrato il"].map((heading) => (
                  <th key={heading} className="col-head py-3 pr-4 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-b border-rule">
                  <td className="py-3 pr-4 text-[0.9rem] text-ink">{profile.full_name ?? "—"}</td>
                  <td className="py-3 pr-4 text-[0.9rem] text-ink-2">{profile.email}</td>
                  <td className="py-3 pr-4 text-[0.9rem] text-ink-2">{profile.studio ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <span className={cn("col-head", profile.role === "admin" ? "text-accent" : "text-ink-3")}>
                      {profile.role === "admin" ? "Admin" : "Utente"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 meta">{formatShortDate(profile.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!profiles.length ? <p className="py-8 text-[0.95rem] text-ink-2">Nessun account registrato.</p> : null}
      </section>
    </Container>
  );
}
