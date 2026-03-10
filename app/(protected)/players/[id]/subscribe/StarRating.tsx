"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

export default function StarRating({ value, onChange, max = 5 }: Props) {
  return (
    <div className="flex gap-1 cursor-pointer">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;

        return (
          <span
            key={i}
            onClick={() => onChange(starValue)}
            className={`text-2xl transition ${
              starValue <= value ? "text-yellow-400" : "text-zinc-600"
            } hover:scale-110`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
