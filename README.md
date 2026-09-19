# Vendor Tracker

Vendor Tracker replaces a spreadsheet workflow for moving vendors through Contract Sent, Contract Signed, KYC Docs Received, KYC Verified, and Active.

## Approach

The spreadsheet process makes it easy for updates to become inconsistent, difficult to audit, and difficult to spot when a vendor is stalled. In particular, coordinators can overwrite the current status without a reliable change history, manually maintained dates do not clearly represent time in the current stage, and searching/sorting a growing list is cumbersome.

The application uses a small Next.js single-page dashboard. Coordinators use a mocked login, view searchable and sortable vendors, update only a vendor’s stage, and inspect per-vendor stage history. Vendors that have remained in a stage for more than seven days are highlighted automatically.

## Technical decisions

- Next.js App Router, React, TypeScript, and the existing shadcn-style UI components.
- Stage definitions and vendor/history types are centralized in `src/lib/vendors`.
- UI components, business rules, and API/data access are separated into focused modules.
- JSON files provide simple local persistence through typed API routes: `src/data/vendors.json` and `src/data/history.json`.
- Vitest covers business rules and API integration behavior; Playwright covers the main vendor workflow.

## Assumptions and trade-offs

Authentication is intentionally mocked: any non-empty username and password are accepted, and the username is stored in session storage. JSON file persistence is suitable for this assignment and local development, but is not safe for concurrent users or read-only/serverless production environments. The stage workflow is fixed, vendor creation/deletion is out of scope, and only stage changes are audited.

Given the time limit, the app does not include a database, production authentication, role permissions, optimistic updates, real-time synchronization, or notifications. Error and loading states are handled in the dashboard, but the data layer remains intentionally small.

## Improvement

I would move persistence to a database with transactional updates, add real authentication and authorization, validate API payloads with a schema library, add richer filtering and bulk operations, and improve observability and accessibility coverage. I would also add broader browser coverage for pagination, failures, and concurrent updates.

## Development

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
```
