import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { UserChip } from "@/components/layout/UserChip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex flex-1">
      <Sidebar isAdmin={session?.user?.role === "ADMIN"} signOutSlot={<SignOutButton />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-border px-6 py-3">
          {session?.user && <UserChip name={session.user.name ?? ""} role={session.user.role} />}
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
