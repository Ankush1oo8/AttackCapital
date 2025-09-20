"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const DEFAULT_MEDICAL_PROMPT = `You are a professional medical intake assistant. Your role is to:

1. Greet patients warmly and introduce yourself as the medical intake assistant
2. Ask for their Medical ID to retrieve their information
3. Verify their identity with basic information
4. Collect the reason for their visit
5. Ask about any changes to their medical history, allergies, or medications
6. Schedule follow-up appointments if needed
7. Provide clear next steps

Always maintain a professional, empathetic tone. If you cannot find a patient's Medical ID, politely ask them to verify the ID or contact the front desk.

Remember to use the get_patient_info function when they provide their Medical ID.`

interface CreateBotDialogProps {
  children: React.ReactNode
}

export function CreateBotDialog({ children }: CreateBotDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    openmic_bot_uid: "",
    domain: "medical",
    prompt: DEFAULT_MEDICAL_PROMPT,
    voice: "alloy",
    speed: "1.0",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          voice_settings: {
            voice: formData.voice,
            speed: Number.parseFloat(formData.speed),
          },
        }),
      })

      if (response.ok) {
        toast.success("Bot created successfully")
        setOpen(false)
        setFormData({
          name: "",
          openmic_bot_uid: "",
          domain: "medical",
          prompt: DEFAULT_MEDICAL_PROMPT,
          voice: "alloy",
          speed: "1.0",
        })
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create bot")
      }
    } catch (error) {
      toast.error("Error creating bot")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bot</DialogTitle>
          <DialogDescription>Configure a new OpenMic AI bot for medical intake</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Medical Intake Assistant"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openmic_bot_uid">OpenMic Bot UID</Label>
              <Input
                id="openmic_bot_uid"
                value={formData.openmic_bot_uid}
                onChange={(e) => setFormData({ ...formData, openmic_bot_uid: e.target.value })}
                placeholder="bot-uid-from-openmic"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Select value={formData.domain} onValueChange={(value) => setFormData({ ...formData, domain: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              rows={8}
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice">Voice</Label>
              <Select value={formData.voice} onValueChange={(value) => setFormData({ ...formData, voice: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">Alloy</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="fable">Fable</SelectItem>
                  <SelectItem value="onyx">Onyx</SelectItem>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Select value={formData.speed} onValueChange={(value) => setFormData({ ...formData, speed: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1.0">1.0x</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Bot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
