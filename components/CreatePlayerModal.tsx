"use client";

import { useState } from "react";
import { CreatePlayerForm } from "./CreatePlayerForm";

export default function CreatePlayerModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Novo Jogador
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl w-[400px] relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <CreatePlayerForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
