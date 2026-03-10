import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Jogos() {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select("*, home:home_team_id(name), away:away_team_id(name)");

  return (
    <div>
      <h2 className="text-3xl mb-6">Jogos</h2>

      {matches?.map((match) => (
        <div
          key={match.id}
          className="bg-zinc-900 p-4 mb-4 rounded-xl flex justify-between"
        >
          <span>
            {match.home?.name} x {match.away?.name}
          </span>

          <Link
            href={`/jogos/${match.id}`}
            className="bg-green-600 px-4 py-1 rounded"
          >
            Súmula
          </Link>
        </div>
      ))}
    </div>
  );
}
