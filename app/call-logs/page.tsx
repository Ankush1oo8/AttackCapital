import { createClient } from "@/lib/supabase/server"
import { CallLogsList } from "@/components/call-logs-list"
import { CallStatsCards } from "@/components/call-stats-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Filter } from "lucide-react"
import Link from "next/link"

export default async function CallLogsPage() {
  const supabase = await createClient()

  // Fetch call logs with related data
  const { data: callLogs } = await supabase
    .from("call_logs")
    .select(`
      *,
      bots (name, domain),
      patients (first_name, last_name, medical_id)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  // Calculate stats
  const totalCalls = callLogs?.length || 0
  const completedCalls = callLogs?.filter((log) => log.call_status === "completed").length || 0
  const averageDuration = callLogs?.length
    ? Math.round(callLogs.reduce((sum, log) => sum + (log.call_duration || 0), 0) / callLogs.length)
    : 0

  const todaysCalls =
    callLogs?.filter((log) => {
      const today = new Date().toDateString()
      return new Date(log.created_at).toDateString() === today
    }).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Call Logs</h1>
              <p className="text-lg text-gray-600">Monitor and analyze your AI intake calls</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <CallStatsCards
          totalCalls={totalCalls}
          completedCalls={completedCalls}
          averageDuration={averageDuration}
          todaysCalls={todaysCalls}
        />

        {/* Call Logs List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Detailed logs of all intake calls with transcripts and function call data</CardDescription>
          </CardHeader>
          <CardContent>
            <CallLogsList callLogs={(callLogs as any[]) || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
