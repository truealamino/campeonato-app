import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SubscribeForm from "./SubscribeForm";

export default async function Page({
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

  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .order("name");

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Inscrever {player.name}</h1>

      <SubscribeForm player={player} championships={championships || []} />
    </div>
  );
}
