"use client";

import PlayerReveal from "@/components/draftNight/PlayerReveal";
import { useState } from "react";

export default function GalaTestPage() {
  const [show, setShow] = useState(false);

  const player = {
    name: "Neymar Jr",
    position: "ATA",
    overall: 92,
    photo: "https://i.imgur.com/8Km9tLL.png", // pode trocar
    stats: {
      pace: 90,
      shot: 88,
      pass: 85,
      dribble: 95,
      defense: 40,
      physical: 70,
    },
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900">
      {!show && (
        <button
          onClick={() => setShow(true)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-lg"
        >
          Revelar Jogador
        </button>
      )}

      {show && <PlayerReveal player={player} />}
    </div>
  );
}
