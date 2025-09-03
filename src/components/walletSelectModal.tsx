import React from "react";

const wallets = [
  { id: "metamask", name: "MetaMask", icon: "/metamask.svg" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "/coinbase.svg" },
  { id: "trustwallet", name: "Trust Wallet", icon: "/trustwallet.jpg" },
  { id: "rainbow", name: "Rainbow Wallet", icon: "/rainbow.jpg" },
  { id: "argent", name: "Argent", icon: "/argent.jpeg" },
  { id: "zerion", name: "Zerion", icon: "/zerion.png" },
  { id: "gnosis", name: "Gnosis Safe", icon: "/gnosis.jpeg" },
  { id: "okx", name: "OKX Wallet", icon: "/okx.jpeg" },
  { id: "binance", name: "Binance Wallet", icon: "/binance.jpeg" }
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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-xs w-full relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white text-xl font-bold transition"
        >
          &times;
        </button>

        <h3
          id="wallet-modal-title"
          className="text-md font-semibold mb-3 text-center text-gray-900 dark:text-gray-100"
        >
          Connect Wallet
        </h3>

        <div className="flex flex-col gap-2">
          {wallets.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => {
                onSelect(wallet.id);
                onClose();
              }}
              className="flex items-center w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm 
                         transition-all duration-200 ease-in-out 
                         hover:shadow-lg hover:scale-[1.03] hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 mr-2 transition-transform duration-200 group-hover:rotate-6">
                <img src={wallet.icon} alt={wallet.name} className="h-6 w-6" />
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                {wallet.name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-1.5 rounded-md bg-red-100 text-red-600 font-semibold text-sm 
                     transition-all duration-200 
                     hover:bg-red-200 hover:scale-[1.02] dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
