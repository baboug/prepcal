import { Button } from "@react-email/components";

import { cn } from "@/lib/utils";

interface EmailButtonProps {
  children: React.ReactNode;
  link: string;
  className?: string;
}

export const EmailButton = ({ children, link, className = "" }: EmailButtonProps) => {
  return (
    <Button
      className={cn(
        "rounded bg-[#f97316] px-5 py-3 text-center font-medium text-[12px] text-white no-underline",
        className
      )}
      href={link}
    >
      {children}
    </Button>
  );
};
