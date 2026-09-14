# Production CMS incident — 2026-09-14

## Confirmed root cause

The production deployment `dpl_2fM5nSxbbczuWVdBWTg4ov1MtPja` was built from commit `9616b3d`, matching the checked-out source. Live HTTP requests to `/about-us`, `/courses`, and `/student-corner` returned 500. Vercel runtime logs for each request recorded:

```text
MongoServerError: bad auth : authentication failed
code: 8000
codeName: AtlasError
digest: 4289254276
```

The digest exactly matches the reported screenshot. The production MongoDB credentials also failed an independent, read-only connection check. This was an authentication failure, not a missing CMS document: after verifying the replacement credentials, all five relevant page records (including the two course languages and home) and SiteSettings were present in the existing `ptn_english` database.

The three affected Server Components awaited `dbConnect()` and CMS queries without error handling. Their shared root layout and metadata code also serve healthy routes. Page metadata is static on the three routes; there is no route-specific `generateMetadata` database query. Home and Blog encountered the same authentication error but caught it and rendered fallback content, explaining their HTTP 200 responses. Some database-backed APIs were also failing despite those pages appearing functional.

## Changes

- Updated the existing Vercel `MONGODB_URI` with the verified credentials, preserving the cluster and database name. Vercel stores this as one variable shared by Production, Preview, and Development; the CLI updated the shared record. No production database records were modified.
- Added a scoped CMS loader for the three public pages. It handles connection/query/serialization failures, logs an error name and code, and lets the existing content defaults render.
- Kept Student Corner page content and optional SiteSettings failures independent.
- Moved the missing-URI check inside `dbConnect()` so callers can catch it instead of failing during module import.
- Guarded null and malformed CMS section containers, teacher/difference collections, student notes, and course fallback values.
- Preserved the requested course language when the API falls back, and cancelled superseded client fetches.
- Excluded local environment files and local tooling/database files from Vercel uploads.

The global layout, metadata, database schema, admin writes, upload handlers, mock-test submission logic, and other page implementations were not edited.

## Validation

- `npm run build` passed locally; the final Vercel production build also passed compilation and TypeScript.
- `node scripts/test-public-cms.cjs` passed 36 page checks: all three routes in both languages with missing CMS documents, valid CMS data, null nested values, malformed containers, unavailable MongoDB, and missing configuration. Two additional API checks verified distinct Vietnamese/English course fallbacks. The test owns and removes an isolated local database.
- ESLint passed for the new loader and the three Server Component route files. The repository still contains pre-existing lint findings in other code; this is not a claim of a repository-wide clean lint run.
- Before promotion, authenticated Vercel requests verified the three pages and four relevant CMS/settings APIs returned 200 with real content.
- After promotion, `https://ptnenglish.edu.vn` passed 24 live HTTP checks: six checks for the three affected routes in both languages, seven control pages (`/`, `/blog`, `/contact`, `/events`, `/teachers`, `/journey`, `/test`), and eleven CMS/content APIs.
- Browser inspection verified About Us, Courses, and Student Corner rendered on the production domain. The Courses language control successfully switched to Vietnamese. Student Corner's LMS and mock-test links were present. Browser console inspection returned no errors at that point.
- Vercel runtime error logs for the new deployment contained zero error requests and zero authentication failures in the 15-minute window checked after rollout.

## Deployment

Active production deployment: `dpl_EnMw2c7kEfYfGnE1yny6scEtAJ35`.

Deployment URL: https://ptnenglish-fql54gww3-nuts-beta-app.vercel.app

Production domain: https://ptnenglish.edu.vn

The initial recovery was deployed with Vercel CLI and promoted after checks. Source changes and regression tests are included in the repository follow-up; environment credentials and local audit outputs are excluded from Git and deployment uploads.
