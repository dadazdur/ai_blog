import { NextResponse, type NextRequest } from "next/server";
import { createClient, requireAdmin } from "@/lib/supabase/server";

/** Esportazione CSV pronta per l'import in un provider di email marketing. */
export async function GET(request: NextRequest) {
  const profile = await requireAdmin();
  if (!profile) return new NextResponse("Accesso negato", { status: 403 });

  const supabase = await createClient();
  if (!supabase) return new NextResponse("Database non configurato", { status: 500 });

  const tipo = new URL(request.url).searchParams.get("tipo") === "account" ? "account" : "newsletter";

  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  let header: string[];
  let rows: string[][];

  if (tipo === "account") {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name, studio, role, created_at")
      .order("created_at", { ascending: false });

    header = ["email", "nome", "studio", "ruolo", "registrato_il"];
    rows = (data ?? []).map((row) => [row.email, row.full_name, row.studio, row.role, row.created_at].map(escape));
  } else {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("email, status, source, created_at, confirmed_at")
      .order("created_at", { ascending: false });

    header = ["email", "stato", "provenienza", "iscritto_il", "confermato_il"];
    rows = (data ?? []).map((row) =>
      [row.email, row.status, row.source, row.created_at, row.confirmed_at].map(escape),
    );
  }

  // BOM iniziale: Excel in italiano apre il file con la codifica giusta.
  const csv = `﻿${[header.join(";"), ...rows.map((row) => row.join(";"))].join("\n")}`;
  const filename = `${tipo}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
