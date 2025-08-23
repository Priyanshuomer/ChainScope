import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { RpcEndpoint } from "@/types/chain"
import { Activity, Shield, Zap } from "lucide-react"

interface RpcPerformanceChartProps {
  rpcEndpoints: RpcEndpoint[]
}

export const RpcPerformanceChart = ({ rpcEndpoints }: RpcPerformanceChartProps) => {
  // Prepare latency data for line chart
  const latencyData = rpcEndpoints
    .filter(rpc => rpc.latency)
    .map((rpc, index) => ({
      name: `RPC ${index + 1}`,
      latency: rpc.latency,
      score: rpc.score || 0,
      url: rpc.url.split('/').pop() || 'Unknown'
    }))

  // Prepare privacy data for pie chart
  const privacyData = [
    { name: 'High Privacy', value: rpcEndpoints.filter(rpc => rpc.tracking === 'no' || rpc.tracking === 'none').length, color: '#10b981' },
    { name: 'Medium Privacy', value: rpcEndpoints.filter(rpc => rpc.tracking === 'limited').length, color: '#f59e0b' },
    { name: 'Low Privacy', value: rpcEndpoints.filter(rpc => rpc.tracking === 'yes').length, color: '#ef4444' },
    { name: 'Unknown', value: rpcEndpoints.filter(rpc => !rpc.tracking || rpc.tracking === 'none').length, color: '#6b7280' }
  ].filter(item => item.value > 0)

  // Prepare status data for bar chart
  const statusData = [
    { name: 'Online', value: rpcEndpoints.filter(rpc => rpc.status === 'online').length, color: '#10b981' },
    { name: 'Slow', value: rpcEndpoints.filter(rpc => rpc.status === 'slow').length, color: '#f59e0b' },
    { name: 'Offline', value: rpcEndpoints.filter(rpc => rpc.status === 'offline').length, color: '#ef4444' }
  ]

  const chartConfig = {
    latency: {
      label: "Latency (ms)",
      color: "hsl(var(--primary))",
    },
    score: {
      label: "Performance Score",
      color: "hsl(var(--success))",
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Latency Performance Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            RPC Latency Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Privacy Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={privacyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {privacyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {privacyData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution Bar Chart */}
      <Card className="lg:col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            RPC Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}