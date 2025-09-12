// /lib/sorted-rpc.ts
import { scoreRpcEndpoint } from '@/lib/rpc-selector'
import { MergedChainData } from '@/types/chain'

/**
 * Returns a sorted array of RPC endpoints with all metadata
 * (score, latency, status, etc.)
 */
export const getSortedRpcEndpoints = (chain: MergedChainData) => {
  if (!chain.rpc || chain.rpc.length === 0) return []

  return chain.rpc
    .map(rpc => {
      const rpcEndpoint = chain.rpcEndpoints?.find(ep => ep.url === rpc)
      return {
        url: rpc,
        status: rpcEndpoint?.status || 'unknown',
        latency: rpcEndpoint?.latency,
        endpoint: rpcEndpoint,
        score: scoreRpcEndpoint(rpcEndpoint || rpc)
      }
    })
    .sort((a, b) => {
      // sort by score
      if (a.score !== b.score) return b.score - a.score

      // status priority
      const statusPriority: Record<string, number> = {
        online: 0,
        slow: 1,
        offline: 2,
        unknown: 3
      }
      const statusDiff = statusPriority[a.status] - statusPriority[b.status]
      if (statusDiff !== 0) return statusDiff

      // latency
      if (a.latency && b.latency) return a.latency - b.latency
      if (a.latency && !b.latency) return -1
      if (!a.latency && b.latency) return 1

      // fallback alphabetical
      return a.url.localeCompare(b.url)
    })
}
