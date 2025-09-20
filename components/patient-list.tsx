"use client"

import type { Patient } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, Mail, AlertTriangle, Calendar, User } from "lucide-react"
import { useState } from "react"
import { EditPatientDialog } from "./edit-patient-dialog"
import { toast } from "sonner"

interface PatientListProps {
  patients: Patient[]
}

export function PatientList({ patients }: PatientListProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient record?")) return

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Patient record deleted successfully")
        window.location.reload()
      } else {
        toast.error("Failed to delete patient record")
      }
    } catch (error) {
      toast.error("Error deleting patient record")
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No patients registered yet</p>
        <p className="text-sm text-gray-400">Add your first patient to get started with medical intake</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {patient.first_name} {patient.last_name}
                  <Badge variant="outline">{patient.medical_id}</Badge>
                  {patient.allergies && patient.allergies.length > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Allergies
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Age {calculateAge(patient.date_of_birth)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {patient.email}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(patient)} className="gap-1">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(patient.id)}
                  className="gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medical Information */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Medical History</h4>
                  <p className="text-sm text-gray-600">{patient.medical_history || "No medical history on file"}</p>
                </div>
                {patient.allergies && patient.allergies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-red-700">Allergies</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                  <div className="text-sm text-gray-600">
                    <p>{patient.emergency_contact_name || "Not provided"}</p>
                    {patient.emergency_contact_phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient.emergency_contact_phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Registered: {new Date(patient.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(patient.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedPatient && (
        <EditPatientDialog patient={selectedPatient} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      )}
    </div>
  )
}
