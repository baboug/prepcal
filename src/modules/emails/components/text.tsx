import { Text } from "@react-email/components";

import { cn } from "@/lib/utils";

export const EmailText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <Text className={cn("text-[#312e81] text-[14px] leading-[24px]", className)}>{children}</Text>;
};
