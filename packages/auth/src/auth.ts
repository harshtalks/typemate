import { createServerOnlyFn } from "@tanstack/react-start";
import db from "@typemate/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { magicLink, organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Resend } from "resend";
import { envs } from "../env";

const resend = new Resend(envs.SERVER_RESEND_API_KEY);

export const getAuthConfig = createServerOnlyFn(() =>
  betterAuth({
    secret: envs.SERVER_BETTER_AUTH_SECRET,
    baseURL: envs.SERVER_BETTER_AUTH_BASE_URL,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    telemetry: {
      debug: true,
      enabled: true,
    },
    plugins: [
      magicLink({
        sendMagicLink: async ({ url, email }) => {
          const response = await resend.emails.send({
            to: email,
            subject: "Sign in to your account",
            html: `<h1>Sign in to your account</h1><p>Click the link below to sign in to your account:</p><p><a href="${url}">${url}</a></p>`,
            text: `Sign in to your account\n\nClick the link below to sign in to your account:\n\n${url}`,
            from: "Acme <onboarding@resend.dev>",
          });

          if (response.error) {
            throw new Error(response.error.message);
          }
        },
      }),
      organization(),
      tanstackStartCookies(),
    ],
    session: {
      cookieCache: {
        enabled: false,
      },
    },
    socialProviders: {
      github: {
        clientId: envs.SERVER_GITHUB_CLIENT_ID,
        clientSecret: envs.SERVER_GITHUB_CLIENT_SECRET,
      },
    },
    onAPIError: {
      throw: true,
    },
    advanced: {
      database: {
        generateId: false,
      },
      cookiePrefix: "typemate",
    },
  })
);

export const auth = getAuthConfig();
