"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewChampionshipForm() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name) {
      alert("Nome obrigatório");
      return;
    }

    const { error } = await supabase
      .from("championships")
      .insert({ name, season, status: "draft" });

    if (error) {
      alert("Erro ao criar campeonato");
      return;
    }

    router.push("/championships");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-2xl space-y-6 max-w-xl"
    >
      <div>
        <label className="block mb-2">Nome do Campeonato</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-zinc-800 p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Temporada</label>
        <input
          type="text"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="bg-zinc-800 p-2 rounded w-full"
        />
      </div>

      <button type="submit" className="bg-green-600 px-6 py-2 rounded-xl">
        Criar Campeonato
      </button>
    </form>
  );
}
