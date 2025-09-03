import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { WalletKit } from "@reown/walletkit";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { walletConnectCore } from "../wallet/core"; // import singleton Core

type WalletKitInstance = InstanceType<typeof WalletKit>;
type Session = any;

interface WalletContextProps {
  walletkit: WalletKitInstance | null;
  session: Session | null;
  connecting: boolean;
  connectedWallet: string | null;
  setConnectedWallet: (wallet: string | null) => void;
  pair: (uri: string) => Promise<string[]>; // 🔹 returns accounts
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletkit, setWalletkit] = useState<WalletKitInstance | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    const initWallet = async () => {
      const wallet = await WalletKit.init({
        core: walletConnectCore,
        metadata: {
          name: "My Reown Vite TS App",
          description: "Demo React Vite TypeScript app with Reown Wallet",
          url: "http://localhost:8080", // or your deployed URL
          icons: [],
        },
      });

      setWalletkit(wallet);

      // Show QR when pairing
      (wallet as any).on("display_uri", (uri: string) => {
        QRCodeModal.open(uri, () => {
          QRCodeModal.close();
        });
      });

      // Handle approved session
      wallet.on("session_proposal", async (proposal) => {
        const namespaces = {
          eip155: {
            accounts: [
              "eip155:1:0x0000000000000000000000000000000000000000",
            ],
            methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
            events: ["accountsChanged", "chainChanged"],
          },
        };

        const approvedSession = await wallet.approveSession({
          id: proposal.id,
          namespaces,
        });

        setSession(approvedSession);
        QRCodeModal.close();
      });

      // Handle disconnect
      wallet.on("session_delete", () => {
        setSession(null);
      });
    };

    initWallet();
  }, []);

  // 🔹 Pair and return accounts
  const pair = async (uri: string): Promise<string[]> => {
    if (!walletkit) return [];
    setConnecting(true);

    await walletkit.pair({ uri });

    // Wait until session is available
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (session?.namespaces?.eip155?.accounts?.length) {
          clearInterval(interval);
          setConnecting(false);

          // Map to plain addresses (remove "eip155:1:")
          const accounts = session.namespaces.eip155.accounts.map((acc: string) =>
            acc.split(":").pop()!
          );
          resolve(accounts);
        }
      }, 500);
    });
  };

  const disconnect = async () => {
    if (walletkit && session) {
      await walletkit.disconnectSession({
        topic: session.topic,
        reason: {
          code: 6000,
          message: "User disconnected",
        },
      });
      setSession(null);
    }
    setConnectedWallet(null);
  };

  return (
    <WalletContext.Provider
      value={{
        walletkit,
        session,
        connecting,
        connectedWallet,
        setConnectedWallet,
        pair,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
