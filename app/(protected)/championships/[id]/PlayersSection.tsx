"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import EvaluateModal from "../../players/components/EvaluateModal";
import PlayerRadarModal from "../../players/components/PlayerRadarModal";
import { toast } from "sonner";
import { useLoading } from "@/components/ui/loading-provider";

type Registration = {
  id: string;
  final_overall: number;
  players:
    | {
        id: string;
        name: string;
        preferred_position: string;
      }
    | undefined;
};

export default function PlayersSection({
  championshipId,
  registrations,
  role,
}: {
  championshipId: string;
  registrations: Registration[];
  role: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const [radarPlayer, setRadarPlayer] = useState<Registration | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Registration | null>(null);
  const [removing, setRemoving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const { startLoading, stopLoading } = useLoading();

  const [evaluatedRegistrations, setEvaluatedRegistrations] = useState<
    string[]
  >([]);

  const [filter, setFilter] = useState<"all" | "evaluated" | "not_evaluated">(
    "all",
  );

  const [page, setPage] = useState(1);
  const playersPerPage = 5;

  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  async function removePlayer(registrationId: string) {
    try {
      startLoading();
      setRemoving(true);

      const { error } = await supabase
        .from("championship_registrations")
        .delete()
        .eq("id", registrationId);

      if (error) throw error;

      toast.success("Jogador removido com sucesso");

      setConfirmRemove(null);
      router.refresh();
    } catch (err) {
      toast.error("Erro ao remover jogador");
      console.error(err);
    } finally {
      setRemoving(false);
      stopLoading();
    }
  }

  // IMPORTAR CSV
  async function handleImport(file: File) {
    startLoading();
    setImporting(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("championshipId", championshipId);

    setProgress(30);

    await fetch("/api/import-players", {
      method: "POST",
      body: formData,
    });

    setProgress(90);

    setTimeout(() => {
      setProgress(100);
      setImporting(false);
      router.refresh();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => setProgress(0), 1000);
    }, 500);

    stopLoading();
  }

  // pegar usuário logado
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id || null);
    }

    loadUser();
  }, []);

  // carregar avaliações feitas por ele
  useEffect(() => {
    async function loadEvaluations() {
      if (!userId) return;

      const { data } = await supabase
        .from("organizer_evaluations")
        .select("registration_id")
        .eq("organizer_id", userId);

      const ids = [...new Set(data?.map((e) => e.registration_id))];

      setEvaluatedRegistrations(ids || []);
    }

    loadEvaluations();
  }, [userId]);

  // aplicar filtro
  let filteredRegistrations = registrations;

  if (filter === "evaluated") {
    filteredRegistrations = registrations.filter((r) =>
      evaluatedRegistrations.includes(r.id),
    );
  }

  if (filter === "not_evaluated") {
    filteredRegistrations = registrations.filter(
      (r) => !evaluatedRegistrations.includes(r.id),
    );
  }

  filteredRegistrations = [...filteredRegistrations].sort((a, b) =>
    (a.players?.name || "").localeCompare(b.players?.name || ""),
  );

  // paginação
  const totalPages = Math.ceil(filteredRegistrations.length / playersPerPage);

  const startIndex = (page - 1) * playersPerPage;

  const paginatedRegistrations = filteredRegistrations.slice(
    startIndex,
    startIndex + playersPerPage,
  );

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold">Jogadores Inscritos</h2>

      {/* IMPORTAÇÃO CSV */}
      {role === "admin" && (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="bg-green-600 hover:bg-green-400 cursor-pointer px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
            >
              {importing ? "Importando..." : "Importar CSV"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
            />

            <span className="text-xs text-zinc-400">
              Importar inscrições em massa
            </span>
          </div>

          {/* BARRA DE PROGRESSO */}
          {importing && (
            <div className="w-full bg-zinc-800 rounded-lg h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* filtro */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">Avaliado:</span>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "evaluated" | "not_evaluated")
          }
          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
        >
          <option value="all">Todos</option>
          <option value="evaluated">Sim</option>
          <option value="not_evaluated">Não</option>
        </select>
      </div>

      {paginatedRegistrations.length === 0 && (
        <p className="text-zinc-400">Nenhum jogador encontrado.</p>
      )}

      <div className="space-y-3">
        {paginatedRegistrations.map((reg) => {
          const player = reg.players;

          return (
            <div
              key={reg.id}
              className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-xl"
            >
              <div>
                {player ? (
                  <>
                    <p className="font-semibold">{player.name}</p>

                    <p className="text-sm text-zinc-400">
                      {player.preferred_position}
                    </p>
                  </>
                ) : (
                  <p className="text-zinc-500">Jogador não encontrado</p>
                )}
              </div>

              <div className="flex gap-3">
                {evaluatedRegistrations.includes(reg.id) && (
                  <button
                    onClick={() => setRadarPlayer(reg)}
                    className="bg-blue-600 hover:bg-blue-400 cursor-pointer px-4 py-1.5 rounded-lg text-sm transition"
                  >
                    Análise
                  </button>
                )}

                {evaluatedRegistrations.includes(reg.id) ? (
                  <span className="text-green-400 text-sm font-semibold">
                    Avaliado
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedRegistration(reg)}
                    className="bg-zinc-700 hover:bg-zinc-400 cursor-pointer px-4 py-1.5 rounded-lg text-sm transition"
                  >
                    Avaliar
                  </button>
                )}

                {role === "admin" && (
                  <button
                    onClick={() => setConfirmRemove(reg)}
                    className="bg-red-600 hover:bg-red-400 cursor-pointer px-4 py-1.5 rounded-lg text-sm transition"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-zinc-800 hover:bg-zinc-400 cursor-pointer px-3 py-1.5 rounded-lg text-sm transition"
          >
            ←
          </button>

          <span className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-zinc-800 hover:bg-zinc-400 cursor-pointer px-3 py-1.5 rounded-lg text-sm transition"
          >
            →
          </button>
        </div>
      )}

      {confirmRemove && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-2xl p-6 w-[380px] space-y-4">
            <h3 className="text-lg font-semibold">Confirmar remoção</h3>

            <p className="text-sm text-zinc-400">
              Tem certeza que deseja remover este jogador da inscrição?
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="bg-zinc-700 hover:bg-zinc-400 cursor-pointer px-4 py-2 rounded-lg text-sm transition"
              >
                Cancelar
              </button>

              <button
                disabled={removing}
                onClick={() => removePlayer(confirmRemove.id)}
                className="bg-red-600 hover:bg-red-400 cursor-pointer px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
              >
                {removing ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRegistration && (
        <EvaluateModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onEvaluated={(registrationId: string) => {
            setEvaluatedRegistrations((prev) => [...prev, registrationId]);
            router.refresh();
          }}
        />
      )}

      {radarPlayer && radarPlayer.players && (
        <PlayerRadarModal
          registrationId={radarPlayer.id}
          playerName={radarPlayer.players.name}
          position={radarPlayer.players.preferred_position}
          overall={radarPlayer.final_overall}
          onClose={() => setRadarPlayer(null)}
        />
      )}
    </div>
  );
}
