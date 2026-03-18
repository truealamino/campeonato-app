import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getRegistrationsByChampionshipId(championshipId: string) {
  const { data, error } = await supabase
    .from("championship_registrations")
    .select(
      `
      id,
      final_overall,
      players (
        id,
        name,
        preferred_position
      )
    `,
    )
    .eq("championship_id", championshipId);

  if (error) throw error;

  return data;
}
