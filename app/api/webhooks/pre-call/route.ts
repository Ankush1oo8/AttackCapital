import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Pre-call webhook - returns patient data before the call starts
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Pre-call webhook received:", body)

    // Extract caller information from OpenMic payload
    const { caller_phone, bot_uid, call_id } = body

    // Try to find patient by phone number
    const { data: patient } = await supabase.from("patients").select("*").eq("phone", caller_phone).single()

    // Get bot information
    const { data: bot } = await supabase.from("bots").select("*").eq("openmic_bot_uid", bot_uid).single()

    // Prepare pre-call data
    const preCallData = {
      call_id,
      bot_uid,
      caller_phone,
      patient_found: !!patient,
      patient_data: patient
        ? {
            medical_id: patient.medical_id,
            name: `${patient.first_name} ${patient.last_name}`,
            allergies: patient.allergies,
            medical_history: patient.medical_history,
            last_visit: "2024-01-15", // Mock data
            upcoming_appointments: [], // Mock data
          }
        : null,
      timestamp: new Date().toISOString(),
    }

    // Log the pre-call data
    if (bot) {
      await supabase.from("call_logs").insert({
        bot_id: bot.id,
        openmic_call_id: call_id,
        patient_id: patient?.id || null,
        caller_phone,
        call_status: "pre_call",
        pre_call_data: preCallData,
      })
    }

    console.log("[v0] Pre-call data prepared:", preCallData)

    // Return data that OpenMic can use in the conversation
    return NextResponse.json({
      success: true,
      data: preCallData,
      context: patient
        ? `Patient ${patient.first_name} ${patient.last_name} (ID: ${patient.medical_id}) is calling. Known allergies: ${patient.allergies?.join(", ") || "None"}. Medical history: ${patient.medical_history || "None on file"}.`
        : `Unknown caller from ${caller_phone}. Please ask for their Medical ID to retrieve their information.`,
    })
  } catch (error) {
    console.error("[v0] Pre-call webhook error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process pre-call data",
        context: "Unable to retrieve patient information. Please ask for Medical ID.",
      },
      { status: 500 },
    )
  }
}
