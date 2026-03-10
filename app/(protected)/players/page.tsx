import { createClient } from "@/lib/supabase/server";
import { PlayerList } from "@/components/PlayerList";
import CreatePlayerModal from "@/components/CreatePlayerModal";

export default async function JogadoresPage() {
  const supabase = await createClient();

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("name");

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Jogadores</h2>

        <CreatePlayerModal />
      </div>

      <PlayerList players={players || []} />
    </div>
  );
}
