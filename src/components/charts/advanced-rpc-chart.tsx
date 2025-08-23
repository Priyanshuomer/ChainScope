import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Clock,
  Globe,
  Eye,
  AlertTriangle
} from "lucide-react"
import { MergedChainData } from "@/types/chain"

interface AdvancedRpcChartProps {
  chain: MergedChainData
}

export function AdvancedRpcChart({ chain }: AdvancedRpcChartProps) {
  // Mock performance data - in real app this would come from monitoring
  const performanceData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    latency: Math.floor(Math.random() * 200) + 50,
    uptime: Math.floor(Math.random() * 10) + 90,
    requests: Math.floor(Math.random() * 1000) + 100
  }))

  const rpcHealthData = chain.rpc.slice(0, 8).map((rpc, index) => {
    const url = new URL(rpc)
    return {
      name: url.hostname.length > 20 ? url.hostname.substring(0, 20) + '...' : url.hostname,
      latency: Math.floor(Math.random() * 300) + 50,
      uptime: Math.floor(Math.random() * 20) + 80,
      privacy: Math.floor(Math.random() * 40) + 60,
      status: Math.random() > 0.2 ? 'online' : 'offline'
    }
  })

  const networkDistribution = [
    { name: 'Healthy RPCs', value: rpcHealthData.filter(r => r.status === 'online').length, color: '#10b981' },
    { name: 'Slow RPCs', value: rpcHealthData.filter(r => r.latency > 200).length, color: '#f59e0b' },
    { name: 'Offline RPCs', value: rpcHealthData.filter(r => r.status === 'offline').length, color: '#ef4444' }
  ]

  const averageLatency = rpcHealthData.reduce((acc, rpc) => acc + rpc.latency, 0) / rpcHealthData.length
  const averageUptime = rpcHealthData.reduce((acc, rpc) => acc + rpc.uptime, 0) / rpcHealthData.length

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Latency</p>
                <p className="text-2xl font-bold text-primary">{averageLatency.toFixed(0)}ms</p>
                <div className="flex items-center gap-1 mt-1">
                  {averageLatency < 150 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {averageLatency < 150 ? 'Excellent' : 'Needs improvement'}
                  </span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Uptime</p>
                <p className="text-2xl font-bold text-success">{averageUptime.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-success" />
                  <span className="text-xs text-muted-foreground">Last 24h</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-success/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Privacy Score</p>
                <p className="text-2xl font-bold text-warning">
                  {chain.rpcHealth?.privacyScore || 75}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-warning" />
                  <span className="text-xs text-muted-foreground">Anonymous RPCs</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-warning/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            24-Hour Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#3b82f6" 
                  fill="url(#latencyGradient)"
                  strokeWidth={2}
                  name="Latency (ms)"
                />
                <Area 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="#10b981" 
                  fill="url(#uptimeGradient)"
                  strokeWidth={2}
                  name="Uptime (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* RPC Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-success" />
              RPC Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rpcHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="latency" fill="#3b82f6" name="Latency (ms)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="uptime" fill="#10b981" name="Uptime (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Network Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={networkDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {networkDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {networkDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Analysis */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-warning" />
            Privacy & Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rpcHealthData.slice(0, 5).map((rpc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{rpc.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground">Privacy:</div>
                      <Progress value={rpc.privacy} className="w-16 h-2" />
                      <span className="text-xs font-medium">{rpc.privacy}%</span>
                    </div>
                    <Badge 
                      variant={rpc.status === 'online' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {rpc.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{rpc.latency}ms</div>
                  <div className="text-xs text-muted-foreground">{rpc.uptime}% uptime</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Privacy Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  Consider using RPCs with higher privacy scores for sensitive transactions. 
                  Avoid RPCs that may log your IP address or transaction data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}