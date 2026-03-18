import { getPlayers } from "@/services/players.service";
import { Player } from "@/types/player";
import { useEffect, useState } from "react";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  return players;
}
