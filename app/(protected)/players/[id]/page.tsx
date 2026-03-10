import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditPlayerForm from "./EditPlayerForm";
import PlayerChampionshipList from "./PlayerChampionshipList";

type Registration = {
  id: string;
  final_overall: number | null;
  championships: {
    id: string;
    name: string;
  };
};

export default async function PlayerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (!player) return notFound();

  const { data: registrations } = await supabase
    .from("championship_registrations")
    .select(
      `
    id,
    final_overall,
    championships (
      id,
      name
    )
  `,
    )
    .eq("player_id", id)
    .returns<Registration[]>();

  const championships =
    registrations?.map((item) => ({
      id: item.championships?.id,
      name: item.championships?.name,
      overall: item.final_overall || 0,
    })) || [];

  return (
    <div className="container mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold">Editar Jogador</h1>

      <EditPlayerForm player={player} />

      <PlayerChampionshipList
        playerId={player.id}
        championships={championships}
      />
    </div>
  );
}
