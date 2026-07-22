import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-4.5 shrink-0" />
        ออกจากระบบ
      </button>
    </form>
  );
}
