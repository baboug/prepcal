import { Section } from "@react-email/components";

import { EmailButton } from "../components/button";
import { EmailFooter } from "../components/footer";
import { EmailHeading } from "../components/heading";
import { EmailText } from "../components/text";
import { EmailWrapper } from "../components/wrapper";

interface EmailVerificationProps {
  username: string;
  link: string;
}

export const EmailVerification = ({ username, link }: EmailVerificationProps) => {
  return (
    <EmailWrapper preview="Verify your email address">
      <EmailHeading>Verify your email address</EmailHeading>
      <EmailText>👋 Hello {username},</EmailText>
      <EmailText>Please click the button below to verify your email address.</EmailText>
      <Section className="mt-[32px] mb-[32px] text-center">
        <EmailButton link={link}>Verify your email address</EmailButton>
      </Section>
      <EmailText>If you didn't request this, you can safely ignore this email.</EmailText>
      <EmailFooter />
    </EmailWrapper>
  );
};

export default EmailVerification;

EmailVerification.PreviewProps = {
  username: "John Doe",
  link: "https://example.com/verify-email",
};
