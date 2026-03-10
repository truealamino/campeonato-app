import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TeamsSection from "./TeamsSection";
import PlayersSection from "./PlayersSection";
import { getUserRole } from "@/lib/auth";

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
    teams (
      id,
      name
    )
  `,
    )
    .eq("championship_id", id)
    .returns<
      {
        id: string;
        teams: {
          id: string;
          name: string;
        };
      }[]
    >();

  const formattedTeams =
    teams?.map((ct) => ({
      id: ct.id,
      name: ct.teams?.name || "",
    })) || [];

  const { data: registrations } = await supabase
    .from("championship_registrations")
    .select(
      `
    id,
    final_overall,
    players!inner (
      id,
      name,
      preferred_position
    )
  `,
    )
    .eq("championship_id", id)
    .returns<
      {
        id: string;
        final_overall: number;
        players: { id: string; name: string; preferred_position: string };
      }[]
    >();

  return (
    <div className="container mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold">{championship.name}</h1>

      <TeamsSection
        championshipId={id}
        teams={formattedTeams}
        role={role as string}
      />

      <PlayersSection
        championshipId={id}
        registrations={registrations || []}
        role={role as string}
      />
    </div>
  );
}
