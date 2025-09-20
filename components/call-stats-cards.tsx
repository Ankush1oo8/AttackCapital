import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, CheckCircle, Clock, Calendar } from "lucide-react"

interface CallStatsCardsProps {
  totalCalls: number
  completedCalls: number
  averageDuration: number
  todaysCalls: number
}

export function CallStatsCards({ totalCalls, completedCalls, averageDuration, todaysCalls }: CallStatsCardsProps) {
  const completionRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalls}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {completedCalls} of {totalCalls} calls
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(averageDuration / 60)}:{(averageDuration % 60).toString().padStart(2, "0")}
          </div>
          <p className="text-xs text-muted-foreground">Minutes:seconds</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Calls</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysCalls}</div>
          <p className="text-xs text-muted-foreground">Calls today</p>
        </CardContent>
      </Card>
    </div>
  )
}
