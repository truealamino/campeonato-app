import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (!role) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar role={role} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
