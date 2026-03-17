import { getUserRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ChampionshipsPage() {
  const role = await getUserRole();
  const supabase = await createClient();

  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Campeonatos</h1>

        {role === "admin" && (
          <Link
            href="/championships/new"
            className="bg-green-600 hover:bg-green-500 transition px-4 py-2 rounded-xl text-sm md:text-base text-center"
          >
            Novo Campeonato
          </Link>
        )}
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {championships?.length === 0 && (
          <p className="text-zinc-400">Nenhum campeonato criado.</p>
        )}

        {championships?.map((champ) => (
          <div
            key={champ.id}
            className="bg-zinc-900 p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div>
              <h2 className="text-lg md:text-xl font-semibold">{champ.name}</h2>

              <p className="text-sm text-zinc-400">
                Temporada: {champ.season || "-"}
              </p>

              <p className="text-sm">Status: {champ.status}</p>
            </div>

            <Link
              href={`/championships/${champ.id}`}
              className="bg-zinc-700 hover:bg-zinc-600 transition px-3 py-1.5 rounded-lg text-sm text-center"
            >
              Ver
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
