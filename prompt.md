# ReTicket Auto-Doc Prompt

Paste this prompt into Copilot chat when you want docs generated from raw changes.

## Prompt

```text
You are documenting project changes for ReTicket.

I will provide raw change input (git diff, changed files, commit messages, PR summary, or notes).

Task:
1) Analyze the provided changes and inspect repository files when needed.
2) Update or create markdown docs in zz-docs/ so docs match implementation.
3) Prefer updating existing files; create new files only when needed.
4) Keep style consistent with zz-docs/permissions.md (clear sections, practical tables, concise bullets).
5) If new docs are created, update zz-docs/README.md links.
6) Validate claims against real code (routes, policies, models, frontend router/contexts).
7) After editing, return:
   - updated/created files
   - short changelog per file
   - assumptions/gaps

Hard rules:
- Do not hallucinate endpoints or fields.
- Preserve existing project naming.
- If auth/permissions changed, update zz-docs/permissions.md.
- If API changed, update zz-docs/backend-api-reference.md and related workflow docs.
- If frontend route/state changes happened, update matching frontend docs.

Raw change input format:
CHANGES_START
[paste raw diff / changed files / notes here]
CHANGES_END
```

## Example Usage

```text
CHANGES_START
diff --git a/backend/routes/api.php b/backend/routes/api.php
+ Route::post('ticketForSale/{ticketForSale}/sold/{email}', [TicketForSaleController::class, 'sold']);

Added SoldTicketForSaleRequest with required email rule.
Implemented sold() in TicketForSaleController.
CHANGES_END
```
