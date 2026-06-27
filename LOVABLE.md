# Bringing AfriCup Backyard Challenge into Lovable (with this exact code)

Lovable **cannot import an existing GitHub repo directly.** When you connect a Lovable
project to GitHub, Lovable **creates its own new repo** as the "source of truth" and keeps a
two-way sync on one branch (default `main`). Anything you push to that branch syncs back into
Lovable.

Good news: this app is built on the **exact stack Lovable uses** (Vite + React + TypeScript +
Tailwind + shadcn/ui + lucide-react), so once the code lands in Lovable's repo it runs
natively and you can keep editing it by chat and Publish from Lovable.

Here's the 5-minute flow.

---

## Step 1 — Create a blank Lovable project
1. Go to [lovable.dev](https://lovable.dev) and sign in.
2. Click **Build something** and enter any throwaway prompt (e.g. "a simple landing page").
   It doesn't matter — we're going to replace this code with ours.

## Step 2 — Connect the project to GitHub (Lovable creates a repo)
1. **Workspace Settings → Git → GitHub** → install & authorize the **Lovable GitHub app**
   on your GitHub account/org.
2. **Project Settings → Git → GitHub** → **Connect**. Lovable creates a **new repository**.
3. Copy that **new repo's git URL** and note the **active branch** (usually `main`).

> ⚠️ Don't rename, move, or delete the Lovable repo after connecting — it breaks the sync.

## Step 3 — Push our exact code into the Lovable repo
You have two ways. Pick one.

### Option A — One command (terminal)
Requires `git` and `tar` (built in on macOS/Linux; on Windows use **WSL** or **Git-Bash**).

```bash
# clone this repo if you don't have it locally
git clone https://github.com/Kingkwaku/Bbq_fun.git
cd Bbq_fun

# push our code into the repo Lovable created (use YOUR new repo URL)
./scripts/sync-to-lovable.sh https://github.com/Kingkwaku/<your-lovable-repo>.git
```

The script clones the Lovable repo, replaces its files with our code (keeping the Lovable
repo's `.git` so the sync keeps working), commits, and pushes. It asks for confirmation
before pushing.

### Option B — No terminal (GitHub Desktop)
1. In **GitHub Desktop**, clone the **new Lovable repo**.
2. In Finder/Explorer, delete everything in that folder **except the `.git` folder**.
3. Copy in all files from this project **except** `.git`, `node_modules`, and `dist`.
4. Back in GitHub Desktop: commit ("Import AfriCup code") and **Push**.

Either way, Lovable pulls the pushed branch and rebuilds its preview within ~a minute.

## Step 4 — Verify in Lovable
Open the Lovable preview and check:
- `/` — hero, live leaderboard, podium, today's mini-games
- `/admin` — passcode **`ghana9ja`** (admin "Derrick")
- `/share` — screenshot-ready board

## Step 5 — Turn on live multi-phone sync (optional but recommended)
Out of the box the board is **per-device** (localStorage). To make every guest's phone share
one live leaderboard, add Supabase:
1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
3. Add these to **Lovable's project environment variables** (or use Lovable's native Supabase
   integration):
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
4. Rebuild. The header pill flips from **"This device"** to **"Live"**.

The app auto-detects these — no code change needed.

## Step 6 — Publish
Hit **Publish** in Lovable to deploy to a `*.lovable.app` URL (or your custom domain).

---

## Optional: enable Lovable's visual "click-to-edit"
Lovable's in-editor element selector uses the `lovable-tagger` Vite plugin, which our
`vite.config.ts` leaves out. **Building, preview, chat-editing, and Publish all work without
it** — this is only for the point-and-click editor. To enable it, install the dev dependency
and add the plugin in development mode only (so non-Lovable builds like Vercel are untouched):

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
```

```bash
npm i -D lovable-tagger
```

## Routes
| Route     | What it is                                  |
|-----------|---------------------------------------------|
| `/`       | Public homepage + guest self-registration   |
| `/admin`  | Admin scoring (passcode `ghana9ja`)         |
| `/share`  | Shareable, screenshot-ready leaderboard     |
