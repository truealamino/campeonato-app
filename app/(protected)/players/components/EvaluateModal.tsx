"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "../../players/[id]/subscribe/StarRating";
import { recalculateOverall } from "@/lib/overall";

type Registration = {
  id: string;
  players:
    | {
        id: string;
        name: string;
        preferred_position: string;
      }
    | undefined;
};
const skillsLinha = [
  "visao",
  "controle",
  "finalizacao",
  "velocidade",
  "desarme",
  "drible",
];

const skillsGol = [
  "reposicao",
  "comunicacao",
  "posicionamento",
  "reflexo",
  "jogoAereo",
  "agilidade",
];

export default function EvaluateModal({
  registration,
  onClose,
  onEvaluated,
}: {
  registration: Registration;
  onClose: () => void;
  onEvaluated: (registrationId: string) => void;
}) {
  const supabase = createClient();

  const player = registration.players;

  const skills = player?.preferred_position === "Gol" ? skillsGol : skillsLinha;

  const [ratings, setRatings] = useState(
    Object.fromEntries(skills.map((s) => [s, 1])),
  );

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Usuário não autenticado");
      return;
    }

    const rows = skills.map((skill) => ({
      registration_id: registration.id,
      organizer_id: user.id,
      skill,
      rating: ratings[skill],
    }));

    const { error } = await supabase.from("organizer_evaluations").insert(rows);

    await recalculateOverall(registration.id);

    if (error) {
      alert("Erro ao salvar avaliação");
      console.error(error);
      return;
    }

    if (onEvaluated) {
      onEvaluated(registration.id);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[500px] space-y-6">
        <h2 className="text-2xl font-bold">Avaliar {player?.name}</h2>

        {skills.map((skill) => (
          <div key={skill} className="grid grid-cols-2 gap-4 items-center">
            <span className="capitalize">{skill}</span>

            <StarRating
              value={ratings[skill]}
              onChange={(value: number) =>
                setRatings({
                  ...ratings,
                  [skill]: value,
                })
              }
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="bg-zinc-700 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            Salvar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}
