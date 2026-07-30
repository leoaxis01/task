# TASK 2.0 Portal

Fully interactive government portal for **Telangana Academy for Skill and Knowledge (TASK)** — Department of ITE&C, Government of Telangana.

## Active features

- **Accounts** — register / sign-in with role-based session (persisted in browser)
- **My Dashboard** — enrollments, applications, mentorship, score, profile toolkit
- **Engineering catalogue** — search, filter, enrol courses & partner modules
- **Job Centres** — search/filter roles and apply (tracked on dashboard)
- **Mentorship** — request mentor matches
- **Skill Gap Engine** — interactive score saved to profile
- **Learning Hub** — enrol learning tracks; continue learning list
- **Resume Builder** — draft + live preview
- **Entrepreneurship** — submit ventures to selected tracks
- **Command Centre** — district filter + live session counters
- **Global search** — courses, jobs, mentors, learning, startups
- **AI Counsellor** — floating chat assistant
- **Notifications** — bell feed for portal actions
- **EN / తెలుగు** language chrome toggle

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

Session data is stored in `localStorage` under `task-portal-v1` for this demo portal.
