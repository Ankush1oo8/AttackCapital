import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Function call endpoint for OpenMic to get patient information during calls
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Function call - get patient info:", body)

    const { medical_id } = body

    if (!medical_id) {
      return NextResponse.json({
        success: false,
        error: "Medical ID is required",
        message: "Please provide your Medical ID to retrieve your information.",
      })
    }

    // Find patient by medical ID
    const { data: patient, error } = await supabase
      .from("patients")
      .select("*")
      .eq("medical_id", medical_id.toUpperCase())
      .single()

    if (error || !patient) {
      return NextResponse.json({
        success: false,
        error: "Patient not found",
        message: `I couldn't find a patient with Medical ID ${medical_id}. Please verify your ID or contact the front desk for assistance.`,
      })
    }

    // Return patient information
    const patientInfo = {
      medical_id: patient.medical_id,
      name: `${patient.first_name} ${patient.last_name}`,
      date_of_birth: patient.date_of_birth,
      phone: patient.phone,
      email: patient.email,
      allergies: patient.allergies || [],
      medical_history: patient.medical_history || "No medical history on file",
      emergency_contact: {
        name: patient.emergency_contact_name,
        phone: patient.emergency_contact_phone,
      },
    }

    console.log("[v0] Patient info retrieved:", patientInfo.name)

    return NextResponse.json({
      success: true,
      patient: patientInfo,
      message: `Hello ${patient.first_name}! I found your information. How can I help you today?`,
    })
  } catch (error) {
    console.error("[v0] Function call error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "System error",
        message: "I'm experiencing technical difficulties. Please try again or contact the front desk.",
      },
      { status: 500 },
    )
  }
}
