"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useChampionship } from "@/components/ChampionshipContext";
import { useLoading } from "@/components/ui/loading-provider";
import { toast } from "sonner";
import TeamsSection from "./TeamsSection";

type TeamItem = {
  id: string;
  name: string;
  logo_url?: string;
};

type ChampionshipTeamResponse = {
  id: string;
  team: {
    id: string;
    name: string;
    logo_url?: string;
  };
};

export default function ChampionshipTeamsPage() {
  const supabase = createClient();
  const { championship } = useChampionship();
  const { startLoading, stopLoading } = useLoading();

  const [teams, setTeams] = useState<TeamItem[]>([]);

  const championshipId = championship?.id;

  useEffect(() => {
    if (!championshipId) return;

    async function loadTeams() {
      startLoading();

      const { data, error } = await supabase
        .from("championship_teams")
        .select(
          `
          id,
          team:teams (
            id,
            name,
            logo_url
          )
        `,
        )
        .eq("championship_id", championshipId)
        .returns<ChampionshipTeamResponse[]>();

      if (error) {
        toast.error("Erro ao carregar times");
        console.error(error);
        stopLoading();
        return;
      }

      const formatted: TeamItem[] =
        data?.map((item) => ({
          id: item.id,
          name: item.team.name,
          logo_url: item.team.logo_url,
        })) || [];

      setTeams(formatted);
      stopLoading();
    }

    loadTeams();
  }, [championshipId]); // ✅ sem loop

  if (!championship) {
    return (
      <div className="text-zinc-400">
        Selecione um campeonato no menu lateral
      </div>
    );
  }

  return (
    <div className="h-full">
      <TeamsSection
        championshipId={championship.id}
        teams={teams}
        role="admin"
      />
    </div>
  );
}
