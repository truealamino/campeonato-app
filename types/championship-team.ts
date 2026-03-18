import { Team } from "./team";

export interface ChampionshipTeam {
  id: string;
  championship_id: string;
  team_id: string;
  created_at: string;
}

export interface ChampionshipTeamWithTeam extends ChampionshipTeam {
  team: Team;
}
