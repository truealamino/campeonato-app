"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TimesPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

  async function loadTeams() {
    const { data } = await supabase.from("teams").select("*");
    setTeams(data || []);
  }

  async function createTeam() {
    await supabase.from("teams").insert({ name });
    setName("");
    loadTeams();
  }

  useEffect(() => {
    async function fetchTeams() {
      const { data } = await supabase.from("teams").select("*");
      setTeams(data || []);
    }

    fetchTeams();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Times</h2>

      <div className="flex gap-4 mb-6">
        <input
          className="bg-zinc-800 p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do time"
        />
        <button onClick={createTeam} className="bg-blue-600 px-4 py-2 rounded">
          Criar
        </button>
      </div>

      <ul>
        {teams.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
}
