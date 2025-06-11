import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";


// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: "https://50882e46e8f7eeb0a0538acca2bbd012@o4509468264366080.ingest.us.sentry.io/4509479572406273",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#tracesSampleRate
  // tracesSampleRate: 1.0,

  // Set profilesSampleRate to 1.0 to profile 100%
  // of sampled transactions.
  // This is relative to tracesSampleRate
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#profilesSampleRate
  profilesSampleRate: 1.0,
});
