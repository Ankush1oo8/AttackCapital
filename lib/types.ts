// Type definitions for the Medical AI Intake Agent

export interface Bot {
  id: string
  name: string
  openmic_bot_uid: string
  domain: string
  prompt: string
  voice_settings: Record<string, any>
  webhook_settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  medical_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
  allergies: string[]
  medical_history: string
  emergency_contact_name: string
  emergency_contact_phone: string
  created_at: string
  updated_at: string
}

export interface CallLog {
  id: string
  bot_id: string
  openmic_call_id: string
  patient_id?: string
  caller_phone: string
  call_duration: number
  call_status: string
  transcript: string
  summary: string
  function_calls: any[]
  pre_call_data: Record<string, any>
  post_call_data: Record<string, any>
  created_at: string
}

export interface OpenMicBot {
  uid: string
  name: string
  prompt: string
  voice: string
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

export interface WebhookPayload {
  call_id: string
  bot_uid: string
  caller_phone: string
  call_duration?: number
  transcript?: string
  summary?: string
  status: string
  timestamp: string
}
