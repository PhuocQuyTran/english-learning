# Shadowing Practice Features — Task List

## Backend
- [x] `audio-items.service.ts` — include segment `id` in transcript response
- [x] `shadowing.schema.ts` — add `transcriptSegmentId` to list query schema
- [x] `shadowing.service.ts` — filter recordings by `transcriptSegmentId`
- [x] `shadowing.controller.ts` — pass filter param

## Frontend — Type/Config Fixes
- [x] `constants/listeningQueryKeys.ts` — add `id?:string` to TranscriptSegment
- [x] `services/endpoints.ts` — add `notesEndpoints`
- [x] `services/shadowingApi.ts` — add `transcriptSegmentId?` param to listRecordings

## Frontend — New Hooks
- [x] `hooks/useShadowing.ts`
- [x] `hooks/useAudioRecorder.ts`

## Frontend — New Components
- [ ] `components/listening/CurrentSegmentCard.tsx`
- [ ] `components/listening/PracticeControls.tsx`
- [ ] `components/listening/NotesTab.tsx`
- [ ] `components/listening/VocabularyTab.tsx`

## Frontend — Modified Components
- [ ] `components/listening/TranscriptPanel.tsx` — mm:ss format, remove console.log
- [ ] `pages/ListeningDetailPage.tsx` — full layout redesign + wiring

## Verification
- [ ] `npx tsc --noEmit` — 0 errors
