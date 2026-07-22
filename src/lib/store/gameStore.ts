import { create } from "zustand";
import { AIDifficulty } from "../game-engine/ai-bot";
import { WalletState, GUEST_INITIAL_STATE } from "../wallet/stacks";
import { sound } from "../audio/sound";
import { createPRNG, shuffleArray } from "../game-engine/prng";

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

export type GameStatus = "IDLE" | "LOBBY" | "COUNTDOWN" | "PLAYING" | "PAUSED" | "ROUND_ENDED" | "GAME_OVER";

export interface TapRecord {
  target: number;
  ms: number;
}

export interface RoundResult {
  round: number;
  playerScore: number;
  opponentScore: number;
  winner: "player" | "opponent";
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
  // Navigation & Sound
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Active Mode & AI Config
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  setGameMode: (mode: GameMode) => void;
  setAIDifficulty: (diff: AIDifficulty) => void;

  // 3-Round System State
  currentRound: number;
  maxRounds: number;
  playerRoundWins: number;
  opponentRoundWins: number;
  roundScores: RoundResult[];
  roundTimeLeft: number; // 60 seconds per round
  lastRoundWinner: { round: number; winner: "player" | "opponent"; playerScore: number; opponentScore: number } | null;

  // Single Round Engine State
  status: GameStatus;
  seed: string;
  maxNumber: number;
  currentTargetNumber: number;
  targetSequence: number[];
  currentStepIndex: number;
  completedNumbers: number[];
  playerScore: number;
  opponentScore: number;
  wrongTaps: number;
  playerHp: number;
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
  isWithdrawalModalOpen: boolean;
  setWithdrawalModalOpen: (open: boolean) => void;
  handleWithdrawal: (address: string, amount: number) => boolean;

  // Actions
  setWallet: (wallet: WalletState) => void;
  setUsername: (name: string) => void;

  // Lifecycle & Round Actions
  initGame: (mode?: GameMode, customSeed?: string) => void;
  startCountdown: () => void;
  startGameplay: () => void;
  tickRoundTimer: () => void;
  handleTapNumber: (num: number) => boolean;
  handleOpponentProgress: (score: number) => void;
  endRound: () => void;
  proceedToNextRound: () => void;
  pauseGame: () => void;
  resumeGame: () => void;

  // Lobby Actions
  createRoom: () => void;
  joinRoom: (code: string) => void;
  toggleReady: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  // Navigation & Sound
  activeScreen: "LANDING",
  setActiveScreen: (screen) => {
    sound.playButtonClick();
    set({ activeScreen: screen });
  },

  soundEnabled: true,
  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.setMuted(!next);
    set({ soundEnabled: next });
  },

  gameMode: "ai",
  aiDifficulty: "medium",
  setGameMode: (mode) => set({ gameMode: mode }),
  setAIDifficulty: (diff) => set({ aiDifficulty: diff }),

  // 3 Rounds defaults
  currentRound: 1,
  maxRounds: 3,
  playerRoundWins: 0,
  opponentRoundWins: 0,
  roundScores: [],
  roundTimeLeft: 60,
  lastRoundWinner: null,

  status: "IDLE",
  seed: "ARLO-SEED-88",
  maxNumber: 100,
  currentTargetNumber: 1,
  targetSequence: [],
  currentStepIndex: 0,
  completedNumbers: [],
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
  isWithdrawalModalOpen: false,
  setWithdrawalModalOpen: (open) => set({ isWithdrawalModalOpen: open }),

  handleWithdrawal: (address, amount) => {
    const { wallet } = get();
    if (amount <= 0 || amount > wallet.stxBalance || !address) {
      return false;
    }
    const newBal = Number((wallet.stxBalance - amount).toFixed(3));
    set({
      wallet: {
        ...wallet,
        stxBalance: newBal,
      },
    });
    sound.playVictoryFanfare();
    return true;
  },

  setWallet: (wallet) => set({ wallet }),
  setUsername: (name) => set({ username: name }),

  initGame: (mode, customSeed) => {
    const activeMode = mode || get().gameMode;
    const newSeed = customSeed || `ARLO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    let max = 100;
    if (activeMode === "lightning") max = 30;
    if (activeMode === "kids") max = 20;

    const baseSeq = Array.from({ length: max }, (_, i) => i + 1);
    const rng = createPRNG(newSeed);

    let seq: number[] = [];
    if (activeMode === "reverse") {
      seq = Array.from({ length: max }, (_, i) => max - i);
    } else {
      // Shuffle target prompts so player must search randomly across palm
      seq = shuffleArray(baseSeq, rng);
    }

    set({
      gameMode: activeMode,
      seed: newSeed,
      maxNumber: max,
      currentTargetNumber: seq[0],
      targetSequence: seq,
      currentStepIndex: 0,
      completedNumbers: [],
      playerScore: 0,
      opponentScore: 0,
      wrongTaps: 0,
      playerHp: 3,
      startTime: 0,
      elapsedMs: 0,
      tapHistory: [],
      winner: null,
      stxEarned: 0,

      // Reset 3 Rounds state
      currentRound: 1,
      playerRoundWins: 0,
      opponentRoundWins: 0,
      roundScores: [],
      roundTimeLeft: 60,
      lastRoundWinner: null,

      status: activeMode === "online" || activeMode === "tournament" ? "LOBBY" : "COUNTDOWN",
    });
  },

  startCountdown: () => set({ status: "COUNTDOWN" }),

  startGameplay: () =>
    set({
      status: "PLAYING",
      startTime: Date.now(),
      roundTimeLeft: 60,
    }),

  tickRoundTimer: () => {
    const state = get();
    if (state.status !== "PLAYING") return;

    if (state.roundTimeLeft <= 1) {
      state.endRound();
    } else {
      set({ roundTimeLeft: state.roundTimeLeft - 1 });
    }
  },

  handleTapNumber: (num) => {
    const state = get();
    if (state.status !== "PLAYING") return false;

    const expected = state.currentTargetNumber;

    if (num === expected) {
      sound.playCorrectTap();
      const now = Date.now();
      const lastTapTime =
        state.tapHistory.length > 0
          ? state.startTime + state.tapHistory.reduce((acc, t) => acc + t.ms, 0)
          : state.startTime;

      const reactionTime = Math.max(80, now - lastTapTime);
      const updatedTapHistory = [...state.tapHistory, { target: num, ms: reactionTime }];
      const updatedCompleted = [...state.completedNumbers, num];
      const nextIndex = state.currentStepIndex + 1;
      const newScore = state.playerScore + 1;

      if (nextIndex >= state.targetSequence.length) {
        set({
          playerScore: newScore,
          currentStepIndex: nextIndex,
          completedNumbers: updatedCompleted,
          tapHistory: updatedTapHistory,
          elapsedMs: now - state.startTime,
        });
        state.endRound();
        return true;
      } else {
        const nextTarget = state.targetSequence[nextIndex];
        set({
          playerScore: newScore,
          currentStepIndex: nextIndex,
          currentTargetNumber: nextTarget,
          completedNumbers: updatedCompleted,
          tapHistory: updatedTapHistory,
          elapsedMs: now - state.startTime,
        });
        return true;
      }
    } else {
      sound.playWrongTap();
      const updatedWrongTaps = state.wrongTaps + 1;
      let newHp = state.playerHp;

      if (state.gameMode === "survival") {
        newHp = state.playerHp - 1;
        if (newHp <= 0) {
          set({ wrongTaps: updatedWrongTaps, playerHp: 0 });
          state.endRound();
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
      set({ opponentScore: score });
      state.endRound();
    } else {
      set({ opponentScore: score });
    }
  },

  endRound: () => {
    const state = get();
    if (state.status === "GAME_OVER" || state.status === "ROUND_ENDED") return;

    const isPlayerRoundWin =
      state.playerScore > state.opponentScore ||
      (state.playerScore === state.opponentScore && state.wrongTaps <= 0);

    const roundWinner: "player" | "opponent" = isPlayerRoundWin ? "player" : "opponent";
    const newPlayerWins = isPlayerRoundWin ? state.playerRoundWins + 1 : state.playerRoundWins;
    const newOpponentWins = !isPlayerRoundWin ? state.opponentRoundWins + 1 : state.opponentRoundWins;

    const updatedRoundScores: RoundResult[] = [
      ...state.roundScores,
      {
        round: state.currentRound,
        playerScore: state.playerScore,
        opponentScore: state.opponentScore,
        winner: roundWinner,
      },
    ];

    if (isPlayerRoundWin) {
      sound.playVictoryFanfare();
    } else {
      sound.playDefeatSound();
    }

    set({
      playerRoundWins: newPlayerWins,
      opponentRoundWins: newOpponentWins,
      roundScores: updatedRoundScores,
      lastRoundWinner: {
        round: state.currentRound,
        winner: roundWinner,
        playerScore: state.playerScore,
        opponentScore: state.opponentScore,
      },
      status: "ROUND_ENDED",
    });
  },

  proceedToNextRound: () => {
    const state = get();
    const matchFinished =
      state.playerRoundWins >= 2 ||
      state.opponentRoundWins >= 2 ||
      state.currentRound >= state.maxRounds;

    if (matchFinished) {
      const overallWinner: "player" | "opponent" =
        state.playerRoundWins > state.opponentRoundWins ? "player" : "opponent";

      const totalElapsed = Date.now() - state.startTime;
      const stxAward = overallWinner === "player" ? 0.001 : 0; // 0.001 STX reward!

      set({
        winner: overallWinner,
        stxEarned: stxAward,
        status: "GAME_OVER",
        activeScreen: "RESULTS",
        stats: {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
          wins: overallWinner === "player" ? state.stats.wins + 1 : state.stats.wins,
          bestTimeMs:
            overallWinner === "player"
              ? state.stats.bestTimeMs === 0
                ? totalElapsed
                : Math.min(state.stats.bestTimeMs, totalElapsed)
              : state.stats.bestTimeMs,
          totalStxWon: Number((state.stats.totalStxWon + stxAward).toFixed(3)),
        },
        wallet: {
          ...state.wallet,
          stxBalance: Number((state.wallet.stxBalance + stxAward).toFixed(3)),
        },
      });
    } else {
      // Advance to Next Round (Round 2 or 3)
      const nextRound = state.currentRound + 1;
      const newRoundSeed = `ARLO-R${nextRound}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const baseSeq = Array.from({ length: state.maxNumber }, (_, i) => i + 1);
      const rng = createPRNG(newRoundSeed);
      let seq = shuffleArray(baseSeq, rng);

      if (state.gameMode === "reverse") {
        seq = Array.from({ length: state.maxNumber }, (_, i) => state.maxNumber - i);
      }

      set({
        currentRound: nextRound,
        seed: newRoundSeed,
        currentTargetNumber: seq[0],
        targetSequence: seq,
        currentStepIndex: 0,
        completedNumbers: [],
        playerScore: 0,
        opponentScore: 0,
        wrongTaps: 0,
        playerHp: 3,
        roundTimeLeft: 60,
        lastRoundWinner: null,
        status: "COUNTDOWN",
      });
    }
  },

  pauseGame: () => {
    sound.playButtonClick();
    set({ status: "PAUSED" });
  },

  resumeGame: () => {
    sound.playButtonClick();
    set({ status: "PLAYING" });
  },

  createRoom: () => {
    sound.playButtonClick();
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
    sound.playButtonClick();
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
    sound.playButtonClick();
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
