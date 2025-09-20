"use client"

import type React from "react"

import { useState } from "react"
import type { Bot } from "@/lib/types"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send as Sync, Copy, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface OpenMicSyncDialogProps {
  bot: Bot
  children: React.ReactNode
}

export function OpenMicSyncDialog({ bot, children }: OpenMicSyncDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setSyncResult(null)

    try {
      const response = await fetch("/api/openmic/sync-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bot_id: bot.id,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSyncResult(result)
        toast.success("Bot synced successfully with OpenMic!")
      } else {
        toast.error(result.error || "Failed to sync with OpenMic")
      }
    } catch (error) {
      toast.error("Error syncing with OpenMic")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sync className="h-5 w-5" />
            Sync with OpenMic
          </DialogTitle>
          <DialogDescription>
            Configure your bot on OpenMic with webhooks and function calls for the medical domain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bot Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bot Configuration</CardTitle>
              <CardDescription>Current bot settings that will be synced</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Name:</span>
                <span>{bot.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Domain:</span>
                <Badge variant="secondary">{bot.domain}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">OpenMic UID:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {bot.openmic_bot_uid || "Not synced yet"}
                  </code>
                  {bot.openmic_bot_uid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(bot.openmic_bot_uid, "Bot UID")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Voice:</span>
                <span>{bot.voice_settings?.voice || "alloy"}</span>
              </div>
            </CardContent>
          </Card>

          {!syncResult && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Ready to sync with OpenMic!</strong>
                </p>
                <p className="text-sm text-blue-700">
                  This will configure your bot on OpenMic with medical domain webhooks and function calls.
                </p>
              </div>

              <Button onClick={handleSync} disabled={isLoading} className="w-full">
                {isLoading ? "Syncing..." : "Sync with OpenMic"}
              </Button>
            </div>
          )}

          {/* Sync Results */}
          {syncResult && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Sync Successful!
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your bot has been configured on OpenMic with the following settings:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">OpenMic Bot UID:</h4>
                  <div className="flex items-center gap-2 bg-white p-2 rounded border">
                    <code className="text-sm font-mono">{syncResult.openmic_bot.uid}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(syncResult.openmic_bot.uid, "Bot UID")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Webhook URLs:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="font-mono">Pre-call:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs">{syncResult.webhook_urls.pre_call}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(syncResult.webhook_urls.pre_call, "Pre-call URL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="font-mono">Post-call:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs">{syncResult.webhook_urls.post_call}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(syncResult.webhook_urls.post_call, "Post-call URL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Function Calls:</h4>
                  <div className="space-y-2">
                    {syncResult.webhook_urls.function_calls.map((func: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded border text-sm"
                      >
                        <span className="font-mono">{func.name}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs">{func.url}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(func.url, `${func.name} URL`)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong>
                  </p>
                  <ol className="text-sm text-blue-700 mt-1 ml-4 list-decimal">
                    <li>Go to the OpenMic dashboard to test your bot</li>
                    <li>Use ngrok to expose your local webhooks for testing</li>
                    <li>Monitor call logs in the dashboard</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          {syncResult && (
            <Button asChild>
              <a href="https://chat.openmic.ai" target="_blank" rel="noopener noreferrer">
                Open OpenMic Dashboard
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
