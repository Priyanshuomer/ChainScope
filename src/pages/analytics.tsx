import React from "react"
import { Globe, ShieldCheck, CheckCircle, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useMergedChainStats } from "@/hooks/useChains"
import { Loader2 } from "lucide-react"

const Analytics: React.FC = () => {
  const { data: stats, isLoading } = useMergedChainStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground px-6"> {/* Removed all vertical padding */}
      {/* Page Header */}
      <div className="flex flex-col items-center"> {/* Removed margin */}

        {/* Header content (commented out) */}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Reduced grid gap slightly */}
        {/* Total Networks */}
        <Card className="bg-card p-6 rounded-xl border">
          <CardContent className="flex flex-col gap-3"> {/* Reduced internal gaps*/}
            <div className="flex items-center justify-between">
              <Globe className="w-6 h-6 text-green-500" />
              <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">
                Total Networks
              </span>
            </div>
            <h2 className="text-3xl font-bold">{stats?.totalChains ?? 0}</h2>
            <Progress value={100} className="h-2 bg-muted" />
            <p className="text-sm text-muted-foreground">
              {stats?.totalRpcs ?? 0} RPC endpoints
            </p>
          </CardContent>
        </Card>

        {/* Mainnet */}
        <Card className="bg-card p-6 rounded-xl border">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">
                Mainnet
              </span>
            </div>
            <h2 className="text-3xl font-bold">{stats?.mainnetChains ?? 0}</h2>
            <Progress
              value={
                stats && stats.totalChains
                  ? (stats.mainnetChains / stats.totalChains) * 100
                  : 0
              }
              className="h-2 bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              {stats && stats.totalChains
                ? `${Math.round(
                    (stats.mainnetChains / stats.totalChains) * 100
                  )}% of total`
                : ""}
            </p>
          </CardContent>
        </Card>

        {/* Verified */}
        <Card className="bg-card p-6 rounded-xl border">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-6 h-6 text-yellow-500" />
              <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            </div>
            <h2 className="text-3xl font-bold">{stats?.verifiedChains ?? 0}</h2>
            <Progress
              value={
                stats && stats.totalChains
                  ? (stats.verifiedChains / stats.totalChains) * 100
                  : 0
              }
              className="h-2 bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              {stats && stats.totalChains
                ? `${Math.round(
                    (stats.verifiedChains / stats.totalChains) * 100
                  )}% verification rate`
                : ""}
            </p>
          </CardContent>
        </Card>

        {/* Layer 2 */}
        <Card className="bg-card p-6 rounded-xl border">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Layers className="w-6 h-6 text-green-500" />
              <span className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full">
                Layer 2
              </span>
            </div>
            <h2 className="text-3xl font-bold">{stats?.l2Chains ?? 0}</h2>
            <Progress
              value={
                stats && stats.totalChains
                  ? (stats.l2Chains / stats.totalChains) * 100
                  : 0
              }
              className="h-2 bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              {stats && stats.totalChains
                ? `${Math.round(
                    (stats.l2Chains / stats.totalChains) * 100
                  )}% of total`
                : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
