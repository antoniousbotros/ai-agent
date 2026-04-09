# Rabeh (رابح) AI SaaS - Engineering Brain

## SYSTEM OVERVIEW

**Architecture:** Monorepo (Next.js Frontend + Fastify Backend)
**Hosting:** Vercel (Edge for Frontend, Serverless Functions for Backend via `/_/backend` mapping in `vercel.json`)
**Database & Auth:** Supabase (PostgreSQL with RLS)
**AI Engine:** Local/Hybrid execution via Ollama (Model: `gemma:2b`)
**i18n:** `next-intl` providing dynamic Server & Client component localization (English/Arabic RTL).

### Multi-Tenant Logic
The system is deeply multi-tenant. External users (SaaS clients) subscribe and receive access to the Dashboard.
1. **Clients** create custom Chatbots configured with specific system prompts.
2. **Clients** generate API Keys.
3. **Clients** embed the vanilla JS static widget (`public/widget.js`) on their own commercial websites (cross-origin).
The widget executes requests to our Fastify gateway passing `data-key` and `data-bot`, ensuring isolated tenant inferencing and tightly mapped billing.

---

## CORE BUSINESS LOGIC (CRITICAL)

### The Inference Pipeline (DO NOT BREAK)
1. **Widget Request:** The cross-origin iframe/script sends a POST to `fastify.post('/api/v1/chat')` with `{ apiKey, botId, message }`.
2. **Auth Layer:** `backend/services/db.js -> validateApiKey(apiKey)` strictly verifies that the API key exists, is active, and extracts the `user_id`. Failure here immediately returns `401 Unauthorized`.
3. **Bot Context:** `getBotConfig(botId, userId)` executes. It enforces RLS programmatically by proving the requested `bot_id` belongs exclusively to the `user_id` parsed from the API Key. 
4. **AI Generation:** `generateGemmaResponse` communicates with the Ollama instance via HTTP. 
5. **Billing Trigger:** The asynchronous `logUsage` is dispatched, calculating tokens and mutating the unified `usage` ledger.

### Database Strictness
- `public.users` utilizes an enforced foreign key on `auth.users(id)`. Direct inserts to `public.users` will crash without a primary Auth identity.
- Data immutability on `api_keys` and `usage` prevents historical distortion of billing logic.

---

## UI SYSTEM

**Design Philosophy:** Strict Stripe / Linear Minimalism.
- **Backgrounds:** `bg-[#fafafa]` for light mode, `bg-[#0a0a0a]` for dark mode.
- **Cards:** Pure `bg-white`, `rounded-[16px]`, utilizing a micro-shadow `shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]`.
- **Borders:** Ultra-thin separation using `border border-slate-200/60` (or `white/10` dark).
- **Colors:** Minimalist monochromatic scales (`slate-400` to `slate-900`). Single primary action color (Sharp Blue). ZERO intense gradients or blurred backdrops.
- **Typography:** LTR utilizes `Poppins` and RTL utilizes `Cairo`. Font mapping must be handled strictly through standard Next.js Class interpolation. Margins and Paddings MUST utilize `ltr:` and `rtl:` variants (e.g., `ltr:ml-auto rtl:mr-auto`) for flawless native physical-to-logical translation.
- **Component Reusability:** Always use the pure components located in `src/components/dashboard/ui-components.tsx`. Avoid inline ad-hoc DOM structures.

---

## SECURITY RULES (MANDATORY)

1. **Row Level Security (RLS)**: Must be maintained in Supabase. Never expose raw database endpoints to the frontend. All fastify db queries execute using a secured `SUPABASE_ANON_KEY` bound to isolated environment variables.
2. **CORS:** The Fastify server integrates `@fastify/cors`. Currently open (`'*'`) strictly for the `widget.js` embed, but API token extraction and rotation must remain rigorous.
3. **Frontend Secrets:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the `src/` Next.js directory. Only expose `NEXT_PUBLIC_` variables.

---

## KNOWN ISSUES & TRAPS

1. **Vercel Build Traps:** Vercel expects exactly one Next.js application at the root. Fastify files must not bleed into NextJS App Router syntax. `vercel.json` rewrites are delicate. Do not alter `routePrefix: "/_/backend"` without immense caution.
2. **Schema Mismatches:** Historically, `bot_id` queries failed due to naming (`prompt` vs `system_prompt`). Always `SELECT *` verify column names in Supabase before writing JS queries.
3. **Foreign Key Auth Errors:** Do not write scripts that bypass `auth.users` when making Mock users.

---

## CURRENT TASK

_(Empty template for AI execution)_

---

## DECISIONS LOG
- **[2026-04-09]** Transitioned UI away from Ecommerce Ecarto clone to strict Stripe Minimalist UI.
- **[2026-04-09]** Implemented RTL / LTR `next-intl` dual localization using Cairo/Poppins font.
- **[2026-04-09]** Decoupled AI model parameterization from backend; AI is now inherently customizable dynamically via the `bots` table.

---

## CHANGE LOG
- **[2026-04-09]** Deployed Monorepo architecture mapping backend to Vercel effectively.
- **[2026-04-09]** Solved Foreign Key constraints for test mock data insertion.
