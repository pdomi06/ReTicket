---
agent: agent
description: "Generate or update project documentation from raw code changes, git diff, or PR notes. Use when documenting feature changes in zz-docs."
---

# Auto-Generate Docs From Changes

You are documenting project changes for ReTicket.

## Input

I will provide one or more of the following:

- raw git diff
- changed file list
- commit messages
- PR summary
- freeform notes

Treat all provided text as the source of truth. If context is missing, inspect the repository and infer only from real code.

## Goal

Generate or update markdown documentation chunks in `zz-docs/` so docs stay aligned with the implementation.

## Required Workflow

1. Identify exactly what changed and affected domains (backend, frontend, setup/deployment, permissions/workflows).
2. Map changes to existing docs in `zz-docs/`.
3. Update existing files when possible; create new chunks only when existing files cannot reasonably contain the topic.
4. Keep writing style consistent with `zz-docs/permissions.md`:
   - clear headings
   - practical tables when useful
   - concise bullets
   - explicit constraints/ownership rules
5. Add cross-links in `zz-docs/README.md` when new docs are created.
6. Validate doc claims against code paths and route/policy/model names.

## Output Requirements

- Apply real file edits in workspace (do not only propose text).
- After edits, provide:
  - list of updated/created doc files
  - concise changelog by file
  - any assumptions or unresolved ambiguities

## Content Rules

- No hallucinated endpoints, models, or environment variables.
- Preserve existing terminology (`eventId`, `fromUserId`, `buyerEmail`, etc.) where relevant.
- If authorization behavior changed, update `zz-docs/permissions.md`.
- If route/API behavior changed, update `zz-docs/backend-api-reference.md` and related workflow docs.
- If frontend routes/state integrations changed, update matching frontend docs.
- Keep docs implementation-focused and maintainable.

## Optional Input Block

Use this exact block when I paste raw changes:

```text
CHANGES_START
[paste raw diff / changed files / notes here]
CHANGES_END
```

When this block is present, prioritize it over any previous context.
