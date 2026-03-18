# Commit & Deployment Workflow

## Branch Strategy

- **`dev`** — Active development branch. All new work happens here.
- **`main`** — Production branch. Only receives code via PRs from `dev`.

## Daily Workflow

### 1. Work on `dev`

```bash
git checkout dev
# make changes
git add .
git commit -m "feat: description of change"
git push origin dev
```

### 2. Deploy to Production (PR)

1. Go to GitHub → Pull Requests → New Pull Request
2. Set **base: `main`** ← **compare: `dev`**
3. Review the diff, then **Create Pull Request** and **Merge**
4. The CI/CD pipeline auto-deploys to EC2 on merge to `main`

### 3. Sync `dev` with `main` After Merge

```bash
git checkout dev
git merge main
git push origin dev
```

> Always do this after merging a PR so `dev` stays up to date.

## Commit Message Conventions

Use prefixes to categorize commits:

| Prefix      | Use For                              | Example                              |
|-------------|--------------------------------------|--------------------------------------|
| `feat:`     | New features                         | `feat: add user registration page`   |
| `fix:`      | Bug fixes                            | `fix: resolve session cookie issue`  |
| `refactor:` | Code restructuring (no new behavior) | `refactor: extract auth middleware`  |
| `style:`    | CSS/UI changes                       | `style: update login page layout`    |
| `docs:`     | Documentation changes                | `docs: update deployment guide`      |
| `chore:`    | Config, dependencies, tooling        | `chore: update Dockerfile for npm ci`|

## Manual EC2 Deployment (if CI/CD fails)

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
cd ~/Cascadia-Gear-Co-op
git pull origin main
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d --force-recreate
docker compose -f docker-compose.prod.yml logs app --tail 20
```

## Common Pitfalls

- **Always commit `package-lock.json`** alongside `package.json` when adding/removing dependencies.
- **Don't push directly to `main`** unless fixing a production outage.
- **After hotfixing `main`**, merge `main` back into `dev` so branches stay in sync.
- **Check `git show HEAD:package.json`** to verify what's actually committed vs. just in your working tree.
