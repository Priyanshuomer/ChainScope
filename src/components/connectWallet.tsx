import React, { useState } from "react";
import { useWallet } from "../contexts/walletContext";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import WalletSelectModal from "./walletSelectModal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useToast } from "@/hooks/use-toast";
import { QRCodeCanvas } from "qrcode.react";

// ----------------- Helper to connect MetaMask -----------------
async function connectMetaMask(): Promise<string[]> {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts;
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("MetaMask Not Found");
  }
}

// ----------------- Helper to connect Coinbase -----------------
async function connectCoinbase(): Promise<string[]> {
  const APP_NAME = "My Reown App";
  const APP_LOGO_URL = "https://example.com/logo.png";
  const DEFAULT_ETH_JSONRPC_URL =
    "https://mainnet.infura.io/v3/YOUR_INFURA_KEY";
  const DEFAULT_CHAIN_ID = 1;

  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false,
  });

  const ethereum = coinbaseWallet.makeWeb3Provider(
    DEFAULT_ETH_JSONRPC_URL,
    DEFAULT_CHAIN_ID
  );

  try {
    const accounts: string[] = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts;
  } catch (error) {
    throw error;
  }
}

export function ConnectWalletButton() {
  const {
    session,
    pair,
    disconnect,
    connecting,
    walletkit,
    connectedWallet,
    setConnectedWallet,
  } = useWallet();

  const [showModal, setShowModal] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [wcUri, setWcUri] = useState<string | null>(null); // WalletConnect QR
  const [isConnecting, setIsConnecting] = useState(false); // local connecting state
  const { toast } = useToast();

  // ------------------- WALLET SELECT -------------------
  const handleWalletSelect = async (wallet: string) => {
    // 🔹 MetaMask
    if (wallet === "metamask") {
      try {
        setIsConnecting(true);
        const accounts = await connectMetaMask();
        const address = accounts[0];
        setConnectedWallet("MetaMask");
        setConnectedAddress(address);
        toast({
          title: "Wallet Connected",
          description: `MetaMask: ${address.slice(0, 6)}...${address.slice(-4)}`,
          variant: "success",
        });
      } catch (error: any) {
        toast({
          title: error?.code === 4001 ? "Connection Rejected" : "Error",
          description:
            error?.code === 4001
              ? "You rejected the MetaMask connection request."
              : error.message || "Failed to connect MetaMask.",
          variant: "destructive",
        });
      } finally {
        setIsConnecting(false);
      }
    }

    // 🔹 Coinbase
    if (wallet === "coinbase") {
      try {
        setIsConnecting(true);
        const accounts = await connectCoinbase();
        const address = accounts[0];
        setConnectedWallet("Coinbase Wallet");
        setConnectedAddress(address);
        toast({
          title: "Wallet Connected",
          description: `Coinbase: ${address.slice(0, 6)}...${address.slice(-4)}`,
          variant: "success",
        });
      } catch (error: any) {
        toast({
          title: error?.code === 4001 ? "Connection Rejected" : "Error",
          description:
            error?.code === 4001
              ? "You rejected the Coinbase Wallet connection request."
              : error.message || "Failed to connect Coinbase Wallet.",
          variant: "destructive",
        });
      } finally {
        setIsConnecting(false);
      }
    }

    // 🔹 WalletConnect (Rainbow, TrustWallet, Argent, Zerion, Gnosis)
    if (
      ["walletconnect", "rainbow", "trustwallet", "argent", "zerion", "gnosis"].includes(wallet)
    ) {
      if (walletkit?.core?.pairing) {
        try {
          setIsConnecting(true);
          const topic = await walletkit.core.pairing.create();
          const uri = topic.uri;
          setWcUri(uri); // Show QR modal

          toast({
            title: "Scan QR",
            description: `Open ${wallet} app and scan the QR code.`,
            variant: "success",
          });

          const accounts = (await pair(uri)) as string[];
          if (accounts?.length > 0) {
            const address = accounts[0];
            setConnectedWallet(wallet);
            setConnectedAddress(address);
            setWcUri(null);
            toast({
              title: "Wallet Connected",
              description: `${wallet}: ${address.slice(0, 6)}...${address.slice(-4)}`,
              variant: "success",
            });
          }
        } catch (error: any) {
          setWcUri(null);
          toast({
            title: error?.code === 4001 ? "Connection Rejected" : "Error",
            description:
              error?.code === 4001
                ? `You rejected the ${wallet} connection request.`
                : error.message || `Failed to connect ${wallet}.`,
            variant: "destructive",
          });
        } finally {
          setIsConnecting(false);
        }
      }
    }

    setShowModal(false);
  };

  // ------------------- DISCONNECT -------------------
  const handleDisconnect = () => {
    disconnect();
    setConnectedWallet(null);
    setConnectedAddress(null);
    setIsConnecting(false);
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
  };

  // ------------------- COPY ADDRESS -------------------
  const handleCopyAddress = async () => {
    if (connectedAddress) {
      await navigator.clipboard.writeText(connectedAddress);
      toast({
        title: "Address Copied",
        description: `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`,
        variant: "success",
      });
    }
  };

  // ------------------- UI -------------------
  if (connectedWallet || session) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Click to copy address"
          onClick={handleCopyAddress}
        >
          <Wallet className="h-3 w-3" />
          <span>
            {connectedWallet}{" "}
            {connectedAddress
              ? `(${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)})`
              : ""}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          title="Disconnect wallet"
          className="bg-red-500 text-white h-8 w-8 p-0 rounded-full hover:bg-red-600"
        >
          <LogOut className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className="bg-gradient-to-r from-green-400 to-green-400 text-gray-900 hover:from-green-600 hover:to-green-500 "
        title="Connect Wallet"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <WalletSelectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleWalletSelect}
      />

      {/* 🔹 WalletConnect QR Modal */}
{wcUri && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    style={{
      pointerEvents: "auto",
      minHeight: "100vh",
      minWidth: "100vw",
    }}
  >
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-xs w-full mx-auto text-center flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Scan with your wallet
      </h3>
      <div className="flex justify-center items-center w-full h-full">
        <QRCodeCanvas value={wcUri} size={240} includeMargin />
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Open your wallet app (Rainbow, Trust, Argent...) and scan this QR code.
      </p>
      <Button
        variant="ghost"
        onClick={() => {
          setWcUri(null);
          setIsConnecting(false);
        }}
        className="mt-4 text-red-500 hover:text-red-600"
      >
        Cancel
      </Button>
    </div>
  </div>
)}

    </>
  );
}

export default ConnectWalletButton;
