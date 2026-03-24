"use client";

import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";

type Props = {
  player: {
    name: string;
    position: string;
    overall: number;
    photo: string;
    stats: {
      pace: number;
      shot: number;
      pass: number;
      dribble: number;
      defense: number;
      physical: number;
    };
  };
};

export default function PlayerReveal({ player }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* GLOW BACKGROUND */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-400 blur-[150px] opacity-40 animate-pulse" />

      {/* CARD */}
      <div
        className={`
          transition-all duration-700 ease-out
          ${show ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}
      >
        <PlayerCard {...player} />
      </div>

      {/* NOME ANIMADO */}
      <div
        className={`
          absolute bottom-10 text-white text-3xl md:text-5xl font-bold tracking-widest
          transition-all duration-700 delay-300
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {player.name.toUpperCase()}
      </div>
    </div>
  );
}
