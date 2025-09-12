import { useDisconnect } from "@reown/appkit/react";

function DisconnectWallet() {
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    try {
      await disconnect(); // disconnects from all connected namespaces
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <button
      onClick={handleDisconnect}
      className="
        inline-flex items-center p-1
        text-red-600 hover:text-red-800
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-red-400 mr-1
      "
      title="Disconnect Wallet"
    >
      {/* SVG arrow icon with thicker stroke */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={6}  // increased stroke width for bolder arrow
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
      </svg>
    </button>
  );
}

export default DisconnectWallet;
