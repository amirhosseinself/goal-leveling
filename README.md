# Goal Leveling

اپلیکیشن شخصی برای مدیریت اهداف، مهارت‌ها و پیگیری پیشرفت توسعه فردی.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + MongoDB
- NextAuth v5 (OTP/Credentials, JWT session)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set values.

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run development server:

```bash
npm run dev
```

App runs on `http://localhost:3000`.

## Environment Variables

See `.env.example`.

- `DATABASE_URL`: MongoDB connection string
- `AUTH_SECRET`: NextAuth secret
- `NEXTAUTH_URL`: App base URL (e.g. `http://localhost:3000`)
- `OTP_DEV_CODE`: Optional fixed OTP for personal/dev use (defaults to `151515`)

## Main Features

- OTP mobile login (personal/dev-friendly)
- Goals CRUD with category/priority/status/deadline/target tracking
- Goal-skill linking (impact, priority, learning status)
- Goal and skill progress logging
- Progress dashboard and summary
- Profile/settings management

## Scripts

- `npm run dev` - start dev server
- `npm run build` - generate Prisma client and build
- `npm run start` - start production server
- `npm run lint` - run lint
