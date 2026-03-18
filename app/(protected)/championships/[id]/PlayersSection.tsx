"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import EvaluateModal from "../../players/components/EvaluateModal";
import PlayerRadarModal from "../../players/components/PlayerRadarModal";
import { toast } from "sonner";
import { useLoading } from "@/components/ui/loading-provider";
import { RegistrationWithPlayer } from "@/types/registration";

export default function PlayersSection({
  registrations,
  role,
}: {
  registrations: RegistrationWithPlayer[];
  role: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const { startLoading, stopLoading } = useLoading();

  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationWithPlayer | null>(null);

  const [radarPlayer, setRadarPlayer] = useState<RegistrationWithPlayer | null>(
    null,
  );

  const [confirmRemove, setConfirmRemove] =
    useState<RegistrationWithPlayer | null>(null);

  const [evaluatedRegistrations, setEvaluatedRegistrations] = useState<
    string[]
  >([]);

  const [filter, setFilter] = useState<"all" | "evaluated" | "not_evaluated">(
    "all",
  );

  const [page, setPage] = useState(1);

  const playersPerPage = 5;

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id || null);
    }

    loadUser();
  }, []);

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

  const totalPages = Math.ceil(filteredRegistrations.length / playersPerPage);

  const startIndex = (page - 1) * playersPerPage;

  const paginatedRegistrations = filteredRegistrations.slice(
    startIndex,
    startIndex + playersPerPage,
  );

  async function removePlayer(registrationId: string) {
    startLoading();

    const { error } = await supabase
      .from("championship_registrations")
      .delete()
      .eq("id", registrationId);

    if (error) {
      toast.error("Erro ao remover jogador");
      stopLoading();
      return;
    }

    toast.success("Jogador removido");

    setConfirmRemove(null);

    router.refresh();

    stopLoading();
  }

  return (
    <div className="bg-zinc-900 p-4 md:p-6 rounded-2xl space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Jogadores Inscritos</h2>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
        <span className="text-sm text-zinc-400">Avaliado:</span>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "evaluated" | "not_evaluated")
          }
          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm w-full md:w-auto"
        >
          <option value="all">Todos</option>
          <option value="evaluated">Sim</option>
          <option value="not_evaluated">Não</option>
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {paginatedRegistrations.map((reg) => {
          const player = reg.player;

          return (
            <div
              key={reg.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-800 px-4 py-3 rounded-xl"
            >
              <div>
                <p className="font-semibold">{player.name}</p>

                <p className="text-sm text-zinc-400">
                  {player.preferred_position}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {evaluatedRegistrations.includes(reg.id) && (
                  <button
                    onClick={() => setRadarPlayer(reg)}
                    className="bg-blue-600 hover:bg-blue-400 cursor-pointer px-4 py-1.5 rounded-lg text-sm"
                  >
                    Análise
                  </button>
                )}

                {!evaluatedRegistrations.includes(reg.id) && (
                  <button
                    onClick={() => setSelectedRegistration(reg)}
                    className="bg-zinc-700 hover:bg-zinc-400 cursor-pointer px-4 py-1.5 rounded-lg text-sm"
                  >
                    Avaliar
                  </button>
                )}

                {role === "admin" && (
                  <button
                    onClick={() => setConfirmRemove(reg)}
                    className="bg-red-600 hover:bg-red-400 cursor-pointer px-4 py-1.5 rounded-lg text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-zinc-800 hover:bg-zinc-400 cursor-pointer px-3 py-1.5 rounded-lg text-sm"
          >
            ←
          </button>

          <span className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-zinc-800 hover:bg-zinc-400 cursor-pointer px-3 py-1.5 rounded-lg text-sm"
          >
            →
          </button>
        </div>
      )}

      {/* REMOVE MODAL */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Confirmar remoção</h3>

            <p className="text-sm text-zinc-400">
              Tem certeza que deseja remover este jogador?
            </p>

            <div className="flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="bg-zinc-700 hover:bg-zinc-400 cursor-pointer px-4 py-2 rounded-lg text-sm w-full md:w-auto"
              >
                Cancelar
              </button>

              <button
                onClick={() => removePlayer(confirmRemove.id)}
                className="bg-red-600 hover:bg-red-400 cursor-pointer px-4 py-2 rounded-lg text-sm w-full md:w-auto"
              >
                Remover
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

      {radarPlayer && radarPlayer.player && (
        <PlayerRadarModal
          registrationId={radarPlayer.id}
          playerName={radarPlayer.player.name}
          position={radarPlayer.player.preferred_position}
          overall={radarPlayer.final_overall || 0}
          onClose={() => setRadarPlayer(null)}
        />
      )}
    </div>
  );
}
