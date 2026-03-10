"use client";

import PlayerForm from "../components/PlayerForm";

export default function NewPlayerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Cadastro de Jogador</h1>

      <PlayerForm />
    </div>
  );
}
