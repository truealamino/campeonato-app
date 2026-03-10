"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export default function Sumula() {
  const { id } = useParams();
  const supabase = createClient();
  const [match, setMatch] = useState<{
    id: string;
    home_team_id: string;
    away_team_id: string;
    home_score: number;
    away_score: number;
    status: string;
    home_team: { id: string; name: string };
    away_team: { id: string; name: string };
  } | null>(null);
  const [playersHome, setPlayersHome] = useState<
    { id: string; name: string; goals: number }[]
  >([]);
  const [playersAway, setPlayersAway] = useState<
    { id: string; name: string; goals: number }[]
  >([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("id", id)
        .single();

      setMatch(data);

      const { data: homePlayers } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", data.home_team_id);

      setPlayersHome(homePlayers || []);

      const { data: awayPlayers } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", data.away_team_id);

      setPlayersAway(awayPlayers || []);
    }

    load();
  }, [id]);

  async function finishMatch() {
    await supabase.from("matches").update({ status: "FINISHED" }).eq("id", id);
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Súmula</h2>

      {playersHome.map((p) => (
        <div key={p.id} className="flex gap-4 mb-2">
          <span>{p.name}</span>
          <button>+ Gol</button>
        </div>
      ))}

      <button
        onClick={finishMatch}
        className="bg-red-600 px-4 py-2 mt-6 rounded"
      >
        Finalizar Partida
      </button>
    </div>
  );
}
