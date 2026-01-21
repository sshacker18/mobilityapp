#!/bin/sh
# POSIX-compliant script to create a GitHub repo and push local code using gh CLI.
# Does not store or embed tokens. Prompts user when gh is missing.

set -eu

echo "This script will create a GitHub repository and push the current project."

read -r -p "GitHub owner (user or org) [your-username]: " GH_OWNER
if [ -z "$GH_OWNER" ]; then
  GH_OWNER=$(git config user.name || echo "")
fi
read -r -p "Repository name [mobility-superapp]: " GH_REPO
if [ -z "$GH_REPO" ]; then
  GH_REPO="mobility-superapp"
fi

echo "Repository will be created as: $GH_OWNER/$GH_REPO"
read -r -p "Create as public? (y/N): " IS_PUBLIC
if [ "$IS_PUBLIC" = "y" ] || [ "$IS_PUBLIC" = "Y" ]; then
  VISIBILITY="public"
else
  VISIBILITY="private"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install GitHub CLI and authenticate (https://cli.github.com/)."
  echo "You can still create a repo manually on GitHub and then run:"
  echo "  git remote add origin git@github.com:$GH_OWNER/$GH_REPO.git"
  echo "  git push -u origin main"
  exit 1
fi

# Initialize git if not already
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

# Ensure there is at least one commit
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git add --all
  git commit -m "chore: initial commit"
fi

# Create repo via gh
echo "Creating repository on GitHub ($VISIBILITY)..."
if gh repo view "$GH_OWNER/$GH_REPO" >/dev/null 2>&1; then
  echo "Repository already exists on GitHub. Skipping creation."
else
  gh repo create "$GH_OWNER/$GH_REPO" --$VISIBILITY --source=. --remote=origin --confirm || {
    echo "gh repo create failed. Please create the repo manually and add origin."
    exit 1
  }
fi

echo "Pushing main branch to origin..."
# Ensure branch is main
git branch --show-current >/dev/null 2>&1 && CURRENT_BRANCH=$(git branch --show-current) || CURRENT_BRANCH=""
if [ "$CURRENT_BRANCH" != "main" ]; then
  git branch -M main
fi
git push -u origin main

cat <<EOF
Done. Next steps (manual):
- Go to https://github.com/$GH_OWNER/$GH_REPO and open Settings -> Secrets (Repository) to add required secrets.
  Suggested secrets: DATABASE_URL, JWT_SECRET, RAILWAY_TOKEN, VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID, DOCKERHUB_USERNAME, DOCKERHUB_TOKEN
- If using Railway: connect the repo and add Postgres plugin, then set DATABASE_URL and JWT_SECRET in Railway env vars.
- Run migrations after deployment: 'npx prisma migrate deploy' (or via Railway console/CLI).

Security: Do NOT commit secrets or .env files. Use GitHub Secrets or your hosting provider's env settings.

EOF

echo "Finished."
