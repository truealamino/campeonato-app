"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function TeamsSection({
  championshipId,
  teams,
  role,
}: {
  championshipId: string;
  teams: { id: string; name: string }[];
  role: string;
}) {
  const router = useRouter();
  const [allTeams, setAllTeams] = useState<{ id: string; name: string }[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const supabase = createClient();
  // 🔎 Carrega times que ainda NÃO estão nesse campeonato
  useEffect(() => {
    async function loadTeams() {
      // busca todos os times
      const { data: all } = await supabase.from("teams").select("id, name");

      if (!all) return;

      // filtra os que já estão no campeonato
      const existingTeamIds = teams.map((t) => t.name);

      const available = all.filter(
        (team) => !teams.some((t) => t.name === team.name),
      );

      setAllTeams(available);
    }

    loadTeams();
  }, [teams]);

  // ➕ Adicionar time ao campeonato
  async function addTeam() {
    if (!selectedTeam) return;

    await supabase.from("championship_teams").insert({
      championship_id: championshipId,
      team_id: selectedTeam,
    });

    setSelectedTeam("");
    router.refresh();
  }

  // ❌ Remover time do campeonato
  async function removeTeam(championshipTeamId: string) {
    await supabase
      .from("championship_teams")
      .delete()
      .eq("id", championshipTeamId);

    router.refresh();
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold">Times</h2>

      <div className="flex gap-4">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-zinc-800 p-2 rounded"
        >
          <option value="">Selecione um time</option>
          {allTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {role === "admin" && (
          <button
            onClick={addTeam}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition"
          >
            Adicionar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {teams.length === 0 && (
          <p className="text-zinc-400">Nenhum time adicionado.</p>
        )}

        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-xl"
          >
            <span className="font-medium">{team.name}</span>

            {role === "admin" && (
              <button
                onClick={() => removeTeam(team.id)}
                className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-lg text-sm transition"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
