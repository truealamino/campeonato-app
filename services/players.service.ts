import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getPlayers() {
  const { data, error } = await supabase.from("players").select("*");

  if (error) throw error;

  return data;
}
