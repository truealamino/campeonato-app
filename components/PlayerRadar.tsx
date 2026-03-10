"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

type Evaluation = {
  skill: string;
  value: number;
};

export default function PlayerRadar({ data }: { data: Evaluation[] }) {
  return (
    <RadarChart
      width={420}
      height={360}
      cx="50%"
      cy="50%"
      outerRadius="70%"
      data={data}
    >
      <PolarGrid stroke="#444" />
      <PolarAngleAxis dataKey="skill" />
      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
      <Radar
        dataKey="value"
        stroke="#3b82f6"
        fill="#3b82f6"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}
