import { create } from "zustand";
import { AIDifficulty } from "../game-engine/ai-bot";
import { WalletState, GUEST_INITIAL_STATE } from "../wallet/stacks";

export type ScreenType =
  | "LANDING"
  | "HOME"
  | "LOBBY"
  | "GAME"
  | "RESULTS"
  | "LEADERBOARD"
  | "WALLET"
  | "PROFILE";

export type GameMode =
  | "solo"
  | "ai"
  | "online"
  | "daily"
  | "tournament"
  | "survival"
  | "reverse"
  | "memory"
  | "lightning"
  | "kids";

export type GameStatus = "IDLE" | "LOBBY" | "COUNTDOWN" | "PLAYING" | "PAUSED" | "GAME_OVER";

export interface TapRecord {
  target: number;
  ms: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  bestTimeMs: number;
  avgReactionMs: number;
  totalStxWon: number;
  streak: number;
}

export interface GameStoreState {
  // Navigation & Screen State
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;

  // Active Mode & Config
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  setGameMode: (mode: GameMode) => void;
  setAIDifficulty: (diff: AIDifficulty) => void;

  // Game Engine State
  status: GameStatus;
  seed: string;
  maxNumber: number;
  currentTargetNumber: number;
  targetSequence: number[];
  currentStepIndex: number;
  playerScore: number;
  opponentScore: number;
  wrongTaps: number;
  playerHp: number; // For Survival mode
  startTime: number;
  elapsedMs: number;
  tapHistory: TapRecord[];
  winner: "player" | "opponent" | null;
  stxStake: number;
  stxEarned: number;

  // Lobby State
  roomCode: string;
  isHost: boolean;
  isReady: boolean;
  opponentName: string;
  opponentReady: boolean;

  // Wallet & Profile
  wallet: WalletState;
  username: string;
  country: string;
  rankName: string;
  stats: PlayerStats;

  // Actions
  setWallet: (wallet: WalletState) => void;
  setUsername: (name: string) => void;

  // Game Lifecycle Actions
  initGame: (mode?: GameMode, customSeed?: string) => void;
  startCountdown: () => void;
  startGameplay: () => void;
  handleTapNumber: (num: number) => boolean;
  handleOpponentProgress: (score: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (winner: "player" | "opponent") => void;

  // Lobby Actions
  createRoom: () => void;
  joinRoom: (code: string) => void;
  toggleReady: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  // Defaults
  activeScreen: "LANDING",
  setActiveScreen: (screen) => set({ activeScreen: screen }),

  gameMode: "ai",
  aiDifficulty: "medium",
  setGameMode: (mode) => set({ gameMode: mode }),
  setAIDifficulty: (diff) => set({ aiDifficulty: diff }),

  status: "IDLE",
  seed: "ARLO-SEED-88",
  maxNumber: 100,
  currentTargetNumber: 1,
  targetSequence: Array.from({ length: 100 }, (_, i) => i + 1),
  currentStepIndex: 0,
  playerScore: 0,
  opponentScore: 0,
  wrongTaps: 0,
  playerHp: 3,
  startTime: 0,
  elapsedMs: 0,
  tapHistory: [],
  winner: null,
  stxStake: 0.1,
  stxEarned: 0,

  roomCode: "ARLO-8492",
  isHost: true,
  isReady: false,
  opponentName: "CyberRacer",
  opponentReady: true,

  wallet: GUEST_INITIAL_STATE,
  username: "FastEyes_99",
  country: "🇺🇸 USA",
  rankName: "Grandmaster",
  stats: {
    gamesPlayed: 48,
    wins: 36,
    bestTimeMs: 34200,
    avgReactionMs: 312,
    totalStxWon: 14.8,
    streak: 5,
  },

  setWallet: (wallet) => set({ wallet }),
  setUsername: (name) => set({ username: name }),

  initGame: (mode, customSeed) => {
    const activeMode = mode || get().gameMode;
    const newSeed = customSeed || `ARLO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    let max = 100;
    if (activeMode === "lightning") max = 30;
    if (activeMode === "kids") max = 20;

    let seq = Array.from({ length: max }, (_, i) => i + 1);
    if (activeMode === "reverse") {
      seq = Array.from({ length: max }, (_, i) => max - i);
    }

    set({
      gameMode: activeMode,
      seed: newSeed,
      maxNumber: max,
      currentTargetNumber: seq[0],
      targetSequence: seq,
      currentStepIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      wrongTaps: 0,
      playerHp: 3,
      startTime: 0,
      elapsedMs: 0,
      tapHistory: [],
      winner: null,
      stxEarned: 0,
      status: activeMode === "online" || activeMode === "tournament" ? "LOBBY" : "COUNTDOWN",
    });
  },

  startCountdown: () => set({ status: "COUNTDOWN" }),

  startGameplay: () =>
    set({
      status: "PLAYING",
      startTime: Date.now(),
    }),

  handleTapNumber: (num) => {
    const state = get();
    if (state.status !== "PLAYING") return false;

    const expected = state.currentTargetNumber;

    if (num === expected) {
      const now = Date.now();
      const lastTapTime = state.tapHistory.length > 0
        ? state.startTime + state.tapHistory.reduce((acc, t) => acc + t.ms, 0)
        : state.startTime;

      const reactionTime = Math.max(80, now - lastTapTime);
      const updatedTapHistory = [...state.tapHistory, { target: num, ms: reactionTime }];
      const nextIndex = state.currentStepIndex + 1;
      const newScore = state.playerScore + 1;

      if (nextIndex >= state.targetSequence.length) {
        // Game Won!
        const totalElapsed = now - state.startTime;
        const stxEarned = state.gameMode === "online" || state.gameMode === "tournament" ? state.stxStake * 1.8 : 0.05;

        set({
          playerScore: newScore,
          currentStepIndex: nextIndex,
          tapHistory: updatedTapHistory,
          elapsedMs: totalElapsed,
          winner: "player",
          stxEarned,
          status: "GAME_OVER",
          activeScreen: "RESULTS",
          stats: {
            ...state.stats,
            gamesPlayed: state.stats.gamesPlayed + 1,
            wins: state.stats.wins + 1,
            bestTimeMs: state.stats.bestTimeMs === 0 ? totalElapsed : Math.min(state.stats.bestTimeMs, totalElapsed),
            totalStxWon: Number((state.stats.totalStxWon + stxEarned).toFixed(2)),
          },
          wallet: {
            ...state.wallet,
            stxBalance: Number((state.wallet.stxBalance + stxEarned).toFixed(2)),
          },
        });
        return true;
      } else {
        const nextTarget = state.targetSequence[nextIndex];
        set({
          playerScore: newScore,
          currentStepIndex: nextIndex,
          currentTargetNumber: nextTarget,
          tapHistory: updatedTapHistory,
          elapsedMs: now - state.startTime,
        });
        return true;
      }
    } else {
      // Wrong Tap!
      const updatedWrongTaps = state.wrongTaps + 1;
      let newHp = state.playerHp;

      if (state.gameMode === "survival") {
        newHp = state.playerHp - 1;
        if (newHp <= 0) {
          // Game Over (Survival HP exhausted)
          const totalElapsed = Date.now() - state.startTime;
          set({
            wrongTaps: updatedWrongTaps,
            playerHp: 0,
            elapsedMs: totalElapsed,
            winner: "opponent",
            status: "GAME_OVER",
            activeScreen: "RESULTS",
          });
          return false;
        }
      }

      set({ wrongTaps: updatedWrongTaps, playerHp: newHp });
      return false;
    }
  },

  handleOpponentProgress: (score) => {
    const state = get();
    if (state.status !== "PLAYING") return;

    if (score >= state.targetSequence.length) {
      // Opponent Wins!
      const totalElapsed = Date.now() - state.startTime;
      set({
        opponentScore: score,
        elapsedMs: totalElapsed,
        winner: "opponent",
        status: "GAME_OVER",
        activeScreen: "RESULTS",
        stats: {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
        },
      });
    } else {
      set({ opponentScore: score });
    }
  },

  pauseGame: () => set({ status: "PAUSED" }),
  resumeGame: () => set({ status: "PLAYING" }),

  endGame: (winner) => set({ status: "GAME_OVER", winner, activeScreen: "RESULTS" }),

  createRoom: () => {
    const code = `ARLO-${Math.floor(1000 + Math.random() * 9000)}`;
    set({
      roomCode: code,
      isHost: true,
      isReady: true,
      opponentReady: false,
      gameMode: "online",
      activeScreen: "LOBBY",
    });
    get().initGame("online", code);
  },

  joinRoom: (code) => {
    set({
      roomCode: code.toUpperCase(),
      isHost: false,
      isReady: false,
      opponentReady: true,
      gameMode: "online",
      activeScreen: "LOBBY",
    });
    get().initGame("online", code);
  },

  toggleReady: () => {
    const newReady = !get().isReady;
    set({ isReady: newReady });
    if (newReady && get().opponentReady) {
      setTimeout(() => {
        get().startCountdown();
        set({ activeScreen: "GAME" });
      }, 500);
    }
  },
}));
