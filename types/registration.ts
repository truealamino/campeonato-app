import { Championship } from "./championship";
import { Player } from "./player";

export interface Registration {
  id: string;
  championship_id: string | null;
  player_id: string | null;
  final_overall: number | null;
  created_at: string;
  legal_authorization_link: string | null;
  profile_photo_link: string | null;
}

export interface RegistrationWithPlayer extends Registration {
  player: Player;
}

export interface RegistrationWithChampionship extends Registration {
  championships?: Championship;
}

export interface RegistrationFull extends Registration {
  players?: Player;
  championships?: Championship;
}
