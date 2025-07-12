interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export function EmptyState({ title, description, icon, children }: EmptyStateProps) {
  return (
    <div className="fade-in-50 mx-auto flex min-h-80 animate-in flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">{icon}</div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-xl">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}
