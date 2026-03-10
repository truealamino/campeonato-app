"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Sidebar({ role }: { role: string | null }) {
  const router = useRouter();
  const supabase = createClient();
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  const pathname = usePathname();

  type LinkItem = {
    href: string;
    label: string;
    roles?: string[];
  };

  const allLinks: LinkItem[] = [
    { href: "/", label: "Dashboard" },
    {
      href: "/championships",
      label: "Campeonatos",
      roles: ["admin", "viewer", "evaluator"],
    },
    { href: "/statistics", label: "Estatísticas" },
    { href: "/teams", label: "Times", roles: ["admin"] },
    { href: "/players", label: "Jogadores", roles: ["admin"] },
    { href: "/games", label: "Jogos", roles: ["admin"] },
    { href: "/playoff", label: "Mata-Mata", roles: ["admin"] },
  ];

  const links = allLinks.filter(
    (link) => !link.roles || link.roles.includes(role ?? ""),
  );

  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">🏆 Campeonato</h1>
        <p className="text-sm text-zinc-400">Gerenciamento Profissional</p>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-zinc-800 space-y-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-500 transition py-2 rounded-lg text-sm font-medium"
        >
          Sair
        </button>

        <div className="text-xs text-zinc-500 text-center">
          v1.0 • Campeonato App
        </div>
      </div>
    </aside>
  );
}
