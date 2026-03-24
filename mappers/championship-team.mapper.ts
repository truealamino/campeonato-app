import { ChampionshipTeamWithTeam } from "@/types/championship-team";
import { ChampionshipTeamItem } from "@/types/view-models/championship-team-item";

export function mapChampionshipTeam(
  data: ChampionshipTeamWithTeam,
): ChampionshipTeamItem {
  return {
    id: data.id,
    name: data.team.name,
    logo_url: data.team.logo_url,
  };
}
