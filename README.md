# Medical AI Intake Agent

A comprehensive domain-specific AI intake agent built with OpenMic API for medical facilities. This application demonstrates pre-call, in-call function calls, and post-call webhook integrations for dynamic patient data retrieval and call handling.

## Features

### 🏥 Medical Domain Specific
- **Patient Management**: Complete CRUD operations for patient records
- **Medical History Tracking**: Store and retrieve patient medical history
- **Allergy Management**: Track and alert for patient allergies
- **Emergency Contacts**: Maintain emergency contact information

### 🤖 AI Bot Management
- **Bot CRUD Operations**: Create, read, update, and delete OpenMic bots
- **Domain-Specific Prompts**: Pre-configured medical intake prompts
- **Voice Configuration**: Customizable voice settings and speed
- **OpenMic Sync**: Automatic synchronization with OpenMic API

### 📞 Call Management
- **Pre-call Webhooks**: Fetch patient data before calls start
- **In-call Functions**: Real-time patient information retrieval during calls
- **Post-call Processing**: Automatic call summary and follow-up detection
- **Call Logs**: Comprehensive call history with transcripts and metadata

### 🔗 Webhook Integration
- **Pre-call Data**: Returns patient information based on caller phone
- **Function Calls**: `get_patient_info` function for Medical ID lookup
- **Post-call Processing**: Stores transcripts, summaries, and follow-up requirements
- **Ngrok Support**: Local development with public webhook endpoints

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS, shadcn/ui components
- **AI Integration**: OpenMic API
- **Development**: Ngrok for webhook testing

## Quick Start

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd medical-ai-intake
npm install
\`\`\`

### 2. Environment Setup
The application uses Supabase integration with pre-configured environment variables.

### 3. Database Setup
Run the database scripts to create tables and seed data:
\`\`\`bash
# Tables and sample data are automatically created via Supabase integration
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 5. Setup Ngrok (for webhook testing)
\`\`\`bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# Start ngrok tunnel
ngrok http 3000
\`\`\`

### 6. Configure OpenMic
1. Sign up at [OpenMic](https://chat.openmic.ai/signup)
2. Get your API key from [API Key Demo](http://chat.openmic.ai/api-key-demo-735023852)
3. Create a bot in the dashboard
4. Use the "Sync with OpenMic" feature to configure webhooks

## Usage Guide

### Creating a Medical Bot

1. **Navigate to Dashboard**: Open the application homepage
2. **Create Bot**: Click "Create Bot" button
3. **Configure Settings**:
   - Name: "Medical Intake Assistant"
   - Domain: Select "Medical"
   - OpenMic Bot UID: Enter your bot UID from OpenMic dashboard
   - Prompt: Use the pre-configured medical prompt or customize
   - Voice: Choose from available voices (Alloy, Echo, Fable, etc.)

### Syncing with OpenMic

1. **Open Bot List**: View your created bots
2. **Click Sync**: Use the "Sync" button on any bot
3. **Enter API Key**: Provide your OpenMic API key
4. **Configure Webhooks**: The system automatically sets up:
   - Pre-call webhook: `/api/webhooks/pre-call`
   - Post-call webhook: `/api/webhooks/post-call`
   - Function calls: `get_patient_info`

### Testing the Bot

1. **Start Ngrok**: Ensure ngrok is running and exposing your local server
2. **Update URLs**: Replace localhost URLs with ngrok URLs in OpenMic dashboard
3. **Test Call**: Use OpenMic's "Test Call" feature
4. **Test Scenario**:
   - Bot greets you professionally
   - Ask for Medical ID: "MED001"
   - Bot retrieves John Doe's information
   - Complete the call and check logs

### Managing Patients

1. **Navigate to Patients**: Click "Patients" in the header
2. **Add Patient**: Use "Add Patient" button
3. **Fill Information**:
   - Medical ID (e.g., MED001)
   - Personal information
   - Medical history
   - Allergies (with visual alerts)
   - Emergency contacts

### Monitoring Calls

1. **View Call Logs**: Click "Call Logs" in the header
2. **Analyze Data**:
   - Call statistics and completion rates
   - Detailed transcripts
   - Function call results
   - Pre/post-call data
   - Follow-up requirements

## API Endpoints

### Webhook Endpoints
- `POST /api/webhooks/pre-call` - Pre-call patient data retrieval
- `POST /api/webhooks/post-call` - Post-call processing and logging

### Function Call Endpoints
- `POST /api/functions/get-patient-info` - Retrieve patient by Medical ID

### Management APIs
- `GET/POST /api/bots` - Bot management
- `PUT/DELETE /api/bots/[id]` - Individual bot operations
- `GET/POST /api/patients` - Patient management
- `PUT/DELETE /api/patients/[id]` - Individual patient operations
- `GET /api/call-logs` - Call log retrieval

## Medical Domain Features

### Pre-call Webhook
- Identifies patients by phone number
- Returns patient context for the AI
- Provides medical history and allergy information
- Logs pre-call data for analysis

### In-call Function: get_patient_info
\`\`\`json
{
  "medical_id": "MED001"
}
\`\`\`
Returns:
\`\`\`json
{
  "success": true,
  "patient": {
    "medical_id": "MED001",
    "name": "John Doe",
    "allergies": ["Penicillin", "Shellfish"],
    "medical_history": "Hypertension, Type 2 Diabetes"
  },
  "message": "Hello John! I found your information. How can I help you today?"
}
\`\`\`

### Post-call Processing
- Extracts urgency levels (low, medium, high)
- Identifies key concerns (pain, medication, allergies)
- Determines follow-up requirements
- Stores comprehensive call metadata

## Sample Data

The application includes sample patients for testing:

| Medical ID | Name | Phone | Allergies |
|------------|------|-------|-----------|
| MED001 | John Doe | +1-555-0101 | Penicillin, Shellfish |
| MED002 | Sarah Johnson | +1-555-0201 | Latex |
| MED003 | Robert Smith | +1-555-0301 | None |
| MED004 | Emily Davis | +1-555-0401 | Peanuts, Tree nuts |
| MED005 | Michael Wilson | +1-555-0501 | Sulfa drugs |

## Troubleshooting

### Common Issues

1. **Webhooks Not Working**
   - Ensure ngrok is running
   - Verify URLs in OpenMic dashboard
   - Check server logs for errors

2. **Function Calls Failing**
   - Confirm function URL is accessible
   - Verify Medical ID exists in database
   - Check API response format

3. **Patient Not Found**
   - Verify Medical ID format (uppercase)
   - Check database connection
   - Ensure patient exists in system

### Debug Logs
The application includes comprehensive logging with `[v0]` prefixes for easy identification in server logs.

## Deployment

For production deployment:

1. **Deploy to Vercel**: The application is optimized for Vercel deployment
2. **Configure Environment**: Ensure all Supabase environment variables are set
3. **Update Webhooks**: Replace ngrok URLs with production URLs in OpenMic
4. **SSL Certificate**: Ensure HTTPS for webhook security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with OpenMic integration
5. Submit a pull request

## License

This project is licensed under the MIT License.
