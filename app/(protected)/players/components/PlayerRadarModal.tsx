"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PlayerRadar from "@/components/PlayerRadar";
import { calculateRadar } from "@/lib/calculateRadar";

type Evaluation = {
  skill: string;
  value: number;
};

export default function PlayerRadarModal({
  registrationId,
  playerName,
  position,
  overall,
  onClose,
}: {
  registrationId: string;
  playerName: string;
  position: string;
  overall?: number;
  onClose: () => void;
}) {
  const supabase = createClient();
  const [data, setData] = useState<Evaluation[]>([]);

  useEffect(() => {
    async function load() {
      const { data: evaluations } = await supabase
        .from("organizer_evaluations")
        .select("*")
        .eq("registration_id", registrationId);
      console.log(evaluations);
      const radarData = calculateRadar(evaluations || [], position);

      setData(radarData);
    }

    load();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[500px]">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{playerName}</h2>
            <p className="text-zinc-400 mt-1">{position}</p>
          </div>

          {overall && (
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">
                {overall}
              </div>
              <div className="text-xs text-zinc-400 tracking-wider">
                OVERALL
              </div>
            </div>
          )}
        </div>

        {/* RADAR */}
        <div className="flex justify-center">
          <PlayerRadar data={data} />
        </div>

        {/* FOOTER */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
