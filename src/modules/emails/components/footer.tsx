import { Hr, Link } from "@react-email/components";

import { EmailText } from "./text";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const EmailFooter = () => {
  return (
    <>
      <Hr className="mx-0 my-[26px] w-full border border-[#e7e5e4] border-solid" />
      <EmailText className="text-[#78716c] text-[12px]">
        <Link className="text-[#78716c] underline" href={baseUrl} rel="noopener noreferrer" target="_blank">
          PrepCal
        </Link>{" "}
        - Automated meal planning for lifters
      </EmailText>
    </>
  );
};
