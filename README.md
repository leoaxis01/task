# TASK 2.0 Portal

Fully interactive government portal for **Telangana Academy for Skill and Knowledge (TASK)** — Department of ITE&C, Government of Telangana.

## What’s included (proposal coverage)

| Proposal module | Status |
|---|---|
| Portal modernization / responsive UI | Done |
| Skill offerings + engineering catalogue | Done |
| Mentorship ecosystem | Done |
| Digital Job Centres + ATS apply flow | Done |
| Virtual Job Fair | Done |
| Employer Hub (post jobs) | Done |
| AI Skill Gap Engine | Done |
| Learning Hub | Done |
| Command & Control Centre (live API stats) | Done |
| Innovation & Entrepreneurship | Done |
| Resume builder | Done |
| Registered colleges / coordinator access | Done |
| EN / తెలుగు chrome | Done |
| AI counsellor chatbot | Done |
| Server auth (JWT cookie) + JSON datastore | Done |

## Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind, Framer Motion
- Backend: Next.js Route Handlers (Node)
- Auth: JWT httpOnly cookies + bcrypt password hashes
- Data: durable JSON store in `data/portal-db.json`

## Run locally

```bash
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3001
```

Open http://localhost:3001

### Dev mode

```bash
npm run dev -- -p 3001
```

### E2E

```bash
npm run build && npm run start -- -p 3001
PORTAL_URL=http://localhost:3001 node scripts/e2e-portal.cjs
```

### Docker

```bash
docker compose up --build
```

## Demo accounts

Register any email (password default `task2026`) as Student, Employer, Mentor, etc.
All enrollments, applications, mentorship, resumes, and ventures persist on the server.
