"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function EditPlayerForm({
  player,
}: {
  player: {
    id: string;
    name: string;
    official_name?: string;
    preferred_position: string;
    cpf?: string;
  };
}) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(player.name);
  const [officialName, setOfficialName] = useState(player.official_name || "");
  const [position, setPosition] = useState(player.preferred_position);
  const [cpf, setCpf] = useState(player.cpf || "");

  async function handleUpdate() {
    await supabase
      .from("players")
      .update({
        name,
        official_name: officialName,
        preferred_position: position,
        cpf,
      })
      .eq("id", player.id);

    router.refresh();
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl">
      <h3 className="text-xl mb-4">Dados Gerais</h3>

      <div className="grid grid-cols-12 gap-4">
        {/* Nome */}
        <input
          className="bg-zinc-800 p-2 rounded col-span-4"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Nome Oficial */}
        <input
          className="bg-zinc-800 p-2 rounded col-span-4"
          placeholder="Nome Oficial"
          value={officialName}
          onChange={(e) => setOfficialName(e.target.value)}
        />

        {/* CPF */}
        <input
          className="bg-zinc-800 p-2 rounded col-span-3"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        {/* Posição (menor) */}
        <input
          className="bg-zinc-800 p-2 rounded col-span-1"
          placeholder="Posição"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-500"
      >
        Salvar Alterações
      </button>
    </div>
  );
}
