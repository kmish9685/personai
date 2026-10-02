# PersonAI — The Decision Engine for Builders

**Live:** [personai.fun](https://personai.fun)

PersonAI helps founders, students, and builders make hard decisions. Instead of open-ended chat, it gives a clear verdict, checks the decision against your values, and sets "kill signals": dated checkpoints that tell you when to quit.

## Screenshots

| Landing | Analysis | Dashboard |
|---|---|---|
| ![Landing](screenshots/landing.png) | ![Analysis](screenshots/generation.png) | ![Dashboard](screenshots/dashboard.png) |

## Features

- **Binary verdict:** a clear YES or NO with reasoning, not a long list of "it depends"
- **Values alignment check:** tests the decision against what you said matters to you (e.g., security over freedom, speed over quality)
- **Kill signals:** checkpoints with a date and an expected metric; if the metric isn't met, it's time to stop
- **Decision threads:** every decision is saved with its inputs, analysis, conviction score, and status (active, completed, or killed)
- **Advisor personas:** get the same problem analysed from different thinking styles
- **Free and Pro plans:** usage limits on the free tier; payments via Razorpay (India) and Polar (international)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python) and Next.js API routes |
| AI | Llama 3.3 70B via the Groq API |
| Database | Supabase (PostgreSQL) |
| Authentication | Clerk |
| Payments | Razorpay, Polar |
| Analytics | PostHog, Vercel Speed Insights |
| Hosting | Vercel (frontend), Railway (backend) |

## How It Works

1. The user describes a decision, its options, and their constraints.
2. The backend builds a structured prompt and sends it to Llama 3.3 70B through Groq.
3. The model returns a verdict, a values check, and suggested kill-signal checkpoints.
4. The decision and its checkpoints are saved in Supabase so the user can come back, update the status, and stay accountable.

## Run Locally

```bash
git clone https://github.com/kmish9685/personai.git
cd personai
npm install
cp backend/.env.example backend/.env   # add your own keys
npm run dev
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

You will need your own keys for Groq, Supabase, and Clerk. Never commit real keys.

## Status

Live and in active development.

## Author

**Kuldeep Prasad Mishra** — [LinkedIn](https://www.linkedin.com/in/k-mishra980) · [GitHub](https://github.com/kmish9685)
