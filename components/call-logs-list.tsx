"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Phone, User, Clock, MessageSquare, Zap, AlertTriangle } from "lucide-react"

interface CallLog {
  id: string
  openmic_call_id: string
  caller_phone: string
  call_duration: number
  call_status: string
  transcript: string
  summary: string
  function_calls: any[]
  pre_call_data: any
  post_call_data: any
  created_at: string
  bots?: { name: string; domain: string }
  patients?: { first_name: string; last_name: string; medical_id: string }
}

interface CallLogsListProps {
  callLogs: CallLog[]
}

export function CallLogsList({ callLogs }: CallLogsListProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pre_call":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (callLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No call logs yet</p>
        <p className="text-sm text-gray-400">Call logs will appear here after your first intake call</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {callLogs.map((log) => {
        const isExpanded = expandedLogs.has(log.id)
        const patientName = log.patients ? `${log.patients.first_name} ${log.patients.last_name}` : "Unknown Patient"

        return (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpanded(log.id)
                        }}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {patientName}
                          {log.patients?.medical_id && (
                            <Badge variant="outline" className="text-xs">
                              {log.patients.medical_id}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {log.caller_phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(log.call_duration)}
                          </span>
                          <span>{new Date(log.created_at).toLocaleString()}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.post_call_data?.urgency_level && (
                        <AlertTriangle className={`h-4 w-4 ${getUrgencyColor(log.post_call_data.urgency_level)}`} />
                      )}
                      <Badge className={getStatusColor(log.call_status)}>{log.call_status}</Badge>
                      {log.bots && <Badge variant="secondary">{log.bots.domain}</Badge>}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Summary */}
                    {log.summary && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Call Summary
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{log.summary}</p>
                      </div>
                    )}

                    {/* Key Concerns */}
                    {log.post_call_data?.key_concerns && log.post_call_data.key_concerns.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Key Concerns</h4>
                        <div className="flex flex-wrap gap-2">
                          {log.post_call_data.key_concerns.map((concern: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {concern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Function Calls */}
                    {log.function_calls && log.function_calls.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Function Calls
                        </h4>
                        <div className="space-y-2">
                          {log.function_calls.map((call: any, index: number) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-sm font-medium">{call.function_name}</span>
                                <Badge variant={call.success ? "default" : "destructive"}>
                                  {call.success ? "Success" : "Failed"}
                                </Badge>
                              </div>
                              {call.parameters && (
                                <div className="text-xs text-gray-600 mb-2">
                                  <strong>Parameters:</strong> {JSON.stringify(call.parameters)}
                                </div>
                              )}
                              {call.result && (
                                <div className="text-xs text-gray-700">
                                  <strong>Result:</strong> {JSON.stringify(call.result, null, 2)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pre-call Data */}
                    {log.pre_call_data && Object.keys(log.pre_call_data).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Pre-call Data</h4>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(log.pre_call_data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Transcript */}
                    {log.transcript && (
                      <div>
                        <h4 className="font-medium mb-2">Full Transcript</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                            {log.transcript}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Actions */}
                    {log.post_call_data?.follow_up_required && (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <h4 className="font-medium text-orange-800 mb-1">Follow-up Required</h4>
                        <p className="text-sm text-orange-700">
                          This call requires follow-up action. Please review and schedule appropriate next steps.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
