import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Terminal, Globe, Webhook, Zap, Users, Activity } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Setup Guide</h1>
            <p className="text-lg text-gray-600">Complete setup for your Medical AI Intake Agent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Setup Guide */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: OpenMic Account */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-blue-600">1</Badge>
                  OpenMic Account Setup
                </CardTitle>
                <CardDescription>Create your OpenMic account and get your API key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">1. Sign up for OpenMic</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://chat.openmic.ai/signup" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Sign Up
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">2. Get your API key</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href="http://chat.openmic.ai/api-key-demo-735023852" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get API Key
                      </a>
                    </Button>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> You'll receive a trial account. Keep your API key secure as you'll need it
                      to sync your bots.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Ngrok Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-green-600">2</Badge>
                  Ngrok Setup for Local Development
                </CardTitle>
                <CardDescription>Expose your local webhooks to OpenMic for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Install Ngrok
                    </h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="space-y-2">
                        <div># Install ngrok (macOS)</div>
                        <div>brew install ngrok/ngrok/ngrok</div>
                        <div className="mt-3"># Or download from https://ngrok.com/download</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Setup Ngrok Account</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>1. Create free ngrok account</span>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://ngrok.com/signup" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Sign Up
                          </a>
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span>2. Get your auth token from the dashboard</span>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                        <div># Add your auth token</div>
                        <div>ngrok config add-authtoken YOUR_TOKEN_HERE</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Start Ngrok Tunnel
                    </h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="space-y-2">
                        <div># Start your Next.js app first</div>
                        <div>npm run dev</div>
                        <div className="mt-3"># In another terminal, start ngrok</div>
                        <div>ngrok http 3000</div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Success!</strong> Ngrok will provide you with a public URL like{" "}
                        <code>https://abc123.ngrok.io</code> that forwards to your local app.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Bot Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-purple-600">3</Badge>
                  Configure Your Medical Bot
                </CardTitle>
                <CardDescription>Set up your bot with proper webhooks and function calls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Webhook className="h-4 w-4" />
                        Webhook URLs
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Pre-call:</strong>
                          <br />
                          <code className="text-xs bg-white p-1 rounded">
                            https://your-ngrok-url.ngrok.io/api/webhooks/pre-call
                          </code>
                        </div>
                        <div>
                          <strong>Post-call:</strong>
                          <br />
                          <code className="text-xs bg-white p-1 rounded">
                            https://your-ngrok-url.ngrok.io/api/webhooks/post-call
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Function Calls
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>get_patient_info:</strong>
                          <br />
                          <code className="text-xs bg-white p-1 rounded">
                            https://your-ngrok-url.ngrok.io/api/functions/get-patient-info
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium mb-2">Configuration Steps</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-yellow-800">
                      <li>Create a new bot in your dashboard</li>
                      <li>Use the "Sync with OpenMic" button to configure webhooks automatically</li>
                      <li>Replace localhost URLs with your ngrok URL in the OpenMic dashboard</li>
                      <li>Test your bot using the "Test Call" feature</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-orange-600">4</Badge>
                  Testing Your Setup
                </CardTitle>
                <CardDescription>Verify everything is working correctly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Test Checklist</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                          <span>Ngrok tunnel is running</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                          <span>Bot synced with OpenMic</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                          <span>Webhook URLs updated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                          <span>Test call completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Test Scenario</h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>1. Start a test call in OpenMic dashboard</p>
                        <p>2. Bot should greet you professionally</p>
                        <p>3. Provide Medical ID: "MED001"</p>
                        <p>4. Bot should retrieve John Doe's information</p>
                        <p>5. Check call logs in your dashboard</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium mb-2 text-red-800">Troubleshooting</h4>
                    <div className="text-sm text-red-700 space-y-1">
                      <p>• If webhooks fail: Check ngrok is running and URLs are correct</p>
                      <p>• If function calls fail: Verify the function URL is accessible</p>
                      <p>• If patient not found: Check the Medical ID exists in your database</p>
                      <p>• Check browser console and server logs for detailed errors</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/">
                    <Globe className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/patients">
                    <Users className="h-4 w-4 mr-2" />
                    Patients
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/call-logs">
                    <Activity className="h-4 w-4 mr-2" />
                    Call Logs
                  </Link>
                </Button>
                <Separator />
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href="https://chat.openmic.ai" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    OpenMic Dashboard
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href="https://docs.openmic.ai" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    OpenMic Docs
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Sample Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Test Data</CardTitle>
                <CardDescription>Use these for testing your bot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Test Medical IDs:</h4>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="p-2 bg-gray-100 rounded">MED001 - John Doe</div>
                    <div className="p-2 bg-gray-100 rounded">MED002 - Sarah Johnson</div>
                    <div className="p-2 bg-gray-100 rounded">MED003 - Robert Smith</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Test Phone Numbers:</h4>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="p-2 bg-gray-100 rounded">+1-555-0101</div>
                    <div className="p-2 bg-gray-100 rounded">+1-555-0201</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Webhooks</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Setup Required</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">OpenMic</span>
                  <Badge className="bg-yellow-100 text-yellow-800">API Key Required</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
