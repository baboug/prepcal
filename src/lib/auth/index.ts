import { checkout, polar, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import EmailVerification from "@/modules/emails/ui/templates/email-verification";
import PasswordReset from "@/modules/emails/ui/templates/password-reset";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    polar({
      client: new Polar({
        accessToken: env.POLAR_ACCESS_TOKEN,
        server: env.POLAR_SERVER,
      }),
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: env.POLAR_PRO_PRODUCT_ID,
              slug: "pro",
            },
          ],
          successUrl: "/billing/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onSubscriptionActive: async (payload: unknown) => {
            const p = payload as {
              data?: { customer?: { externalId?: unknown } };
              customer?: { externalId?: unknown };
            };
            const userId = (p.data?.customer?.externalId ?? p.customer?.externalId) as unknown;
            if (typeof userId === "string") {
              const { setPlanBySubscription } = await import("@/modules/payments/server/payments-service");
              await setPlanBySubscription(userId, true);
            }
          },
          onSubscriptionCanceled: async (payload: unknown) => {
            const p = payload as {
              data?: { customer?: { externalId?: unknown } };
              customer?: { externalId?: unknown };
            };
            const userId = (p.data?.customer?.externalId ?? p.customer?.externalId) as unknown;
            if (typeof userId === "string") {
              const { setPlanBySubscription } = await import("@/modules/payments/server/payments-service");
              await setPlanBySubscription(userId, false);
            }
          },
        }),
      ],
    }),
  ],
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
  user: {
    additionalFields: {
      onboardingComplete: {
        type: "boolean",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
