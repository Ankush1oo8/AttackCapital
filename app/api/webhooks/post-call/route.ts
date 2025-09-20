import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Post-call webhook - processes call results after the call ends
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Post-call webhook received:", body)

    const { call_id, bot_uid, caller_phone, call_duration, transcript, summary, status, function_calls = [] } = body

    // Get bot information
    const { data: bot } = await supabase.from("bots").select("*").eq("openmic_bot_uid", bot_uid).single()

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Try to find patient from function calls or phone
    let patientId = null
    const patientInfo = function_calls.find((call: any) => call.function_name === "get_patient_info")

    if (patientInfo?.result?.patient) {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("medical_id", patientInfo.result.patient.medical_id)
        .single()

      patientId = patient?.id || null
    }

    // Process the call summary and extract key information
    const processedSummary = await processCallSummary(summary, transcript)

    // Update or create call log
    const { data: existingLog } = await supabase.from("call_logs").select("id").eq("openmic_call_id", call_id).single()

    if (existingLog) {
      // Update existing log
      await supabase
        .from("call_logs")
        .update({
          patient_id: patientId,
          call_duration: call_duration || 0,
          call_status: status,
          transcript: transcript || "",
          summary: processedSummary,
          function_calls,
          post_call_data: {
            processed_at: new Date().toISOString(),
            follow_up_required: processedSummary.includes("follow-up") || processedSummary.includes("appointment"),
            urgency_level: extractUrgencyLevel(transcript, summary),
            key_concerns: extractKeyConcerns(transcript, summary),
          },
        })
        .eq("id", existingLog.id)
    } else {
      // Create new log
      await supabase.from("call_logs").insert({
        bot_id: bot.id,
        openmic_call_id: call_id,
        patient_id: patientId,
        caller_phone,
        call_duration: call_duration || 0,
        call_status: status,
        transcript: transcript || "",
        summary: processedSummary,
        function_calls,
        post_call_data: {
          processed_at: new Date().toISOString(),
          follow_up_required: processedSummary.includes("follow-up") || processedSummary.includes("appointment"),
          urgency_level: extractUrgencyLevel(transcript, summary),
          key_concerns: extractKeyConcerns(transcript, summary),
        },
      })
    }

    // If this was a medical call, check if follow-up is needed
    if (bot.domain === "medical" && patientId) {
      await scheduleFollowUpIfNeeded(supabase, patientId, processedSummary, transcript)
    }

    console.log("[v0] Post-call processing completed for call:", call_id)

    return NextResponse.json({
      success: true,
      message: "Call processed successfully",
      follow_up_scheduled: processedSummary.includes("follow-up"),
    })
  } catch (error) {
    console.error("[v0] Post-call webhook error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process post-call data",
      },
      { status: 500 },
    )
  }
}

// Helper function to process call summary
async function processCallSummary(summary: string, transcript: string): Promise<string> {
  if (!summary && !transcript) return "No summary available"

  // Basic processing - in production, you might use AI to enhance this
  const processed = summary || "Call completed - transcript available"

  // Add key insights
  const insights = []
  if (transcript?.toLowerCase().includes("pain")) insights.push("Patient reported pain")
  if (transcript?.toLowerCase().includes("medication")) insights.push("Medication discussed")
  if (transcript?.toLowerCase().includes("appointment")) insights.push("Appointment requested")

  return insights.length > 0 ? `${processed}\n\nKey insights: ${insights.join(", ")}` : processed
}

// Helper function to extract urgency level
function extractUrgencyLevel(transcript: string, summary: string): "low" | "medium" | "high" {
  const text = `${transcript} ${summary}`.toLowerCase()

  if (text.includes("emergency") || text.includes("urgent") || text.includes("severe pain")) {
    return "high"
  }
  if (text.includes("soon") || text.includes("concern") || text.includes("worried")) {
    return "medium"
  }
  return "low"
}

// Helper function to extract key concerns
function extractKeyConcerns(transcript: string, summary: string): string[] {
  const text = `${transcript} ${summary}`.toLowerCase()
  const concerns = []

  if (text.includes("pain")) concerns.push("Pain management")
  if (text.includes("medication")) concerns.push("Medication review")
  if (text.includes("allergy")) concerns.push("Allergy concerns")
  if (text.includes("appointment")) concerns.push("Scheduling")
  if (text.includes("test") || text.includes("lab")) concerns.push("Test results")

  return concerns
}

// Helper function to schedule follow-up if needed
async function scheduleFollowUpIfNeeded(supabase: any, patientId: string, summary: string, transcript: string) {
  const needsFollowUp =
    summary.toLowerCase().includes("follow-up") ||
    summary.toLowerCase().includes("appointment") ||
    transcript.toLowerCase().includes("schedule")

  if (needsFollowUp) {
    // In a real system, this would integrate with a scheduling system
    console.log("[v0] Follow-up needed for patient:", patientId)

    // You could add a follow-up record to a separate table
    // await supabase.from("follow_ups").insert({
    //   patient_id: patientId,
    //   reason: "Post-call follow-up required",
    //   priority: extractUrgencyLevel(transcript, summary),
    //   created_at: new Date().toISOString()
    // })
  }
}
