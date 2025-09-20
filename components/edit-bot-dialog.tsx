"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Bot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface EditBotDialogProps {
  bot: Bot
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBotDialog({ bot, open, onOpenChange }: EditBotDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    openmic_bot_uid: "",
    domain: "medical",
    prompt: "",
    voice: "alloy",
    speed: "1.0",
  })

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name,
        openmic_bot_uid: bot.openmic_bot_uid,
        domain: bot.domain,
        prompt: bot.prompt,
        voice: bot.voice_settings?.voice || "alloy",
        speed: bot.voice_settings?.speed?.toString() || "1.0",
      })
    }
  }, [bot])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/bots/${bot.id}`, {
        method: "PUT",
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
        toast.success("Bot updated successfully")
        onOpenChange(false)
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update bot")
      }
    } catch (error) {
      toast.error("Error updating bot")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bot</DialogTitle>
          <DialogDescription>Update your OpenMic AI bot configuration</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openmic_bot_uid">OpenMic Bot UID</Label>
              <Input
                id="openmic_bot_uid"
                value={formData.openmic_bot_uid}
                onChange={(e) => setFormData({ ...formData, openmic_bot_uid: e.target.value })}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Bot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
