import { createClient } from "@/lib/supabase/server"
import type { Patient } from "@/lib/types"
import { PatientList } from "@/components/patient-list"
import { CreatePatientDialog } from "@/components/create-patient-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Users, UserCheck, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function PatientsPage() {
  const supabase = await createClient()

  // Fetch patients
  const { data: patients } = await supabase.from("patients").select("*").order("created_at", { ascending: false })

  // Calculate stats
  const totalPatients = patients?.length || 0
  const patientsWithAllergies = patients?.filter((p) => p.allergies && p.allergies.length > 0).length || 0
  const recentPatients =
    patients?.filter((p) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(p.created_at) > weekAgo
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Management</h1>
              <p className="text-lg text-gray-600">Manage patient records and medical information</p>
            </div>
          </div>
          <CreatePatientDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </CreatePatientDialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Allergies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientsWithAllergies}</div>
              <p className="text-xs text-muted-foreground">Require special attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentPatients}</div>
              <p className="text-xs text-muted-foreground">Recently registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>Manage patient information, medical history, and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientList patients={(patients as Patient[]) || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
