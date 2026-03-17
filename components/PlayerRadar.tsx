"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type Evaluation = {
  skill: string;
  label: string;
  value: number;
};

export default function PlayerRadar({ data }: { data: Evaluation[] }) {
  return (
    <div className="w-full h-[300px] sm:h-[340px] md:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#444" />

          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: "#d4d4d8", fontSize: 12 }}
          />

          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

          <Radar
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
