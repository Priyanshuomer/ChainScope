import { QueryClient } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  arbitrum,
  base,
  polygon,
  scroll,
} from "@reown/appkit/networks";
import { getWalletRpcEndpoints } from "./lib/rpc-selector";
import * as allNetworks from '@reown/appkit/networks';






// Initialize React Query
export const queryClient = new QueryClient();

// Your Reown Dashboard project ID
export const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || "demo-project-id";

// Optional metadata
export const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://chainscope.app",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Networks to support
export const networks = Object.values(allNetworks); // No 'as const'

// 🔹 Wallet Adapter only — no email/social logins
export const wagmiAdapter = new WagmiAdapter({
  networks: networks as any,
  projectId,
  ssr: true,
});

// 🔹 AppKit Modal — wallets only, analytics ON
export const appKitModal = createAppKit({
  adapters: [wagmiAdapter], // only wallet login
  networks: networks as any,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,          // disable email login
    socials: false,        // disable all social login buttons
  },
});

// 🔹 Add Network to Wallet helper
export const addNetworkToWallet = async (chainData: any) => {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called in a browser environment");
  }

  if (!window.ethereum) {
    throw new Error(
      "No Ethereum wallet detected. Please install MetaMask or another Web3 wallet."
    );
  }

  if (!chainData.chainId || !chainData.name || !chainData.nativeCurrency) {
    throw new Error("Invalid chain data provided");
  }

  const bestRpcUrls = getWalletRpcEndpoints(chainData);
  if (bestRpcUrls.length === 0) {
    throw new Error(
      "No reliable RPC endpoints found for this network. For security reasons, we only add networks with verified RPC endpoints to wallets."
    );
  }

  // Format chainId properly
  let chainIdHex = "";
  try {
    if (typeof chainData.chainId === "string") {
      chainIdHex = chainData.chainId.startsWith("0x")
        ? chainData.chainId
        : `0x${BigInt(chainData.chainId).toString(16)}`;
    } else {
      chainIdHex = `0x${BigInt(chainData.chainId).toString(16)}`;
    }
  } catch {
    throw new Error("Invalid chain ID format. Please report this to ChainScope.");
  }

  // Validate and format native currency
  const nativeCurrency = {
    name: chainData.nativeCurrency.name?.trim() || "Unknown",
    symbol: chainData.nativeCurrency.symbol?.trim().toUpperCase() || "ETH",
    decimals: Number(chainData.nativeCurrency.decimals || 18),
  };
  if (
    isNaN(nativeCurrency.decimals) ||
    nativeCurrency.decimals < 0 ||
    nativeCurrency.decimals > 32
  ) {
    nativeCurrency.decimals = 18;
  }

  // Clean and validate RPC URLs
  const cleanRpcUrls = bestRpcUrls.filter((url) => {
    try {
      new URL(url);
      return url.startsWith("https://") || url.startsWith("http://");
    } catch {
      return false;
    }
  });
  if (cleanRpcUrls.length === 0) {
    throw new Error("No valid RPC URLs found for this network");
  }

  // Clean and validate explorer URLs
  let blockExplorerUrls: string[] | undefined;
  if (chainData.explorers && chainData.explorers.length > 0) {
    const validExplorers = chainData.explorers
      .filter((explorer) => explorer?.url)
      .map((explorer) =>
        explorer.url.endsWith("/") ? explorer.url : explorer.url + "/"
      )
      .filter((url) => {
        try {
          new URL(url);
          return url.startsWith("https://");
        } catch {
          return false;
        }
      });
    if (validExplorers.length > 0) {
      blockExplorerUrls = validExplorers;
    }
  }

  // Clean and validate icon URLs
  let iconUrls: string[] | undefined;
  if (chainData.icon) {
    try {
      new URL(chainData.icon);
      if (chainData.icon.startsWith("https://")) {
        iconUrls = [chainData.icon];
      }
    } catch {
      // Invalid icon URL, skip
    }
  }

  // Prepare network configuration
  const networkConfig = {
    chainId: chainIdHex,
    chainName: chainData.name?.trim() || `Chain ${chainData.chainId}`,
    nativeCurrency,
    rpcUrls: cleanRpcUrls,
    blockExplorerUrls,
    iconUrls,
    ...(chainData.networkId &&
      chainData.networkId !== chainData.chainId && {
        networkId:
          typeof chainData.networkId === "string"
            ? parseInt(chainData.networkId, 16)
            : Number(chainData.networkId),
      }),
  };

  // Validate the network configuration
  if (!chainIdHex.startsWith("0x")) throw new Error("Invalid chain ID format");
  if (!networkConfig.chainName) throw new Error("Invalid network name");
  if (!networkConfig.nativeCurrency.symbol)
    throw new Error("Invalid native currency symbol");
  if (!networkConfig.rpcUrls || networkConfig.rpcUrls.length === 0)
    throw new Error("No valid RPC URLs");

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      throw new Error("WALLET_NOT_CONNECTED");
    }

    // Try switching first
   
  } catch (error: any) {
    const errorMessage = error.message?.toLowerCase() || "";
    const errorCode = error.code;

    if (error.message === "WALLET_NOT_CONNECTED") {
      throw new Error("Please connect your wallet first");
    }
    if (
      errorCode === 4001 ||
      errorMessage.includes("reject") ||
      errorMessage.includes("denied")
    ) {
      throw new Error("You declined to add the network");
    }
    if (errorMessage.includes("already exist") || errorCode === -32603) {
      return;
    }
    if (errorCode === -32002 || errorMessage.includes("pending")) {
      throw new Error("Please check your wallet — you have a pending request");
    }
    if (errorCode === -32602 || errorMessage.includes("invalid")) {
      throw new Error("Network configuration error. Please report this to ChainScope.");
    }
    if (errorCode === -32004 || errorMessage.includes("unsupported")) {
      throw new Error("This network is not supported by your wallet");
    }
    if (errorMessage.includes("timeout")) {
      throw new Error("Request timed out. Please check your connection and try again");
    }
    throw new Error(
      `Failed to add network: ${error.message}. Please try again or report this issue.`
    );
  }
};
