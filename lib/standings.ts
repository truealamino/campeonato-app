export function calculateStandings(
  matches: {
    home_team_id: string;
    away_team_id: string;
    home_score: number;
    away_score: number;
    status: string;
  }[],
) {
  const table: Record<
    string,
    {
      points: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
    }
  > = {};

  matches.forEach((match) => {
    if (match.status !== "FINISHED") return;

    const { home_team_id, away_team_id, home_score, away_score } = match;

    // inicializar
    [home_team_id, away_team_id].forEach((team: string) => {
      if (!table[team]) {
        table[team] = {
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        };
      }
    });

    table[home_team_id].goalsFor += home_score;
    table[home_team_id].goalsAgainst += away_score;

    table[away_team_id].goalsFor += away_score;
    table[away_team_id].goalsAgainst += home_score;

    if (home_score > away_score) {
      table[home_team_id].points += 3;
      table[home_team_id].wins++;
      table[away_team_id].losses++;
    } else if (home_score < away_score) {
      table[away_team_id].points += 3;
      table[away_team_id].wins++;
      table[home_team_id].losses++;
    } else {
      table[home_team_id].points += 1;
      table[away_team_id].points += 1;
      table[home_team_id].draws++;
      table[away_team_id].draws++;
    }
  });

  return Object.entries(table)
    .map(([team, stats]) => ({
      team,
      ...stats,
      goalDiff: stats.goalsFor - stats.goalsAgainst,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor,
    );
}
