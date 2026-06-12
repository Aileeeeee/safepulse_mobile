/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(main)` | `/(main)/contacts` | `/(main)/home` | `/(main)/settings` | `/_sitemap` | `/about` | `/calculator` | `/contacts` | `/disguise-budget` | `/disguise-meditation` | `/disguise-note` | `/disguise-weather` | `/home` | `/onboarding/step0` | `/onboarding/step1` | `/onboarding/step2` | `/onboarding/step3` | `/ready` | `/report` | `/report-sent` | `/settings` | `/signal-received` | `/signal-sent` | `/splash2`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
