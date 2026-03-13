"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const POSITIONS = ["Goleiro", "Zagueiro", "Meia", "Atacante"];

export function CreatePlayerForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  async function handleSubmit() {
    if (!name || !position) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const { error } = await supabase.from("players").insert({
      name,
      preferred_position: position,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setPosition("");

    // fecha o modal
    if (onSuccess) onSuccess();

    // atualiza lista de jogadores
    router.refresh();
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl mb-4">Cadastrar Jogador</h3>

      <div className="grid grid-cols-3 gap-4">
        <input
          className="bg-zinc-800 p-2 rounded"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="bg-zinc-800 p-2 rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="">Posição</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Criar Jogador
      </button>
    </div>
  );
}
