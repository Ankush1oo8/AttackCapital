// OpenMic API integration utilities

export interface OpenMicConfig {
  apiKey: string
  baseUrl: string
}

export interface CreateBotRequest {
  name: string
  prompt: string
  voice?: string
  webhook_url?: string
  function_calls?: OpenMicFunction[]
}

export interface OpenMicFunction {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
  url: string
}

export interface OpenMicBot {
  uid: string
  name: string
  prompt: string
  voice: string
  webhook_url?: string
  function_calls?: OpenMicFunction[]
  created_at: string
  updated_at: string
}

export class OpenMicAPI {
  private config: OpenMicConfig

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: "https://api.openmic.ai/v1", // Adjust based on actual API
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenMic API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async createBot(botData: CreateBotRequest): Promise<OpenMicBot> {
    return this.request("/bots", {
      method: "POST",
      body: JSON.stringify(botData),
    })
  }

  async updateBot(botUid: string, botData: Partial<CreateBotRequest>): Promise<OpenMicBot> {
    return this.request(`/bots/${botUid}`, {
      method: "PUT",
      body: JSON.stringify(botData),
    })
  }

  async deleteBot(botUid: string): Promise<void> {
    return this.request(`/bots/${botUid}`, {
      method: "DELETE",
    })
  }

  async getBot(botUid: string): Promise<OpenMicBot> {
    return this.request(`/bots/${botUid}`)
  }

  async listBots(): Promise<OpenMicBot[]> {
    return this.request("/bots")
  }

  async getCallLogs(botUid?: string): Promise<any[]> {
    const endpoint = botUid ? `/calls?bot_uid=${botUid}` : "/calls"
    return this.request(endpoint)
  }
}

// Helper function to create OpenMic function definitions
export function createMedicalFunctions(baseUrl: string): OpenMicFunction[] {
  return [
    {
      name: "get_patient_info",
      description: "Retrieve patient information using their Medical ID",
      parameters: {
        type: "object",
        properties: {
          medical_id: {
            type: "string",
            description: "The patient's Medical ID (e.g., MED001)",
          },
        },
        required: ["medical_id"],
      },
      url: `${baseUrl}/api/functions/get-patient-info`,
    },
  ]
}

// Helper function to generate medical intake prompt
export function generateMedicalPrompt(): string {
  return `You are a professional medical intake assistant for a healthcare facility. Your role is to:

1. **Greeting & Introduction**
   - Greet patients warmly and professionally
   - Introduce yourself as the medical intake assistant
   - Explain that you'll help them with their visit today

2. **Patient Identification**
   - Ask for their Medical ID to retrieve their information
   - Use the get_patient_info function when they provide their Medical ID
   - If patient not found, politely ask them to verify the ID or contact the front desk

3. **Information Verification**
   - Confirm their identity with basic information (name, date of birth)
   - Verify contact information is current
   - Check if emergency contact information is up to date

4. **Visit Information**
   - Ask about the reason for their visit today
   - Inquire about any specific symptoms or concerns
   - Note any urgency level (routine, urgent, emergency)

5. **Medical History Updates**
   - Ask about any changes to their medical history since last visit
   - Check for new allergies or medication changes
   - Inquire about any new medications or supplements

6. **Scheduling & Next Steps**
   - Provide information about wait times if applicable
   - Offer to schedule follow-up appointments if needed
   - Give clear instructions about what to expect next

**Important Guidelines:**
- Always maintain a professional, empathetic, and caring tone
- Protect patient privacy and confidentiality
- If you cannot help with something, direct them to speak with front desk staff
- For medical emergencies, immediately direct them to emergency services
- Keep conversations focused and efficient while being thorough

**Remember:** You are an intake assistant, not a medical professional. Do not provide medical advice or diagnoses.`
}
