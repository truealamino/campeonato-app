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
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campeonatos</h1>
        {role === "admin" && (
          <Link
            href="/championships/new"
            className="bg-green-600 px-4 py-2 rounded-xl"
          >
            Novo Campeonato
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {championships?.length === 0 && (
          <p className="text-zinc-400">Nenhum campeonato criado.</p>
        )}

        {championships?.map((champ) => (
          <div
            key={champ.id}
            className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{champ.name}</h2>
              <p className="text-sm text-zinc-400">
                Temporada: {champ.season || "-"}
              </p>
              <p className="text-sm">Status: {champ.status}</p>
            </div>

            <Link
              href={`/championships/${champ.id}`}
              className="bg-zinc-700 px-3 py-1 rounded-lg"
            >
              Ver
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
