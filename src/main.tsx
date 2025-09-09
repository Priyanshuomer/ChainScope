import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import './index.css';
import { WalletProvider } from "./contexts/walletContext"; // Import WalletProvider

import { AppKitProvider } from './providers/appKitProvider.tsx'
import './lib/core-web-vitals';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppKitProvider>
      <App />
    </AppKitProvider>
  </React.StrictMode>
);
