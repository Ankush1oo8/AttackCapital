import { createClient } from "@/lib/supabase/server"
import { OpenMicAPI, createMedicalFunctions, generateMedicalPrompt } from "@/lib/openmic"
import { type NextRequest, NextResponse } from "next/server"

// Sync bot configuration with OpenMic API
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { bot_id } = body

    const openmic_api_key = process.env.OPENMIC_API_KEY

    if (!openmic_api_key) {
      return NextResponse.json({ error: "OpenMic API key not configured" }, { status: 500 })
    }

    // Get bot from database
    const { data: bot, error: botError } = await supabase.from("bots").select("*").eq("id", bot_id).single()

    if (botError || !bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    const openmic = new OpenMicAPI(openmic_api_key)

    // Get the base URL for webhook endpoints
    const baseUrl = request.headers.get("origin") || "http://localhost:3000"

    // Prepare function calls for medical domain
    const functionCalls = bot.domain === "medical" ? createMedicalFunctions(baseUrl) : []

    // Prepare bot configuration for OpenMic
    const openmicBotData = {
      name: bot.name,
      prompt: bot.prompt || generateMedicalPrompt(),
      voice: bot.voice_settings?.voice || "alloy",
      webhook_url: `${baseUrl}/api/webhooks/post-call`,
      function_calls: functionCalls,
    }

    let openmicBot
    try {
      // Try to update existing bot if UID exists
      if (bot.openmic_bot_uid) {
        openmicBot = await openmic.updateBot(bot.openmic_bot_uid, openmicBotData)
      } else {
        throw new Error("No existing bot UID")
      }
    } catch (error) {
      // If bot doesn't exist or no UID, create new one
      openmicBot = await openmic.createBot(openmicBotData)

      // Update our database with the new UID
      await supabase
        .from("bots")
        .update({
          openmic_bot_uid: openmicBot.uid,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bot_id)
    }

    // Update webhook settings in our database
    await supabase
      .from("bots")
      .update({
        webhook_settings: {
          pre_call_url: `${baseUrl}/api/webhooks/pre-call`,
          post_call_url: `${baseUrl}/api/webhooks/post-call`,
          function_calls: functionCalls,
          synced_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", bot_id)

    return NextResponse.json({
      success: true,
      openmic_bot: openmicBot,
      webhook_urls: {
        pre_call: `${baseUrl}/api/webhooks/pre-call`,
        post_call: `${baseUrl}/api/webhooks/post-call`,
        function_calls: functionCalls.map((f) => ({ name: f.name, url: f.url })),
      },
    })
  } catch (error) {
    console.error("[v0] OpenMic sync error:", error)
    return NextResponse.json(
      {
        error: "Failed to sync with OpenMic",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
