import { Championship } from "./championship";
import { Player } from "./player";

export interface Registration {
  id: string;
  final_overall?: number;
  players?: Player;
  championships?: Championship;
}
