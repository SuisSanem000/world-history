# Deployment & CI/CD Approach (Advisory Reference for AI Assistant)

> **Note to the AI Assistant in the New Project**: This document describes the **zero-cost deployment and CI/CD approach** used in the original project. **Do not blindly copy this setup.** Read this guide, evaluate the new application's architecture (web app, API server, worker, serverless, or desktop/mobile backend), and decide with the user whether to adopt, adapt, or skip these patterns.

---

## 1. Decision Matrix for the New Project's AI

| New App Type | Recommended Choice | Key Adjustment Needed for TTS |
| :--- | :--- | :--- |
| **Node.js Web API / Full-Stack Server** | Render.com Free Web Service or Railway / Fly.io | Bind HTTP server to `0.0.0.0:${PORT}`; keep `./temp` writable |
| **Containerized Microservice / VPS** | Multi-stage `node:20-alpine` Docker container | Ensure `mkdir -p /app/temp` in production image stage |
| **Serverless (Vercel / AWS Lambda / Netlify)** | Native Serverless Functions | Change `TEMP_DIR` in `src/tts.ts` from `./temp` to `os.tmpdir()` (`/tmp`) |
| **Static Frontend Only** | Cannot run `node-edge-tts` in browser directly | Expose `synthesizeSpeech` via a lightweight backend API route (`POST /api/tts`) |

---

## 2. Approach Taken in the Original Project

### A. 24/7 Free Cloud Hosting (Render.com Web Service Pattern)
Instead of paying for a background worker, the original project ran as a **Free Web Service** on Render.com:
- **Port Binding**: Listened on `0.0.0.0` using `Number(process.env.PORT) || 3000`.
- **Health Check Endpoint**: Returned HTTP `200 OK` on `GET /` so Render's health check stayed green.
- **Environment Detection**: Checked `process.env.RENDER_EXTERNAL_URL` (automatically injected by Render) to switch between **Cloud Production Mode** and **Local Development Mode**.

#### Reference `render.yaml` Blueprint (If Adopted)
```yaml
services:
  - type: web
    name: my-new-tts-app
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run start
```

---

### B. Multi-Stage Alpine Docker Strategy
To keep container images small ($<180\text{ MB}$) while supporting TypeScript compilation and `node-edge-tts` temporary file writes, a 2-stage `Dockerfile` was used:

#### Reference `Dockerfile` (If Adopted)
```dockerfile
# Stage 1: Build TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
# Required by src/tts.ts for intermediate MP3 generation
RUN mkdir -p /app/temp
CMD ["node", "dist/index.js"]
```

---

### C. Zero-Cost CI & AI Code Review Pipeline
1. **GitHub Actions CI (`.github/workflows/ci.yml`)**:
   Runs on every `push` and `pull_request` to `main` on `ubuntu-latest` with Node 20:
   - `npm ci`
   - `npm run typecheck` (`tsc --noEmit`)
   - `npm run build` (`tsc`)
2. **Free Automated AI PR Review**:
   - **CodeRabbit** (1-click GitHub Marketplace app, free for public repos) or **GitHub Copilot PR Review** to automatically inspect diffs on every PR.

