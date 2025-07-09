import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import EmailVerification from "@/modules/emails/templates/email-verification";
import PasswordReset from "@/modules/emails/templates/password-reset";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: `PrepCal <${env.RESEND_FROM_EMAIL}>`,
          to: user.email,
          subject: "Reset your password",
          react: PasswordReset({ username: user.name || "User", link: url }),
        });
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `PrepCal <${env.RESEND_FROM_EMAIL}>`,
        to: user.email,
        subject: "Verify your email address",
        react: EmailVerification({ username: user.name, link: url }),
      });
    },
  },
});

export type Session = typeof auth.$Infer.Session;
