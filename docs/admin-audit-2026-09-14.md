# Admin production audit — 2026-09-14

## Findings

The reported `/admin` screenshot has digest `4289254276`, the same MongoDB authentication error as the public-page incident. After the verified connection update, `/admin` returned HTTP 200 without a streamed Server Component error. The dashboard originally awaited its database connection and four count queries without catching errors, so a future database failure could still break the route before the login interface appeared.

Authenticated HTTP checks passed for all 17 admin routes and 20 data APIs, including Analytics. Login, session verification, and logout succeeded using the existing production credentials. Browser inspection confirmed the production login form rendered. These were read-only CMS checks; saving, deleting, uploading, and submitting production content were not exercised.

Checking runtime logs revealed two additional errors hidden behind HTTP 200 in `/api/analytics/realtime`: `unifiedPagePathScreen` and `firstUserSource` were sent to `runRealtimeReport`, which rejected them with `INVALID_ARGUMENT`.

Google's [Realtime API schema](https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-api-schema) distinguishes Realtime dimensions from Core Reporting dimensions. The two failing dimensions are not supported in Realtime queries.

## Fixes

- Catch dashboard database/count failures and render a visible warning with unavailable statistics shown as “—”, rather than zero. The database status now reflects query success. Existing authentication and data-write handlers are unchanged.
- Fetch page paths and first-user sources with Core `runReport` for `today`. Label those two panels as today's processed data with update latency, keeping the other panels realtime.

## Validation

- `npm run build` passed compilation and TypeScript.
- `node scripts/test-admin-dashboard.cjs` passed with a healthy local database, an unreachable database, and missing configuration. In all cases `/admin` returned 200 without a streamed server exception; the unavailable cases included the warning and unavailable status.
- A direct call of the modified Analytics handler with the production Analytics account returned 200, no logged errors, and actual page-path/source rows.
- Promoted deployment `dpl_ESZez8qtJZtjJSgyazSs7nF1ZoFc` (`https://ptnenglish-g6xvg57g7-nuts-beta-app.vercel.app`) to `https://ptnenglish.edu.vn` after staged dashboard/Analytics requests succeeded and runtime error logs were empty.
- After promotion, repeated login/session/logout, all 17 admin routes, 20 data API checks, and 24 public-page/API regression checks successfully. Runtime error logs for the new deployment were empty in the five-minute window checked. Browser inspection confirmed the production admin login form loaded without the reported exception.

The initial recovery used Vercel CLI. Source changes and regression tests are included in the repository follow-up; production credentials remain outside Git.
