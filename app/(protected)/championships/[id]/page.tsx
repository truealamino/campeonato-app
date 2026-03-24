import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TeamsSection from "./TeamsSection";
import PlayersSection from "./PlayersSection";
import { getUserRole } from "@/lib/auth";
import { RegistrationWithPlayer } from "@/types/registration";
import { ChampionshipTeamWithTeam } from "@/types/championship-team";
import { mapChampionshipTeam } from "@/mappers/championship-team.mapper";

export const dynamic = "force-dynamic";

export default async function ChampionshipDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const role = await getUserRole();
  const supabase = await createClient();

  const { data: championship } = await supabase
    .from("championships")
    .select("*")
    .eq("id", id)
    .single();

  if (!championship) return notFound();

  const { data: teams } = await supabase
    .from("championship_teams")
    .select(
      `
      id,
      team: teams (
        id,
        name,
        logo_url
      )
    `,
    )
    .eq("championship_id", id)
    .returns<ChampionshipTeamWithTeam[]>();

  const formattedTeams = teams?.map(mapChampionshipTeam) || [];

  const { data: registrations } = await supabase
    .from("championship_registrations")
    .select(
      `
      id,
      final_overall,
      player:players!inner (
        id,
        name,
        preferred_position
      )
    `,
    )
    .eq("championship_id", id)
    .returns<RegistrationWithPlayer[]>();

  const sortedRegistrations = (registrations || []).sort((a, b) =>
    a.player.name.localeCompare(b.player.name, "pt-BR"),
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-8 md:space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold break-words">
          {championship.name}
        </h1>

        {championship.season && (
          <p className="text-sm text-zinc-400 mt-1">
            Temporada {championship.season}
          </p>
        )}
      </div>

      {/* TIMES */}
      <TeamsSection
        championshipId={id}
        teams={formattedTeams}
        role={role as string}
      />

      {/* JOGADORES */}
      <PlayersSection
        championshipId={id}
        registrations={sortedRegistrations || []}
        role={role as string}
      />
    </div>
  );
}
