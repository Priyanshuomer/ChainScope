import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: LucideIcon
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  className 
}: MetricCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 ease-out",
      "border border-border/30 bg-gradient-to-br from-card/50 via-card to-card/80 backdrop-blur-sm",
      "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10",
      "hover:-translate-y-1 hover:scale-[1.02]",
      className
    )}>
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-none">
          {title}
        </CardTitle>
        {Icon && (
          <div className="relative p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative space-y-3 pt-0">
        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-1.5 w-1.5 rounded-full transition-all duration-300",
              changeType === "positive" && "bg-emerald-500 group-hover:animate-pulse",
              changeType === "negative" && "bg-red-500 group-hover:animate-pulse",
              changeType === "neutral" && "bg-slate-400"
            )} />
            <p className={cn(
              "text-xs font-medium transition-colors duration-300",
              changeType === "positive" && "text-emerald-600 dark:text-emerald-400",
              changeType === "negative" && "text-red-600 dark:text-red-400",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}