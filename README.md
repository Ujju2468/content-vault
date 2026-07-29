#project start date with the help of gemini - 29-07-2026, wednesday

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


src/lib/scraper - Fetches titles, descriptions, and thumbnails from Instagram, YouTube, and standard web links via OpenGraph tags.

AI Classification Engine (src/lib/ai.ts)
Uses OpenAI / compatible API to auto-assign a category, generate tags, and write a summary. Falls back to default values if the API key is unconfigured.

API Ingest Route (src/app/api/ingest/route.ts)


API Items & Search Route (src/app/api/items/route.ts)
Retrieves, searches, and filters saved items from your local database along with their category and tags.

Categories API Route (src/app/api/categories/route.ts)
Fetches all categories to populate our sidebar filters and modals.

Notion-Style Sidebar (src/components/sidebar.tsx)
Renders category navigation, active filters, and the "Quick Save" trigger.

Main Dashboard & Ingest Modal (src/app/page.tsx)
The main dashboard featuring a search bar, responsive grid cards, and the modal to paste reels, shorts, or articles.