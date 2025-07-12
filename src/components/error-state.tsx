import { AlertCircleIcon } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="fade-in-50 mx-auto flex min-h-80 animate-in flex-col items-center justify-center rounded-lg border border-destructive/20 border-dashed p-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircleIcon className="size-8 text-destructive" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-destructive text-xl">{title}</h2>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
