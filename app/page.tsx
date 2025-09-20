import { createClient } from "@/lib/supabase/server"
import type { Bot } from "@/lib/types"
import { BotList } from "@/components/bot-list"
import { CreateBotDialog } from "@/components/create-bot-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Phone, Activity, Users, Settings } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch bots and call logs for dashboard stats
  const { data: bots } = await supabase.from("bots").select("*").order("created_at", { ascending: false })

  const { data: callLogs } = await supabase
    .from("call_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: patients } = await supabase.from("patients").select("id")

  const totalCalls = callLogs?.length || 0
  const totalPatients = patients?.length || 0
  const activeBots = bots?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical AI Intake Agent</h1>
            <p className="text-lg text-gray-600">Manage your OpenMic AI bots and monitor call activities</p>
          </div>
          <div className="flex gap-4">
            <Link href="/setup">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Setup Guide
              </Button>
            </Link>
            <Link href="/patients">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Patients
              </Button>
            </Link>
            <Link href="/call-logs">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Activity className="h-4 w-4" />
                Call Logs
              </Button>
            </Link>
            <CreateBotDialog>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Bot
              </Button>
            </CreateBotDialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBots}</div>
              <p className="text-xs text-muted-foreground">OpenMic AI agents configured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalls}</div>
              <p className="text-xs text-muted-foreground">Calls processed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>
        </div>

        {/* Bot Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bot Management</CardTitle>
            <CardDescription>Create, update, and manage your OpenMic AI bots for medical intake</CardDescription>
          </CardHeader>
          <CardContent>
            <BotList bots={(bots as Bot[]) || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
