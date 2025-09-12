import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { MergedChainData } from "@/types/chain";

interface ChainIconProps {
  chain: MergedChainData;
  size?: number;
}


export const ChainIcon: React.FC<ChainIconProps> = ({ chain, size = 32 }) => {
return <Globe className="text-primary" style={{ width: size, height: size }} />
}

// export const ChainIcon: React.FC<ChainIconProps> = ({ chain, size = 32 }) => {
//   const [imgSrc, setImgSrc] = useState<string | null>(null);

//   useEffect(() => {
//     if (!chain || !chain.icon) {
//       setImgSrc(null);
//       return;
//     }

//     // Use the RAW GitHub URL for SVGs
//     const url = `https://raw.githubusercontent.com/web3sdks/chain-icons/main/svg/${chain.icon.toLowerCase()}.svg`;
//     setImgSrc(url);
//   }, [chain]);

//   return imgSrc ? (
//     <img
//       src={imgSrc}
//       alt={chain.name}
//       className="rounded object-contain"
//       style={{ width: size, height: size }}
//       onError={() => setImgSrc(null)} // fallback to Globe
//     />
//   ) : (
    
//   );
// };
