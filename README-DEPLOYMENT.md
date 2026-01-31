# Legacy Project Deployment Info

This repo is being retired in favor of a newer project. The info below captures the key deployment and network details needed to hand off or shut down this repo.

## Git remotes
- GitHub (origin): `https://github.com/jasonzhangshuo/morning-radiance-zen-timer.git`
- GitLab (gitlab): `https://gitlab.com/jasonzhangshuo-group/morning-radiance-zen-timer.git`

## CI/CD (GitLab Pages)
GitLab Pages is configured via `.gitlab-ci.yml`:
- Uses `node:18`
- Runs `npm ci` and `npm run build`
- Moves `dist` to `public` for Pages
- Deploys only on default branch

If you need the exact Pages URL, check **GitLab → Settings → Pages** for this project.

## Deployed URL (auto sync)
This project previously auto-synced to:
- `https://morning-radiance-zen-timer.pages.dev`

## Hosted dev address
The repo README references an AI Studio app URL:
- `https://ai.studio/apps/temp/1`

This appears to be an external hosted/dev address tied to the project template or previous deployment.

## Local dev server (network info)
`npm run dev` starts Vite (default port `3000`). The terminal prints local and LAN URLs, for example:
- Local: `http://localhost:3000/`
- Network (LAN): `http://192.168.1.22:3000/`

Your LAN URL can change per machine/network. Use the Vite output to get the current address.

## Notes
- Current README mentions an AI Studio app link and Gemini API key setup. This appears to be legacy/inapplicable to the current codebase.
- No GitHub Pages config was found in this repo.
