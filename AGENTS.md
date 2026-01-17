# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router entry points (see `app/layout.tsx`, `app/page.tsx`) and global styles in `app/globals.css`.
- `components/`: app-specific React components (feature-level UI like `home-page.tsx`).
- `components/ui/`: shared shadcn/ui primitives (building blocks such as buttons, dialogs, form controls).
- `hooks/`: reusable React hooks (e.g., `use-toast.ts`).
- `lib/`: shared utilities (e.g., `lib/utils.ts`).
- `public/`: static assets served as-is.
- `styles/`: additional/legacy global CSS (prefer `app/globals.css` unless there’s a reason to keep styles separate).

## Build, Test, and Development Commands

This repo uses `pnpm` (see `pnpm-lock.yaml`).

- `pnpm install`: install dependencies.
- `pnpm dev`: run the local dev server.
- `pnpm build`: create a production build.
- `pnpm start`: run the production build locally.
- `pnpm lint`: run ESLint across the repo.
- `pnpm exec tsc -p tsconfig.json --noEmit`: run a strict TypeScript typecheck (recommended before PRs).

Note: `next.config.mjs` currently allows builds to succeed even with TypeScript errors; treat `tsc --noEmit` as the source of truth.

## Coding Style & Naming Conventions

- Language: TypeScript + React (Next.js). Use `"use client"` only where state/effects are required.
- Formatting: follow existing patterns (2-space indentation, double quotes, no semicolons).
- Naming:
  - Components: `PascalCase` exports; files in `components/` are `kebab-case.tsx`.
  - Hooks: `hooks/use-*.ts`.
- Imports: prefer the `@/*` path alias (e.g., `@/components/...`, `@/lib/utils`).

## Testing Guidelines

No test runner is configured yet (there is no `test` script). If you add non-trivial logic, include a test setup in the same PR and follow a consistent convention such as `*.test.ts(x)` (either co-located or under `__tests__/`).

## Commit & Pull Request Guidelines

- Git history is not present in this checkout (no `.git/`), so no local convention can be inferred. Preferred commit style: Conventional Commits (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
- PRs should include: a clear description, linked issue (if applicable), screenshots for UI changes, and confirmation you ran `pnpm lint` and `pnpm exec tsc -p tsconfig.json --noEmit` (and `pnpm build` when relevant).

## 本项目请始终用中文和用户交流。

