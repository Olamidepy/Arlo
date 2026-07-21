"use client";

import React from "react";
import { useGameStore } from "../lib/store/gameStore";
import { LandingHero } from "../components/landing/LandingHero";
import { HomeDashboard } from "../components/dashboard/HomeDashboard";
import { WaitingLobby } from "../components/lobby/WaitingLobby";
import { GameScreen } from "../components/game/GameScreen";
import { ResultsModal } from "../components/game/ResultsModal";
import { LeaderboardView } from "../components/dashboard/LeaderboardView";
import { WalletDrawer } from "../components/dashboard/WalletDrawer";
import { ProfileView } from "../components/dashboard/ProfileView";

export default function Page() {
  const { activeScreen } = useGameStore();

  switch (activeScreen) {
    case "LANDING":
      return <LandingHero />;
    case "HOME":
      return <HomeDashboard />;
    case "LOBBY":
      return <WaitingLobby />;
    case "GAME":
      return <GameScreen />;
    case "RESULTS":
      return (
        <div className="relative min-h-screen">
          <GameScreen />
          <ResultsModal />
        </div>
      );
    case "LEADERBOARD":
      return <LeaderboardView />;
    case "WALLET":
      return <WalletDrawer />;
    case "PROFILE":
      return <ProfileView />;
    default:
      return <LandingHero />;
  }
}
