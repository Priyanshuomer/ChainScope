import { useFavorites } from "@/hooks/useLocalStorage";
import { FavoritesModal } from "./favorites-modal";
import { WalletConnectButton } from "./wallet-connect-button";
import { MobileOptimizedHeader } from "./mobile-optimized-header";

export function Header() {
  return <MobileOptimizedHeader />;
}