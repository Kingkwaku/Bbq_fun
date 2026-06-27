# 🏆 AfriCup Backyard Challenge

A gorgeous, mobile-first **Ghana × Nigeria backyard BBQ soccer-party leaderboard**. Guests register themselves, play six backyard mini-games, and watch the standings update live — complete with a top-3 podium, the legendary **Jollof Derby**, confetti, and a screenshot-ready share card.

Deploy it today: works instantly with zero config, and auto-upgrades to live multi-phone sync the moment you add a free Supabase project.

---

## ✨ Features

- **Self-registration** — guests add themselves on the homepage (name + family: Ghana 🇬🇭, Nigeria 🇳🇬, or neutral ⚽).
- **Live leaderboard** — ranked totals with progress bars and fun labels (Current Champion, Rising Star, Needs Jollof Energy).
- **Top-3 podium** — crown & medal styling for the leaders.
- **Admin scoring** at `/admin` — passcode `ghana9ja`. Score any of the games for any player.
- **6 backyard mini-games** — scorable in any order, any time: Cup Pyramid Kickdown, Top-Corner Cup Shot, Cone-Top Sniper, Bucket Toss, Tiny-Goal Shot, Cup Bowling.
- **Jollof Derby 🔥** — fires automatically when the top Ghana and top Nigeria players are neck-and-neck.
- **Confetti** — celebratory moments for new leaders.
- **Share screen** at `/share` — a poster-style card built to be screenshot and dropped in the group chat, with native share / copy-link.

---

## 🚀 Quick start

```bash
npm install
npm run dev
```

That's it. The app runs immediately in **single-device localStorage mode** — no accounts, no backend, no config. Perfect for running the whole party off one phone or laptop. Data lives in that browser.

---

## 🛠 Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) primitives
- [lucide-react](https://lucide.dev/) icons
- [framer-motion](https://www.framer.com/motion/) animations
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) celebrations
- [Supabase](https://supabase.com/) (optional) for live multi-device sync + realtime
- [sonner](https://sonner.emilkowal.ski/) toasts

---

## 📡 Enable live multi-phone sync (free, ~5 min)

Want every guest's phone to show the same live board? Add a free Supabase backend. The app **auto-detects** it on startup — no code changes.

1. **Create a free Supabase project** at [supabase.com](https://supabase.com).
2. **Run the schema.** Open the project's **SQL editor**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the `players` and `game_state` tables, opens realtime, and sets party-friendly policies.
3. **Add your keys.** Copy `.env.example` to `.env` and fill in the two values from **Project Settings → API**:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. **Restart the dev server** (`npm run dev`).

Without these vars, the app stays in single-device localStorage mode. The moment both are present, it **upgrades to live sync** automatically and every phone stays in step in realtime.

---

## 🔒 Security note

This app is built for a **low-stakes family BBQ**, and its security model reflects that:

- The admin passcode (`ghana9ja`) is a **lightweight client-side UX gate**, not real authentication. It keeps casual guests out of the scoring screen — it does not protect data.
- The Supabase Row Level Security policies in `schema.sql` are **intentionally open** (the public anon key can read and write). Anyone with the URL could, in theory, write to the board.

For a backyard party with no sensitive data, this is a perfectly reasonable trade-off — and it keeps setup to ~5 minutes. **To lock it down later**, you can: require Supabase Auth and scope policies to authenticated users, route all writes through a Supabase Edge Function with a server-side secret, and move scoring behind a real login.

---

## 📦 Deploy

It's a static site — build and drop the `dist/` folder on any static host.

```bash
npm run build      # outputs to dist/
```

Deploy `dist/` to **Vercel**, **Netlify**, or **GitHub Pages**.

- For **live sync**, set the two env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in your host's environment settings, then rebuild/redeploy.
- The admin screen lives at `/admin` and the share card at `/share`.

> Tip: this is a client-side SPA. On Netlify/Vercel, add an SPA redirect/rewrite (`/* → /index.html`) so deep links like `/share` resolve correctly.

---

## 🗺 Routes

| Route     | What it is                                                              |
| --------- | ---------------------------------------------------------------------- |
| `/`       | Homepage — self-registration + live leaderboard with top-3 podium.    |
| `/admin`  | Admin scoring screen (passcode `ghana9ja`).                            |
| `/share`  | Shareable poster card — built to be screenshot and shared.            |

---

Made with jollof energy 🔥 🇬🇭 ⚽ 🇳🇬
