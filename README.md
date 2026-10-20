# Project Submission API — layered modules

Express 5 + TypeScript + Prisma 7 + PostgreSQL.

## Module structure

Each feature separates routing, HTTP/controller logic, business logic, types, and validation:
- `src/modules/auth/`: `auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.interface.ts`, `auth.validation.ts`
- `src/modules/user/`: `user.routes.ts`, `user.controller.ts`, `user.service.ts`, `user.interface.ts`
- `src/modules/project/`: `project.routes.ts`, `project.controller.ts`, `project.service.ts`, `project.interface.ts`, `project.validation.ts`
- `src/modules/review/`: `review.routes.ts`, `review.controller.ts`, `review.service.ts`, `review.interface.ts`, `review.validation.ts`

## Setup
1. Copy `.env.example` to `.env` and set PostgreSQL URL, JWT secret (32+ characters), and mentor credentials.
2. `bun install`
3. `bun run db:generate`
4. `bun run db:migrate --name init`
5. `bun run db:seed`
6. `bun run dev`

## Routes
- `POST /api/auth/signup` student signup
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/projects` student submission (5 attempts / 15 minutes)
- `GET /api/projects/mine` student project
- `GET /api/users/me/project` current student's project alias
- `GET /api/review/stats` mentor statistics
- `GET /api/review/projects?page=1&limit=10&status=PENDING&search=...`
- `PATCH /api/review/projects/:id/review` body `{ "status": "APPROVED" | "REJECTED", "reviewNote": "optional" }`

Protected routes use `Authorization: Bearer <token>`. Signup always assigns STUDENT; mentor is seeded from environment variables.
