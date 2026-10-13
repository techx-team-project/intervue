---
description: Create a correctly named Flyway migration
argument-hint: <description in snake_case words>
---
Create a Flyway migration for: `$ARGUMENTS`.

1. List `backend/src/main/resources/db/migration/` and read the latest files to match style.
2. Name it `V<yyyyMMdd><NNN>__<snake_case>.sql`: today's date, `NNN` = next sequence for that date (001 if none). Never edit or renumber an existing migration (a hook blocks this).
3. MySQL 8.4, `utf8mb4`. Plural snake_case tables; `id` PK; `created_at`/`updated_at` (and `deleted_at` if soft-deletable); explicit FK names; indexes on every FK and filter/sort column.
4. Destructive changes (drop/rename column, type change) need a safe multi-step plan. Ask the user first.
5. Update the matching entity; run `./mvnw test` (or start the app) to verify the migration applies.
