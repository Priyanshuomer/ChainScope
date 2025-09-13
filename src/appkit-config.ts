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

import * as chains from "viem/chains";

// Only pick chain objects
const viemChains = Object.values(chains).filter(
  (c: any) => c && typeof c === "object" && "id" in c
);

export const networks = viemChains as any;





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
  // url : "http:localhost:8080",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Networks to support
// export const networks = [mainnet, arbitrum, base, scroll, polygon] as const;

// 🔹 Wallet Adapter only — no email/social logins
export const wagmiAdapter = new WagmiAdapter({
  networks: networks as any,
  projectId,
  ssr: true,
  allowUnknownChains: true,
} as any); // 👈 cast whole object to any


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



// ---- Add this helper at the top of your file ----
// const checkRpcHealth = async (url: string, timeout = 3000): Promise<boolean> => {
//   try {
//     // Minimal eth_chainId request (works on all RPCs)
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), timeout);

//     const response = await fetch(url, {
//       method: 'POST',
//       body: JSON.stringify({
//         jsonrpc: '2.0',
//         id: 1,
//         method: 'eth_chainId',
//         params: []
//       }),
//       headers: { 'Content-Type': 'application/json' },
//       signal: controller.signal
//     });

//     clearTimeout(timer);
//     if (!response.ok) return false;

//     const data = await response.json();
//     return !!data.result; // must return a chainId
//   } catch {
//     return false; // any error = unhealthy
//   }
// };




// utils/rpcHealth.ts



// 🔹 Add Network to Wallet helper
// ---- Replace your whole addNetworkToWallet with this ----

import { getSortedRpcEndpoints } from "@/lib/sorted-rpc";
const ethereum = window.ethereum as any;

import { checkRpcHealth } from "@/lib/check-rpc-health"; // make sure you have this util

export const addNetworkToWallet = async (chainData: any) => {
   console.log("addNetworkToWallet called with:");
  if (typeof window === "undefined") {
    throw new Error("This function can only be called in a browser environment");
  }

  if (!ethereum) {
    throw new Error("No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.");
  }

  if (!chainData.chainId || !chainData.name || !chainData.nativeCurrency) {
    throw new Error("Invalid chain data provided");
  }

  /**
   * ✅ Use your sorted RPC selector (UI logic reused here)
   * sortedRpcEndpoints already contains .url, .status, .latency, .score
   */
  const sortedRpcEndpoints = getSortedRpcEndpoints(chainData);

  if (sortedRpcEndpoints.length === 0) {
    throw new Error("No RPC endpoints found for this network");
  }

  // Only take the URLs for health check
  const candidateRpcUrls = sortedRpcEndpoints.map((ep) => ep.url);

  // ✅ New: Health-check each RPC (limit to 5)
  const healthyRpcUrls: string[] = [];
  for (const rpc of candidateRpcUrls) {
    if (healthyRpcUrls.length >= 5) break;
    try {
      const isHealthy = await checkRpcHealth(rpc, 3000); // 3s timeout
      if (isHealthy) healthyRpcUrls.push(rpc);
    } catch {
      // swallow errors, we’ll handle below
    }
  }

  if (healthyRpcUrls.length === 0) {
    throw new Error("No healthy RPC endpoints responded. Cannot add this network.");
  }

  // ✅ Format chainId properly
  let chainIdHex = "";
  try {
    if (typeof chainData.chainId === "string") {
      if (chainData.chainId.startsWith("0x")) {
        chainIdHex = chainData.chainId;
      } else {
        chainIdHex = `0x${BigInt(chainData.chainId).toString(16)}`;
      }
    } else {
      chainIdHex = `0x${BigInt(chainData.chainId).toString(16)}`;
    }
  } catch {
    throw new Error("Invalid chain ID format. Please report this to ChainScope.");
  }

  // ✅ Validate and format native currency
  const nativeCurrency = {
    name: chainData.nativeCurrency.name?.trim() || "Unknown",
    symbol: chainData.nativeCurrency.symbol?.trim().toUpperCase() || "ETH",
    decimals: Number(chainData.nativeCurrency.decimals || 18),
  };
  if (isNaN(nativeCurrency.decimals) || nativeCurrency.decimals < 0 || nativeCurrency.decimals > 32) {
    nativeCurrency.decimals = 18;
  }

  // ✅ Clean and validate RPC URLs (use the healthy ones)
  const cleanRpcUrls = healthyRpcUrls.filter((url) => {
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

  // ✅ Clean and validate explorer URLs
  let blockExplorerUrls: string[] | undefined = undefined;
  if (chainData.explorers && chainData.explorers.length > 0) {
    const validExplorers = chainData.explorers
      .filter((explorer: any) => explorer?.url)
      .map((explorer: any) => {
        let url = explorer.url;
        if (!url.endsWith("/")) url += "/";
        return url;
      })
      .filter((url: string) => {
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

  // ✅ Clean and validate icon URLs
  let iconUrls: string[] | undefined = undefined;
  if (chainData.icon) {
    try {
      new URL(chainData.icon);
      if (chainData.icon.startsWith("https://")) {
        iconUrls = [chainData.icon];
      }
    } catch {
      // skip invalid icon URL
    }
  }

  // ✅ Prepare network configuration
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

  // ✅ Extra validation
  if (!chainIdHex || !chainIdHex.startsWith("0x")) {
    throw new Error("Invalid chain ID format");
  }
  if (!networkConfig.chainName || networkConfig.chainName.trim() === "") {
    throw new Error("Invalid network name");
  }
  if (!networkConfig.nativeCurrency.symbol || networkConfig.nativeCurrency.symbol.trim() === "") {
    throw new Error("Invalid native currency symbol");
  }
  if (!networkConfig.rpcUrls || networkConfig.rpcUrls.length === 0) {
    throw new Error("No valid RPC URLs");
  }

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      throw new Error("WALLET_NOT_CONNECTED");
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902 || switchError.code === -32603) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networkConfig],
        });

        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
          });
          return true;
        } catch {
          throw new Error("Failed to verify network addition");
        }
      }
      throw switchError;
    }
  } catch (error: any) {
    const errorMessage = error.message?.toLowerCase() || "";
    const errorCode = error.code;

    if (error.message === "WALLET_NOT_CONNECTED") {
      throw new Error("Please connect your wallet first");
    }
    if (errorCode === 4001 || errorMessage.includes("reject") || errorMessage.includes("denied")) {
      throw new Error("You declined to add the network");
    }
    if (errorMessage.includes("already exist") || errorCode === -32603) {
      return; // already exists
    }
    if (errorCode === -32002 || errorMessage.includes("pending")) {
      throw new Error("Please check your wallet - you have a pending request");
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
    throw new Error(`Failed to add network: ${error.message}. Please try again or report this issue.`);
  }
};

