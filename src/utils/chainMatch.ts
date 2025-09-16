import { MergedChainData } from "@/types/chain" // use your actual path

export function doesChainMatchTag(chain: MergedChainData, tag: string): boolean {
  // Chain names: match by normalized name or shortName
  if (
    tag.toLowerCase() === chain.name?.toLowerCase() ||
    tag.toLowerCase() === chain.shortName?.toLowerCase()
  ) return true;

  // ENS: check for ens registry or resolver
  if (tag.toLowerCase() === "ens") {
    return !!(chain.ens?.registry || chain.ens?.resolverAddress)
  }

  // EVM compatibility: look for "EVM" in tags or features
  if (tag.toLowerCase() === "evm") {
    return (
      chain.tags?.includes("EVM") ||
      chain.features?.some((f: any) =>
        typeof f === "string"
          ? f.toLowerCase().includes("evm")
          : f?.name?.toLowerCase().includes("evm")
      )
    )
  }

  // Verified: check for verified field
  if (tag.toLowerCase() === "verified") {
    return !!chain.verified
  }

  // Mainnet/Testnet: isTestnet boolean
  if (tag.toLowerCase() === "mainnet") return !chain.isTestnet
  if (tag.toLowerCase() === "testnet") return !!chain.isTestnet

  // L2: search tags/features
  if (tag.toLowerCase() === "l2") {
    return (
      chain.tags?.some(t => t.toLowerCase().includes("l2")) ||
      chain.features?.some((f: any) =>
        typeof f === "string"
          ? f.toLowerCase().includes("l2")
          : f?.name?.toLowerCase().includes("l2")
      )
    )
  }

  // RPC: must have at least 1 endpoint
  if (tag.toLowerCase() === "rpc") {
    return chain.rpc?.length > 0 || chain.rpcEndpoints?.length > 0
  }

  // Bridge: check features/bridges
  if (tag.toLowerCase() === "bridge") {
    return (
      chain.features?.some((f: any) =>
        typeof f === "string"
          ? f.toLowerCase().includes("bridge")
          : f?.name?.toLowerCase().includes("bridge")) ||
      (chain.bridges && chain.bridges.length > 0)
    )
  }

  // Privacy: look in tags/features
  if (tag.toLowerCase() === "privacy") {
    return (
      chain.tags?.some(t => t.toLowerCase().includes("privacy")) ||
      chain.features?.some((f: any) =>
        typeof f === "string"
          ? f.toLowerCase().includes("privacy")
          : f?.name?.toLowerCase().includes("privacy"))
    )
  }

  // Fallback: check tags, name, shortName, chain string
  return [
    ...(chain.tags ?? []),
    chain.name,
    chain.shortName,
    chain.chain
  ]
    .filter(Boolean)
    .map(v => v.toLowerCase())
    .includes(tag.toLowerCase());
}
