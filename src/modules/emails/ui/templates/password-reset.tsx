import { Section } from "@react-email/components";

import { EmailButton } from "../components/button";
import { EmailFooter } from "../components/footer";
import { EmailHeading } from "../components/heading";
import { EmailText } from "../components/text";
import { EmailWrapper } from "../components/wrapper";

interface PasswordResetProps {
  username: string;
  link: string;
}

export const PasswordReset = ({ username, link }: PasswordResetProps) => {
  return (
    <EmailWrapper preview="Reset your password">
      <EmailHeading>Reset your password</EmailHeading>
      <EmailText>👋 Hello {username},</EmailText>
      <EmailText>
        We received a request to reset your password. Click the button below to create a new password.
      </EmailText>
      <Section className="mt-[32px] mb-[32px] text-center">
        <EmailButton link={link}>Reset Password</EmailButton>
      </Section>
      <EmailText>If you didn't request this, you can safely ignore this email.</EmailText>
      <EmailFooter />
    </EmailWrapper>
  );
};

export default PasswordReset;

PasswordReset.PreviewProps = {
  username: "John Doe",
  link: "https://example.com/reset-password",
};
