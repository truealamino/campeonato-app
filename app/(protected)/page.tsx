import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
import { calculateStandings } from "@/lib/standings";

export default async function Dashboard() {
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("stage", "GROUP");

  const standings = calculateStandings(matches || []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Classificação</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-zinc-800">
            <th>Time</th>
            <th>Pts</th>
            <th>J</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>GM</th>
            <th>GS</th>
            <th>SG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.team} className="border-b border-zinc-700">
              <td>{team.team}</td>
              <td>{team.points}</td>
              <td>{team.wins + team.draws + team.losses}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
              <td>{team.goalsFor}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalDiff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
