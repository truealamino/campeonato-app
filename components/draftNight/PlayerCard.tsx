"use client";

import Image from "next/image";

type Stats = {
  pace: number;
  shot: number;
  pass: number;
  dribble: number;
  defense: number;
  physical: number;
};

type Props = {
  name: string;
  position: string;
  overall: number;
  photo: string;
  stats: Stats;
};

export default function PlayerCard({
  name,
  position,
  overall,
  photo,
  stats,
}: Props) {
  return (
    <div className="relative w-[260px] h-[380px] md:w-[300px] md:h-[440px] rounded-[28px] overflow-hidden shadow-2xl">
      {/* FUNDO FUT */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-800" />

      {/* TEXTURA */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent)] opacity-60" />

      {/* BORDA */}
      <div className="absolute inset-0 rounded-[28px] border-[3px] border-yellow-200/70" />

      {/* OVERALL */}
      <div className="absolute top-4 left-4 text-4xl md:text-5xl font-extrabold text-black drop-shadow">
        {overall}
      </div>

      {/* POSIÇÃO */}
      <div className="absolute top-14 left-4 text-sm md:text-base font-semibold text-black">
        {position}
      </div>

      {/* FOTO */}
      <div className="absolute top-[80px] w-full flex justify-center">
        <Image
          src={photo}
          alt={name}
          width={180}
          height={180}
          className="object-contain drop-shadow-2xl"
        />
      </div>

      {/* NOME */}
      <div className="absolute bottom-[110px] w-full text-center px-2">
        <p className="text-black font-bold text-lg md:text-xl tracking-wide">
          {name.toUpperCase()}
        </p>
      </div>

      {/* STATS */}
      <div className="absolute bottom-4 w-full px-6 text-black text-sm md:text-base font-semibold">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <Stat label="PAC" value={stats.pace} />
          <Stat label="SHO" value={stats.shot} />
          <Stat label="PAS" value={stats.pass} />
          <Stat label="DRI" value={stats.dribble} />
          <Stat label="DEF" value={stats.defense} />
          <Stat label="PHY" value={stats.physical} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
