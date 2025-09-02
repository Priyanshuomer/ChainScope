import React from "react";

const wallets = [
  { id: "metamask", name: "MetaMask", icon: "/metamask.svg" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "/coinbase.svg" },
  { id: "walletconnect", name: "WalletConnect", icon: "/walletconnect.svg" }
];

interface WalletSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (wallet: string) => void;
}

export default function WalletSelectModal({ open, onClose, onSelect }: WalletSelectModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-90 min-h-screen"
      aria-modal="true"
      role="dialog"
      aria-labelledby="wallet-modal-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white text-3xl font-bold"
        >
          &times;
        </button>

        <h3
          id="wallet-modal-title"
          className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100"
        >
          Connect Your Wallet
        </h3>

        <div className="flex flex-col gap-4">
          {wallets.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => {
                onSelect(wallet.id);
                onClose();
              }}
              className="flex items-center w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 mr-4">
                <img src={wallet.icon} alt={wallet.name} className="h-8 w-8" />
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">
                {wallet.name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-2 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
