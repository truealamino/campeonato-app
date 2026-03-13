import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Papa from "papaparse";

function normalizeCPF(cpf?: string) {
  if (!cpf) return "";
  return cpf.replace(/\D/g, "");
}

function toNumber(value?: string) {
  if (!value) return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const form = await req.formData();
  const file = form.get("file") as File;
  const championshipId = form.get("championshipId") as string;

  if (!file || !championshipId) {
    return NextResponse.json(
      { error: "Arquivo ou campeonato não informado" },
      { status: 400 },
    );
  }

  const text = await file.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  for (const row of parsed.data as {
    "Nome Completo": string;
    "Nome da Camisa (Uniforme)": string;
    Posição: string;
    CPF: string;
    Email: string;
    WhatsApp: string;
    "Data de Nascimento": string;
    "Instagram (opcional)": string;
    Altura: string;
    Peso: string;
    "Autorização do Responsável Legal": string;
    "Foto de Perfil (3x4)": string;
    "Visão de Jogo": string;
    "Controle de Bola": string;
    Finalização: string;
    Velocidade: string;
    Desarme: string;
    Drible: string;
    Reposição: string;
    Comunicação: string;
    Reflexo: string;
    Posicionamento: string;
    "Jogo Aéreo": string;
    Agilidade: string;
  }[]) {
    const cpf = normalizeCPF(row["CPF"]);

    if (!cpf) continue;

    const name = row["Nome da Camisa (Uniforme)"]?.trim();
    const officialName = row["Nome Completo"]?.trim();

    // buscar jogador pelo CPF
    const { data: existing } = await supabase
      .from("players")
      .select("*")
      .eq("cpf", cpf)
      .maybeSingle();

    let playerId = existing?.id;

    if (!existing) {
      const { data: newPlayer } = await supabase
        .from("players")
        .insert({
          name,
          official_name: officialName,
          preferred_position: row["Posição"],
          cpf,
          email: row["Email"],
          whatsapp: row["WhatsApp"],
          birth_date: row["Data de Nascimento"],
          instagram: row["Instagram (opcional)"],
          height: toNumber(row["Altura"]),
          weight: toNumber(row["Peso"]),
        })
        .select()
        .single();

      playerId = newPlayer.id;
    } else {
      await supabase
        .from("players")
        .update({
          name,
          official_name: officialName,
          email: row["Email"],
          whatsapp: row["WhatsApp"],
          instagram: row["Instagram (opcional)"],
          height: toNumber(row["Altura"]),
          weight: toNumber(row["Peso"]),
        })
        .eq("id", playerId);
    }

    // verificar inscrição
    const { data: registration } = await supabase
      .from("championship_registrations")
      .select("id")
      .eq("championship_id", championshipId)
      .eq("player_id", playerId)
      .maybeSingle();

    if (registration) continue;

    const { data: newRegistration } = await supabase
      .from("championship_registrations")
      .insert({
        championship_id: championshipId,
        player_id: playerId,
        legal_authorization_link: row["Autorização do Responsável Legal"],
        profile_photo_link: row["Foto de Perfil (3x4)"],
      })
      .select()
      .single();

    const registrationId = newRegistration.id;

    const skills = [
      ["visao", row["Visão de Jogo"]],
      ["controle", row["Controle de Bola"]],
      ["finalizacao", row["Finalização"]],
      ["velocidade", row["Velocidade"]],
      ["desarme", row["Desarme"]],
      ["drible", row["Drible"]],
      ["reposicao", row["Reposição"]],
      ["comunicacao", row["Comunicação"]],
      ["reflexo", row["Reflexo"]],
      ["posicionamento", row["Posicionamento"]],
      ["jogoAereo", row["Jogo Aéreo"]],
      ["agilidade", row["Agilidade"]],
    ];

    const evaluations = skills
      .filter(([, value]) => value && value !== "")
      .map(([skill, rating]) => ({
        registration_id: registrationId,
        skill,
        rating: Number(rating),
      }));

    if (evaluations.length) {
      await supabase.from("self_evaluations").insert(evaluations);
    }
  }

  return NextResponse.json({ success: true });
}
