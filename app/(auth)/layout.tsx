export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950">
      {children}
    </div>
  );
}
