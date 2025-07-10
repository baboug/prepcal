import { Heading } from "@react-email/components";

import { cn } from "@/lib/utils";

export const EmailHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <Heading className={cn("mx-0 my-[30px] p-0 text-center font-medium text-[#7c3aed] text-[24px]", className)}>
      {children}
    </Heading>
  );
};
