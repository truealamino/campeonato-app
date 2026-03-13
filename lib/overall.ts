import { createClient } from "./supabase/client";

export async function recalculateOverall(registrationId: string) {
  const supabase = createClient();

  // auto avaliações
  const { data: self } = await supabase
    .from("self_evaluations")
    .select("rating")
    .eq("registration_id", registrationId);

  // avaliações organizadores
  const { data: org } = await supabase
    .from("organizer_evaluations")
    .select("rating")
    .eq("registration_id", registrationId);

  if (!self?.length) return;

  const autoAvg = self.reduce((sum, r) => sum + r.rating, 0) / self.length;

  const orgAvg =
    org && org.length
      ? org.reduce((sum, r) => sum + r.rating, 0) / org.length
      : autoAvg;

  const autoNorm = autoAvg / 5;
  const orgNorm = orgAvg / 5;

  const score = autoNorm * 0.05 + orgNorm * 0.95;

  const overall = Math.round(76 + score * 18);

  await supabase
    .from("championship_registrations")
    .update({ final_overall: overall })
    .eq("id", registrationId);
}
