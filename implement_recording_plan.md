# Connect Existing Transcript API and Remove Mock Data

## Existing Transcript Architecture

**GET API:**
- **endpoint:** `GET /api/v1/audio-items/:id/transcript`
- **route:** `backend/src/routes/audio-items.routes.ts`
- **controller:** `audio-items.controller.ts` (`getTranscript`)
- **service:** `audio-items.service.ts` (`getTranscript`)
- **database table:** `public.transcript_segments`
- **response structure:** 
```json
{
  "success": true,
  "data": {
    "audioItemId": "string",
    "segments": [
      {
        "id": "uuid",
        "startTime": 0,
        "endTime": 2.1,
        "text": "Hello, how are you today?",
        "sequence": 1
      }
    ]
  }
}
```

**Frontend:**
- **API service:** `src/services/listeningApi.ts` (`getTranscript`)
- **React Query hook:** `src/hooks/useListeningItems.ts` (`useTranscript`)
- **transcript component:** `ListeningDetailPage.tsx` orchestrates data and passes it to `TranscriptPanel.tsx`
- **current data source:** The real backend database (via `useTranscript`), completely avoiding frontend-defined mock data.

**Mock Data:**
- **file:** `backend/src/services/speech-to-text.service.ts`
- **variable:** `MockSpeechToTextService` (returns hardcoded segments like "Hello, how are you today?")
- **why it is still being used:** The frontend isn't using mock data internally. Instead, the backend transcription generation pipeline currently uses a mock STT service. When transcription is requested, this mock service generates fake segments and *inserts them into the real database*. The frontend then correctly fetches these fake segments from the real database.

**Generation:**
- **existing POST/service:** `POST /api/v1/audio-items/:id/transcript` → `audioItemsService.generateTranscript`
- **Speech-to-Text provider:** None implemented (Uses `MockSpeechToTextService`).
- **current status:** Works end-to-end, but persists hardcoded mock sentences to the `transcript_segments` table instead of performing real speech-to-text.

---

## Root Cause

**Expected flow:**
Audio uploaded → User triggers transcription → Backend sends media to real STT provider (Deepgram/Whisper) → Backend parses response and saves segments to `transcript_segments` table → Frontend fetches segments from DB and renders.

**Actual flow:**
Audio uploaded → User triggers transcription → Backend uses `MockSpeechToTextService` → Backend saves fake segments to `transcript_segments` table → Frontend fetches fake segments from DB and renders.

**Breaking point:**
The integration is technically unbroken. The entire data pipeline (Frontend UI → Tanstack Query → GET API → Database) is working perfectly. The "fake transcript" is actually coming from the backend's `speech-to-text.service.ts` which is intentionally inserting mock data into the real database because a real AI transcription provider has not been implemented yet.

---

## Minimal Changes Required

**Backend:**
- Implement a real provider (e.g., Deepgram, OpenAI Whisper, or AWS Transcribe) in `backend/src/services/speech-to-text.service.ts` to replace `MockSpeechToTextService`.
- Wire the actual audio URL to the external provider API inside the `transcribe` method.

**Frontend:**
- **None.** The frontend is fully connected and successfully rendering whatever is in the database.

**Database:**
- **None.** The `transcript_segments` table schema is correct and populated properly by the generation endpoint.

---

> [!IMPORTANT]
> **User Review Required**
> Since the frontend is already fully connected to the correct, working GET API, the only missing piece is replacing the mock backend STT service with a real third-party AI transcription service. 
> 
> **Question:** Which Speech-to-Text provider would you like me to implement in the backend? (e.g., Deepgram, OpenAI, Google Cloud, AssemblyAI). Please provide instructions on which provider to use and how to handle the API keys!
