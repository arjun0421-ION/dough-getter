# Dough Getter — Cursor Project Brief
> This file is the single source of truth for building the Dough Getter web app.
> Read this fully before writing any code.

---

## What We Are Building

Dough Getter is an AI-powered business companion for home bakers. The Phase 1 web app has four core features:

1. **Landing Page** — explain the product, drive sign ups
2. **Auth** — sign up, login, logout
3. **Sourdough Architect** — a smart sourdough formula calculator (free + paid tiers)
4. **Community** — a feed + forum style space for bakers to post, ask questions and connect

Everything else (inventory, orders, finances, AI co-founder) comes in later phases. Do not build or scaffold anything beyond Phase 1.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SEO friendly, server components, great for auth + payments |
| Styling | Tailwind CSS | Fast, consistent, pairs well with component libraries |
| Auth | Supabase Auth | Handles all auth methods, free tier, pairs with DB |
| Database | Supabase (Postgres) | Single backend for auth + data |
| Payments | Stripe | Subscriptions, webhooks, global support |
| Deployment | Vercel | Native Next.js support, zero config |

---

## Design System

### Colors
```css
--brown:       #3D2314   /* Primary dark — sidebar, headers */
--caramel:     #C8813A   /* Primary accent — buttons, highlights */
--caramel-lt:  #E8A55A   /* Light accent — hover states, tags */
--cream:       #FDF6EC   /* Background */
--sage:        #7A9E7E   /* Success, positive indicators */
--sage-lt:     #D4EAD6   /* Light sage — badges, pills */
--purple:      #9B7EC8   /* Community accent */
--purple-lt:   #EDE6F7   /* Community backgrounds */
--text-dark:   #2A1A0E   /* Primary text */
--text-mid:    #6B4F3A   /* Secondary text */
--text-light:  #A08070   /* Placeholder, captions */
--border:      #E0CFC0   /* Card borders, dividers */
--white:       #FFFFFF
```

### Typography
- **Font:** Inter (sans-serif) for UI, Playfair Display (serif) for headings and logo
- **Logo mark:** "C" in Playfair Display Bold inside a caramel rounded square

### Component Style
- Rounded corners: `rounded-xl` (12px) for cards, `rounded-lg` (8px) for buttons and inputs
- Shadows: `shadow-sm` default, `shadow-md` on hover
- Buttons: caramel background, white text, rounded-lg, font-semibold
- Cards: white background, cream border, soft shadow
- No sharp edges anywhere — this is a warm, friendly product

---

## Site Structure & Routes

```
/                        → Landing page (public)
/login                   → Login page (public)
/signup                  → Sign up page (public)
/app                     → App shell (protected, requires auth)
/app/calculator          → Sourdough Architect
/app/community           → Community feed + forum
/app/community/[postId]  → Individual post / thread
/app/profile             → User profile & subscription status
/app/upgrade             → Pricing & upgrade page
/api/stripe/webhook      → Stripe webhook handler
```

---

## Auth

### Provider: Supabase Auth

### Sign In Methods
- Email + password
- Google OAuth
- Apple Sign In
- Mobile number + OTP

### Flow
1. User lands on `/signup` → fills details → account created in Supabase
2. On login → redirect to `/app/calculator` (first meaningful screen)
3. Protected routes under `/app/*` — redirect to `/login` if no session
4. On logout → redirect to `/` (landing page)

### User Profile Fields (stored in Supabase `profiles` table)
```sql
id            uuid (references auth.users)
full_name     text
username      text (unique)
avatar_url    text
plan          text default 'free'  -- 'free' | 'monthly' | 'yearly'
stripe_customer_id  text
created_at    timestamp
```

---

## Pricing & Subscriptions

### Plans

| Feature | Free | Monthly | Yearly |
|---|---|---|---|
| Sourdough calculator | 3 uses/day | Unlimited | Unlimited |
| Save formulas | No | Yes | Yes |
| Formula history | No | Yes | Yes |
| Multi-flour blends | No | Yes | Yes |
| Community access | Full | Full | Full |
| Community badge | — | Pro | Pro + Early Backer |
| Priority posts | No | Yes | Yes |

### Pricing (suggested)
- Monthly: $6/month
- Yearly: $49/year (~30% saving)

### Stripe Integration
- Use Stripe Checkout for payment
- Store `stripe_customer_id` and `plan` on the user profile in Supabase
- Listen to `customer.subscription.updated` and `customer.subscription.deleted` webhooks to update plan in DB
- On upgrade → update `plan` field in Supabase `profiles` table

### Usage Tracking (Free tier)
- Track daily calculator uses in Supabase table:
```sql
calculator_usage
  id          uuid
  user_id     uuid
  used_at     timestamp
```
- Count uses where `used_at` is today — block at 3 for free users
- Reset automatically at midnight (just query by date)

---

## Feature: Sourdough Architect (Calculator)

### Overview
A step-by-step wizard that reverse-engineers a sourdough formula based on the baker's target outcome.

### Steps (wizard flow)
1. **Number of loaves** — slider, min 1 max 20
2. **Target baked weight per loaf** — input in grams, quick select: 500g / 750g / 850g / 1000g. Auto-calculates dough weight with 15% moisture loss buffer
3. **Room temperature** — slider °C, gives smart advice (hot = cold water + less starter)
4. **Flour selection** — select up to 5 flours across categories: Wheat, Rye, Ancient Wheat, European Bread Flour, Specialty, Flavor Flours. Ratio sliders per flour that must total 100%
5. **Hydration %** — slider 50–90%, shows recommendation based on flour + room temp
6. **Starter %** — slider 5–50%, shows fermentation speed guidance
7. **Salt %** — slider 0–5%, 2% default
8. **Results page** — shows complete formula in grams for every ingredient + estimated bulk rise time

### Free vs Paid Gating
- **Free:** Steps 1–3 fully open. Steps 4–8 available but multi-flour blend locked (only single flour). No save button. Hard limit of 3 uses/day — on 4th attempt show upgrade modal.
- **Paid:** All steps fully unlocked. Save formula with a custom name. View formula history. Multi-flour blending with ratio sliders.

### Save Formula (Paid only)
```sql
saved_formulas
  id              uuid
  user_id         uuid
  name            text
  loaves          int
  target_weight   int
  room_temp       int
  flours          jsonb
  hydration       int
  starter         int
  salt            numeric
  result          jsonb
  created_at      timestamp
```

### Community Integration
After viewing results → show prompt:
> "Happy with this formula? Share it with the community →"
Button takes them to new community post pre-filled with their formula summary.

---

## Feature: Community

### Overview
A warm, cozy space for bakers to ask questions, share bakes, and learn from each other. Mix of feed (visual posts) and forum (threaded Q&A).

### Post Types
1. **Question** — baker asks something, others answer, best answer can be marked
2. **Share** — baker shares a photo or update (a bake, a win, a failure)
3. **Discussion** — open-ended topic thread

### Database Schema
```sql
posts
  id            uuid
  user_id       uuid
  type          text  -- 'question' | 'share' | 'discussion'
  title         text
  body          text
  image_url     text (optional)
  topic         text  -- 'sourdough' | 'pricing' | 'decorating' | 'business' | 'general'
  upvotes       int default 0
  created_at    timestamp

comments
  id            uuid
  post_id       uuid
  user_id       uuid
  body          text
  upvotes       int default 0
  is_answer     boolean default false  -- for questions, mark best answer
  created_at    timestamp

post_upvotes
  user_id       uuid
  post_id       uuid

comment_upvotes
  user_id       uuid
  comment_id    uuid
```

### UI Layout
- **Left sidebar:** Topic filters (All, Sourdough, Pricing, Decorating, Business, General)
- **Main feed:** Posts sorted by latest / most upvoted (toggle)
- **New Post button:** top right, opens modal with type selector
- **Post card:** avatar, name, badge (Pro/Early Backer), post type chip, title, preview text, image thumbnail, upvote count, comment count, time ago
- **Post detail page:** full post, comment thread, mark as answer (for questions)

### Paid Badges
- Monthly plan → **Pro Baker** badge (caramel color)
- Yearly plan → **Early Backer** badge (sage color)
- Badges show on all posts and comments next to username

---

## Feature: Landing Page

### Sections (in order)
1. **Hero** — headline, subheadline, CTA button (Get Started Free), warm illustration or screenshot
2. **Problem** — 3 pain points in icon cards (Too many tools, No time, Undercharging)
3. **Solution** — what Dough Getter does, feature highlights
4. **Sourdough Architect preview** — show the calculator UI as a teaser
5. **Community preview** — show sample posts
6. **Pricing** — free vs monthly vs yearly comparison table
7. **CTA banner** — final push to sign up
8. **Footer** — links, copyright

### Tone
Warm, friendly, approachable. Not corporate. Talks to a person who loves baking but is tired of the business chaos.

---

## Key UX Rules

1. **Never show a blank state** — always show placeholder content or a helpful prompt
2. **Mobile and desktop equal priority** — test every screen at 375px and 1280px
3. **Upgrade prompts must feel helpful, not aggressive** — "Unlock this to save your formula" not "Buy now"
4. **Loading states on every async action** — no janky UI
5. **Errors must be human readable** — "Something went wrong, try again" not raw error codes
6. **Auth redirects must be seamless** — user should never feel lost after login/logout

---

## Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=
NEXT_PUBLIC_APP_URL=
```

---

## What NOT to Build — Ever

These features are permanently out of scope. Do not build, scaffold, reference, or leave comments about them anywhere in the codebase:
- Marketing & social media tools (caption generator, hashtag suggestions, post scheduler — all removed)
- Invoice generator
- Tax summary
- Native mobile app

---

## What NOT to Build in Phase 1

Do not scaffold, stub, or reference any of the following — they come in later phases:
- Inventory management
- Order management (integrations come later)
- AI Co-Founder chat
- Finance tracking (partial — only profit margin calculator, AI pricing suggestions, and income & expense tracker will eventually be built. Nothing else.)
- Baking scheduler
- Push notifications

---

## Sourdough Architect — Existing Codebase

The calculator already exists and is live. Do NOT rebuild the logic from scratch.

**GitHub Repo:** `https://github.com/ShardulG7777/Sourdough-Project`

### Instructions for Cursor
1. Clone the repo and read the existing calculator code fully before touching it
2. Keep all calculation logic exactly as is — do not change any formulas or math
3. Strip out all existing styling and replace with Dough Getter's design system (colors, fonts, components defined above)
4. Restructure into a Next.js component that fits inside `/app/calculator`
5. Add the free vs paid gating layer on top (3 uses/day limit, save formula for paid)
6. The multi-flour blend UI already exists — gate it behind the paid plan only

### If Repo is Private
Make the repo public temporarily, or paste the code directly into Cursor's context window before starting.

---

## Mobile App — Future Consideration

Phase 1 is web only. When mobile comes, the plan is **React Native with Expo**. To prepare:
- Keep all business logic (calculations, API calls, Supabase queries) in separate utility files, not mixed into UI components
- Never use web-only APIs (window, document) inside logic files
- This makes sharing logic between web and mobile seamless when the time comes

---

## How to Start

1. `npx create-next-app@latest dough-getter --typescript --tailwind --app`
2. Install Supabase client: `npm install @supabase/supabase-js @supabase/ssr`
3. Install Stripe: `npm install stripe @stripe/stripe-js`
4. Clone the Sourdough Architect repo separately and study the existing code
5. Set up Supabase project → create tables from schemas above
6. Configure auth providers in Supabase dashboard (Google, Apple, OTP)
7. Build in this order: Design system → Landing page → Auth → Calculator (reskinned) → Community → Payments

