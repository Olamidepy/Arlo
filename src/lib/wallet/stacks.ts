/**
 * Stacks Leather Wallet Integration Module
 * Supports connecting Leather wallet, retrieving STX addresses, and handling guest mode transactions.
 */

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  stxBalance: number;
  walletName: string;
  isGuest: boolean;
}

export const GUEST_INITIAL_STATE: WalletState = {
  isConnected: true,
  address: "SP2GUEST...3948",
  stxBalance: 25.0,
  walletName: "Guest Mode",
  isGuest: true,
};

/**
 * Checks if Leather Wallet extension is available in user's browser
 */
export function isLeatherInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof (window as unknown as { LeatherProvider?: unknown }).LeatherProvider !== "undefined" ||
    typeof (window as unknown as { StacksProvider?: unknown }).StacksProvider !== "undefined"
  );
}

/**
 * Request Leather wallet connection
 */
export async function connectLeatherWallet(): Promise<WalletState> {
  if (typeof window === "undefined") return GUEST_INITIAL_STATE;

  try {
    const leather = (window as unknown as { LeatherProvider?: { request: (method: string) => Promise<unknown> } }).LeatherProvider;

    if (leather) {
      const response = (await leather.request("getAddresses")) as {
        result?: { addresses?: { symbol: string; address: string }[] };
      };
      const stxAddress = response?.result?.addresses?.find((a) => a.symbol === "STX")?.address;

      if (stxAddress) {
        return {
          isConnected: true,
          address: stxAddress,
          stxBalance: 124.5,
          walletName: "Leather Wallet",
          isGuest: false,
        };
      }
    }
  } catch (err) {
    console.warn("Leather wallet connection bypassed or cancelled:", err);
  }

  // Fallback to guest wallet if wallet popup cancelled or not installed
  return {
    ...GUEST_INITIAL_STATE,
    address: `SP${Math.random().toString(36).substring(2, 8).toUpperCase()}...STX`,
  };
}
