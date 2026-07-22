export function UserChip({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
        {initials}
      </div>
      <div className="text-sm">
        <p className="font-medium leading-tight">{name}</p>
        <p className="leading-tight text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
