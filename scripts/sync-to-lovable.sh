#!/usr/bin/env bash
#
# sync-to-lovable.sh — push the AfriCup Backyard Challenge code into the GitHub
# repo that Lovable created for your project, so Lovable syncs the exact code in.
#
# Lovable can't import an existing repo: when you connect a Lovable project to
# GitHub it creates its OWN repo as the source of truth and two-way-syncs one
# branch. This script drops our code onto that repo's synced branch (keeping the
# repo's own .git so Lovable keeps tracking it), commits, and pushes.
#
# Usage:
#   ./scripts/sync-to-lovable.sh <lovable-repo-git-url> [branch]
#
# Examples:
#   ./scripts/sync-to-lovable.sh https://github.com/Kingkwaku/my-lovable-app.git
#   ./scripts/sync-to-lovable.sh git@github.com:Kingkwaku/my-lovable-app.git main
#
# Requirements: git, tar. (macOS/Linux, or WSL / Git-Bash on Windows.)
# Override the code source with SOURCE_URL=... (used for local testing).

set -euo pipefail

TARGET_URL="${1:-}"
BRANCH="${2:-main}"
SOURCE_URL="${SOURCE_URL:-https://github.com/Kingkwaku/Bbq_fun.git}"

if [[ -z "$TARGET_URL" ]]; then
  echo "Usage: $0 <lovable-repo-git-url> [branch=main]" >&2
  echo "  Get <lovable-repo-git-url> from the repo Lovable created when you connected GitHub." >&2
  exit 1
fi

for bin in git tar; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "Error: '$bin' is required but not installed." >&2
    exit 1
  fi
done

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

echo "==> Cloning source code from: $SOURCE_URL"
git clone --quiet --depth 1 "$SOURCE_URL" "$TMP/source"

echo "==> Cloning Lovable target repo: $TARGET_URL"
git clone --quiet "$TARGET_URL" "$TMP/target"

cd "$TMP/target"

# Make sure we are on the branch Lovable syncs.
if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  git checkout --quiet "$BRANCH"
else
  echo "==> Branch '$BRANCH' not found on target; creating it."
  git checkout --quiet -b "$BRANCH"
fi

echo "==> Replacing target's tracked files with our code (target .git is preserved)."
# Remove existing tracked files only; leaves .git intact.
git rm -rqf . >/dev/null 2>&1 || true

# Copy our files in, excluding VCS and build/output artifacts. A fresh clone
# only contains tracked files (node_modules/dist/.vercel are gitignored), so we
# just need to skip the source's .git. tar is used for portability (no rsync).
( cd "$TMP/source" && tar -cf - \
    --exclude='./.git' \
    --exclude='./node_modules' \
    --exclude='./dist' \
    --exclude='./.vercel' \
    . ) | tar -xf -

git add -A

if git diff --cached --quiet; then
  echo "==> Nothing to sync — target already matches our code. Done."
  exit 0
fi

echo
echo "About to commit and push the AfriCup code to:"
echo "  repo:   $TARGET_URL"
echo "  branch: $BRANCH"
echo
read -r -p "Proceed? [y/N] " reply
case "$reply" in
  [yY] | [yY][eE][sS]) ;;
  *) echo "Aborted. No changes pushed." >&2; exit 1 ;;
esac

git commit --quiet -m "Import AfriCup Backyard Challenge (exact code)"
git push origin "$BRANCH"

echo
echo "✅ Pushed. Lovable should pull this branch and rebuild the preview within ~a minute."
echo "   Next: in Lovable, verify the preview, then set Supabase env vars (optional) and Publish."
