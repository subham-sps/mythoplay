---
name: Natkhat Gannu project context
description: Core facts about the MythoPlay / Natkhat Gannu Next.js project — domain, brand, audience, tech stack
type: project
---

Site: https://www.natkhatgannu.com/ (production domain).

Brand naming is split in the codebase — "Natkhat Gannu" is the domain + YouTube channel name, "MythoPlay" appears in titles, logos, and footer copy. Treat **Natkhat Gannu** as the canonical site/brand name (matches domain and YouTube channel `UCFSpc1EsFL3zn5VSQB-Z92g`, handle `@NatkhatGannu-j1y`). MythoPlay is legacy/internal naming.

**Why:** Domain and external channel define the public brand; search queries will hit "Natkhat Gannu".
**How to apply:** Use "Natkhat Gannu" in SEO titles, OG site_name, Organization schema, and canonical references. Leave MythoPlay in existing UI copy unless the user asks to migrate.

Target audience: Indian kids ages 5–14, split into Little Stars (5–7), Rising Champs (8–10), Quiz Masters (11–14). Content is Indian mythology (Ramayana, Mahabharata, Krishna leela, Ganesha stories, festivals), Bhagavad Gita slokas, and mantras.

Stack: Next.js 14 (Pages Router), React 18, TypeScript, Tailwind, framer-motion, zustand, Google OAuth, react-hot-toast. Backend is a separate Express service in `backend/`.

Public routes: `/`, `/leaderboard`, `/login`. Auth-gated: `/quiz`, `/quiz/[id]`, `/profile`. Admin: `/admin/*` (should be noindex).
