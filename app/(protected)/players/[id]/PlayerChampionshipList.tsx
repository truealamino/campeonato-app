"use client";

import { useRouter } from "next/navigation";

export default function PlayerChampionshipList({
  playerId,
  championships,
}: {
  playerId: string;
  championships: { id: string; name: string; overall: number }[];
}) {
  const router = useRouter();

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl">Campeonatos Inscritos</h3>

        <button
          onClick={() => router.push(`/players/${playerId}/subscribe`)}
          className="bg-green-600 px-4 py-2 rounded-xl"
        >
          Inscrever no Campeonato
        </button>
      </div>

      <div className="space-y-3">
        {championships.length === 0 && (
          <p className="text-zinc-400 text-sm">Nenhum campeonato inscrito.</p>
        )}

        {championships.map(
          (item: { id: string; name: string; overall: number }) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-4 rounded-xl flex justify-between"
            >
              <span>{item.name}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
