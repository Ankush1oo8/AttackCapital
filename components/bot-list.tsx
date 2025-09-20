"use client"

import type { Bot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink, Copy, Send as Sync } from "lucide-react"
import { useState } from "react"
import { EditBotDialog } from "./edit-bot-dialog"
import { OpenMicSyncDialog } from "./openmic-sync-dialog"
import { toast } from "sonner"

interface BotListProps {
  bots: Bot[]
}

export function BotList({ bots }: BotListProps) {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (bot: Bot) => {
    setSelectedBot(bot)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (botId: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return

    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Bot deleted successfully")
        window.location.reload()
      } else {
        toast.error("Failed to delete bot")
      }
    } catch (error) {
      toast.error("Error deleting bot")
    }
  }

  const copyBotUID = (uid: string) => {
    navigator.clipboard.writeText(uid)
    toast.success("Bot UID copied to clipboard")
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No bots configured yet</p>
        <p className="text-sm text-gray-400">Create your first medical intake bot to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bots.map((bot) => (
        <Card key={bot.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {bot.name}
                  <Badge variant="secondary">{bot.domain}</Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  Bot UID: {bot.openmic_bot_uid}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => copyBotUID(bot.openmic_bot_uid)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <OpenMicSyncDialog bot={bot}>
                  <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                    <Sync className="h-3 w-3" />
                    Sync
                  </Button>
                </OpenMicSyncDialog>
                <Button variant="outline" size="sm" onClick={() => handleEdit(bot)} className="gap-1">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(bot.id)}
                  className="gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-1 bg-transparent">
                  <a href="https://chat.openmic.ai" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                    Test
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">System Prompt</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{bot.prompt}</p>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Created: {new Date(bot.created_at).toLocaleDateString()}</span>
                <span>Updated: {new Date(bot.updated_at).toLocaleDateString()}</span>
                {bot.webhook_settings?.synced_at && (
                  <span className="text-green-600">
                    Synced: {new Date(bot.webhook_settings.synced_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedBot && <EditBotDialog bot={selectedBot} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />}
    </div>
  )
}
