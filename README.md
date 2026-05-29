# SecureBank FAQ Chatbot Widget

A modern, bank-style **structured FAQ chatbot** built with Next.js App Router, Tailwind CSS, shadcn/ui, and Supabase.

This is **not an AI bot yet**. It follows a deterministic support flow:

`Categories -> Subcategories -> Questions -> Answers`

---

## 1) What this project does

- Shows a floating support chat button at bottom-right
- Opens a polished chat window with bot/user message bubbles
- Displays selectable chips for each FAQ step
- Loads data from Supabase through Next.js API routes
- Keeps chat history for the current browser session
- Includes loading, typing, and error UI states
- Is designed so AI can be added later without UI rewrite

---

## 2) High-level architecture

```text
User Clicks Widget
   ->
Chat UI (React components)
   ->
useChatbot hook (state machine + conversation history)
   ->
FaqApiClient (frontend data client)
   ->
Next.js API Routes (/api/*)
   ->
faq-repository.ts (DB query layer)
   ->
Supabase PostgreSQL
```

### Why this architecture is scalable

- UI is decoupled from data source via `MessageProvider` interface
- The hook (`useChatbot`) depends on interface, not concrete implementation
- Future AI provider can be plugged in beside or instead of FAQ provider
- Message metadata is already stored for future analytics and AI context

---

## 3) Folder structure and responsibilities

```text
chat_bot/
├── app/
│   ├── api/
│   │   ├── categories/route.ts       # GET categories
│   │   ├── subcategories/route.ts    # GET subcategories by categoryId
│   │   ├── faqs/route.ts             # GET questions by subcategoryId
│   │   └── faqs/[id]/route.ts        # GET single FAQ (answer)
│   ├── globals.css                   # Tailwind theme + chatbot animations
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Demo banking page + ChatWidget mount
│
├── components/
│   ├── chatbot/
│   │   ├── ChatWidget.tsx            # Entry component (button + window)
│   │   ├── ChatButton.tsx            # Floating action button
│   │   ├── ChatWindow.tsx            # Main chatbot modal/panel
│   │   ├── ChatHeader.tsx            # Bot title + close button
│   │   ├── ChatMessages.tsx          # Message list + chips + errors + auto-scroll
│   │   ├── ChatMessage.tsx           # Individual bubble (user/bot style)
│   │   ├── OptionChips.tsx           # Selectable flow options
│   │   └── TypingIndicator.tsx       # Animated typing dots
│   └── ui/
│       ├── button.tsx                # shadcn Button
│       └── scroll-area.tsx           # shadcn ScrollArea
│
├── hooks/
│   └── useChatbot.ts                 # Chat flow state + API orchestration
│
├── lib/
│   ├── chatbot/
│   │   ├── types.ts                  # Shared chatbot/domain types
│   │   ├── message-provider.ts       # Provider contract (FAQ now, AI later)
│   │   ├── faq-api-client.ts         # Client API wrapper implementation
│   │   └── ai-message-provider.stub.ts # Future AI provider placeholder
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client (optional use)
│   │   ├── server.ts                 # Server Supabase client for routes
│   │   └── faq-repository.ts         # DB query helpers
│   └── utils.ts                      # `cn()` helper (clsx + tailwind-merge)
│
├── supabase/
│   ├── schema.sql                    # Tables, indexes, RLS
│   └── seed.sql                      # Sample banking FAQ data
│
├── .env.example
└── README.md
```

---

## 4) Chat flow lifecycle (exact behavior)

### A) Widget open

1. User clicks floating button (`ChatButton`)
2. `useChatbot.openChat()` runs
3. Bot sends greeting message
4. Hook loads categories from `/api/categories`
5. Categories appear as chips

### B) Category selected

1. User chip click is stored as a user message
2. Hook sets selected category in context
3. Bot prompts next step
4. Hook fetches `/api/subcategories?categoryId=...`
5. Subcategory chips appear

### C) Subcategory selected

1. User choice appended to chat history
2. Hook fetches `/api/faqs?subcategoryId=...`
3. Question chips appear

### D) Question selected

1. User selected question appended
2. Hook fetches `/api/faqs/[id]`
3. Bot sends answer bubble
4. Hook reloads categories so user can continue another flow

### E) Start over

- Footer action appends "Start over"
- Selection context resets
- Categories reload

---

## 5) Component breakdown

| Component | Purpose |
|---|---|
| `ChatWidget` | Composes chat button + chat window and wires hook state |
| `ChatButton` | Floating FAB, open/close trigger, responsive positioning |
| `ChatWindow` | Main modal container, header, messages region, footer actions |
| `ChatHeader` | Bot identity and close action |
| `ChatMessages` | Scroll area, auto-scroll behavior, typing, options, errors |
| `ChatMessage` | Message bubble rendering for user and bot |
| `OptionChips` | Reusable chip list for categories/subcategories/questions |
| `TypingIndicator` | Visual typing animation between fetch and response |
| `useChatbot` | Conversation state machine + async orchestration |

---

## 6) Data model (Supabase PostgreSQL)

### Tables

1. `categories`
   - `id` (uuid, pk)
   - `name` (text, unique)

2. `subcategories`
   - `id` (uuid, pk)
   - `category_id` (uuid, fk -> categories.id)
   - `name` (text)

3. `faqs`
   - `id` (uuid, pk)
   - `subcategory_id` (uuid, fk -> subcategories.id)
   - `question` (text)
   - `answer` (text)

### Included SQL files

- `supabase/schema.sql` creates tables, indexes, RLS policies
- `supabase/seed.sql` inserts sample banking records

---

## 7) API routes and contract

### `GET /api/categories`

- Returns all categories
- Response:

```json
{
  "categories": [{ "id": "uuid", "name": "Cards" }]
}
```

### `GET /api/subcategories?categoryId={uuid}`

- Returns subcategories for a category
- Error if `categoryId` missing

### `GET /api/faqs?subcategoryId={uuid}`

- Returns FAQ questions only (no answers yet)
- Error if `subcategoryId` missing

### `GET /api/faqs/{id}`

- Returns selected question with full answer
- `404` if FAQ not found

---

## 8) Environment variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Recommended for server routes:

- `SUPABASE_SERVICE_ROLE_KEY`

> Never expose the service role key in frontend code.

---

## 9) Setup and run locally

1. Install dependencies:

```bash
npm install
```

2. Set up database:
   - Open Supabase SQL Editor
   - Run `supabase/schema.sql`
   - Run `supabase/seed.sql`

3. Add env values in `.env.local`

4. Start dev server:

```bash
npm run dev
```

5. Open:
   - [http://localhost:3000](http://localhost:3000)

6. Test flow:
   - `Cards -> Credit Cards -> How do I block my credit card?`

---

## 10) Build and production

```bash
npm run build
npm start
```

Deployment notes:

- Configure all env vars in your hosting platform (Vercel/Netlify/etc.)
- Ensure Supabase project allows required read access via RLS policy
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side environment

---

## 11) Error handling and UX behavior

- Missing query params return `400` from API
- Repository/API errors return `500` with error message
- UI shows:
  - typing indicator while bot is "responding"
  - loading text in footer while fetching
  - error alert in chat body for failed requests
- Auto-scroll keeps latest message/options visible

---

## 12) How AI can be added later (without rewrite)

Already prepared:

- `MessageProvider` interface for pluggable providers
- `useChatbot({ provider })` supports provider injection
- `ai-message-provider.stub.ts` ready to implement
- Message metadata (`faqId`, `flowStep`, etc.) useful for LLM context

Suggested AI evolution:

1. Add `POST /api/chat` for AI responses (streaming optional)
2. Implement `AiMessageProvider` using that route
3. Use hybrid strategy:
   - try exact FAQ first
   - fallback to AI when no direct FAQ match

---

## 13) Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui primitives
- Supabase PostgreSQL

---

## 14) Quick troubleshooting

- **Chat opens but shows no options**
  - Verify `.env.local`
  - Check Supabase tables are seeded
  - Inspect API route responses in browser network tab

- **Supabase auth/key errors**
  - Re-check URL and keys from Supabase Dashboard -> Settings -> API

- **Build warning about workspace root**
  - `next.config.ts` includes `outputFileTracingRoot` to stabilize build context

- **Questions load but answers fail**
  - Validate FAQ `id` exists and `GET /api/faqs/[id]` returns data
