# Arlo — Find. Tap. Repeat.

> **The fastest eyes win.**

Arlo is a minimal, competitive multiplayer visual reaction game where players race to locate and tap numbers (1–100) scattered across a procedurally generated hand illustration. Built with a clean, dark design system, micro-animations, and seamless Stacks Leather wallet integration for Web3 skill-based STX rewards.

---

## 🎮 Concept

Numbers 1–100 are randomly distributed across the palm and fingers of a vector hand silhouette. The first player to correctly tap the current target number advances to the next.

```
Game Starts ➔ Find: 1 ➔ Player taps 1 ➔ Next: 2 ➔ Player taps 2 ... ➔ 100 ➔ Fastest wins!
```

---

## ⚡ Key Features & Game Modes

### 1. Solo & Practice
- **Quick Play 1–100**: Race against your personal best time on fresh, procedurally generated hand layouts.
- **Daily Challenge**: Everyone plays on the exact same daily seed layout. The fastest times climb the global leaderboard.

### 2. AI 1v1 Modes
Play against simulated AI opponents with realistic human reaction times and cognitive scanning delays:
- **Easy (Rookie Bot)**: 850–1650ms delay, 12% mistake probability.
- **Medium (Pro Bot)**: 450–850ms delay, 5% mistake probability.
- **Hard (Master Bot)**: 240–480ms delay, 1% mistake probability.
- **Impossible (CYBORG X)**: 110–220ms delay, 0% mistake probability (godlike speed).

### 3. Online 1v1 & Tournaments
- **Create / Join Rooms**: Host custom rooms with a 4-digit room code.
- **Real-Time Progress**: Live opponent score progress bar and activity updates.
- **STX Skill Wagers**: Stake STX (e.g. 0.1 STX entry, 0.18 STX payout to winner, 0.02 STX platform fee).
- **Tournament Brackets**: Visual bracket system supporting 8, 16, and 32 player knockout competitions.

### 4. Specialized Variant Modes
- **Survival**: Wrong tap = lose 1 HP. 3 mistakes = Game Over.
- **Reverse Mode**: Find 100 ➔ 99 ➔ 98 ... ➔ 1.
- **Memory Mode**: Numbers fade away after 5 seconds. Player must remember locations!
- **Lightning (1–30)**: Ultra-fast speedrun for quick matches.
- **Kids Mode (1–20)**: Extra-large numbers with bright colors.

---

## 🧠 Procedural Vector Hand Engine

Match layouts are never fixed or hardcoded. Instead, every game generates a unique, fair layout using a seeded pseudo-random engine:

1. **Seeded PRNG**: Uses Mulberry32 PRNG to deterministically generate spatial coordinates from a seed string (`ARLO-XXXX`), guaranteeing identical, fair layouts for all players in multiplayer matches.
2. **7 Anatomical Zones**: Hand canvas is partitioned into Palm Center, Palm Base, Thumb, Index, Middle, Ring, and Pinky fingers.
3. **Collision Avoidance**: Spatial grid rejection sampling ensures every single number is non-overlapping, crisp, and tappable.
4. **Natural Aesthetic**: Applies subtle deterministic rotations (`-18°` to `+18°`) and scale variance for a printed look.

---

## 🎨 Design Direction

Inspired by the clean simplicity of Duolingo, Clash Royale polish, and Apple typography spacing:

- **Background**: `#0A0A0A`
- **Surface**: `#111111`
- **Cards**: `#181818`
- **Accent Color**: `#FF6B00` (Orange)
- **Hover Accent**: `#FF8533`
- **Typography**:
  - **Headings**: `Space Grotesk`
  - **Body**: `Inter`
  - **Numbers**: `JetBrains Mono`

---

## 🌐 Stacks Web3 & Leather Wallet Integration

- **Wallet Connection**: Supports Leather wallet connection via `@stacks/connect` or browser extension detection.
- **Guest Mode**: Allows anyone to jump directly into gameplay without requiring a wallet.
- **Leaderboards & Profiles**: Global rankings, daily/weekly stats, reaction speed metrics (ms/tap), and unlockable NFT badges.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, React 19
- **Styling**: Tailwind CSS v4, Vanilla CSS Design Tokens
- **State Management**: Zustand
- **Graphics**: Interactive SVG Vector Engine
- **Blockchain**: Stacks Blockchain (Leather Wallet API)

---

## 📂 Directory Structure

```
arlo/
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind v4 dark theme, fonts, button classes
│   │   ├── layout.tsx          # Space Grotesk, Inter, JetBrains Mono Google Fonts
│   │   └── page.tsx            # App View Router (Landing, Home, Lobby, Game, Results, Leaderboard, Wallet, Profile)
│   ├── components/
│   │   ├── game/
│   │   │   ├── HandCanvas.tsx      # SVG Vector Hand & Seeded Number Engine
│   │   │   ├── TargetBanner.tsx    # Live HUD (Find target, Timer, Acc %, Progress)
│   │   │   ├── CountdownOverlay.tsx# 3-2-1 GO countdown overlay
│   │   │   ├── GameScreen.tsx      # Game Screen container & AI loop runner
│   │   │   └── ResultsModal.tsx    # Post-match victory/defeat & STX stats
│   │   ├── lobby/
│   │   │   └── WaitingLobby.tsx    # Room lobby code sharing, player ready status, chat
│   │   ├── dashboard/
│   │   │   ├── HomeDashboard.tsx   # Dashboard home screen with quick-play cards
│   │   │   ├── LeaderboardView.tsx # Daily, Weekly, Global rankings
│   │   │   ├── WalletDrawer.tsx    # STX balance & Leather wallet connection
│   │   │   └── ProfileView.tsx     # Player rank, lifetime stats, NFT badges
│   │   └── landing/
│   │       └── LandingHero.tsx     # Product landing hero section
│   ├── lib/
│   │   ├── game-engine/
│   │   │   ├── prng.ts         # Mulberry32 PRNG seed generator
│   │   │   ├── placement.ts    # Hand zone bounding & collision avoidance algorithm
│   │   │   └── ai-bot.ts       # AI reaction time distribution & mistake simulator
│   │   ├── wallet/
│   │   │   └── stacks.ts       # Leather wallet helper & guest fallback
│   │   └── store/
│   │       └── gameStore.ts    # Zustand global game state & score tracking
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm package manager

### Installation & Run

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your web browser.

---

## 📄 License

This project is licensed under the MIT License.
