import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://a1d8f30d328a2fdd371ed5297bd239d4@o4509468264366080.ingest.us.sentry.io/4509485803044866",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongoIntegration()
],
//   tracesSampleRate: 1.0,
});