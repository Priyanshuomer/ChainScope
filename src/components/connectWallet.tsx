import React, { useState } from "react";
import { useWallet } from "../contexts/walletContext";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import WalletSelectModal from "./walletSelectModal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useToast } from "@/hooks/use-toast";

export function ConnectWalletButton() {
  const { session, pair, disconnect, connecting, walletkit, connectedWallet, setConnectedWallet } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const handleWalletSelect = async (wallet: string) => {
    if (wallet === "metamask") {
      if ((window as any).ethereum) {
        try {
          await (window as any).ethereum.request({ method: "eth_requestAccounts" });
          setConnectedWallet("MetaMask");
          toast({
            title: "Wallet Connected",
            description: "MetaMask has been successfully connected.",
          });
        } catch (error: any) {
          if (error.code === 4001) {
            toast({
              title: "Connection Rejected",
              description: "You rejected the MetaMask connection request.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to connect MetaMask.",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask extension to connect.",
          variant: "destructive",
        });
      }
    }

    if (wallet === "coinbase") {
      try {
        const APP_NAME = "My Reown App";
        const APP_LOGO_URL = "https://example.com/logo.png";
        const DEFAULT_ETH_JSONRPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_KEY";
        const DEFAULT_CHAIN_ID = 1;

        const coinbaseWallet = new CoinbaseWalletSDK({
          appName: APP_NAME,
          appLogoUrl: APP_LOGO_URL,
          darkMode: false,
        });

        const ethereum = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID);
        await ethereum.request({ method: "eth_requestAccounts" });
        setConnectedWallet("Coinbase Wallet");
        toast({
          title: "Wallet Connected",
          description: "Coinbase Wallet has been successfully connected.",
        });
      } catch (error: any) {
        if (error.code === 4001) {
          toast({
            title: "Connection Rejected",
            description: "You rejected the Coinbase Wallet connection request.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to connect Coinbase Wallet.",
            variant: "destructive",
          });
        }
      }
    }

    if (wallet === "walletconnect") {
      if (walletkit) {
        try {
          const topic = await walletkit.core.pairing.create();
          const uri = topic.uri;
          await pair(uri);
          setConnectedWallet("WalletConnect");
          toast({
            title: "Wallet Connected",
            description: "WalletConnect has been successfully connected.",
          });
        } catch (error: any) {
          if (error.code === 4001) {
            toast({
              title: "Connection Rejected",
              description: "You rejected the WalletConnect request.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to connect WalletConnect.",
              variant: "destructive",
            });
          }
        }
      }
    }

    setShowModal(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setConnectedWallet(null);
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  if (connectedWallet || session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="text-xs" title="Wallet connected">
          <Wallet className="h-3 w-3 mr-1" />
          {connectedWallet || "Wallet Connected"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          title="Disconnect wallet"
          className="bg-red-500 text-white h-8 w-8 p-0 rounded-full"
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
        disabled={connecting}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        title="Connect Wallet"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <WalletSelectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleWalletSelect}
      />
    </>
  );
}

export default ConnectWalletButton;
