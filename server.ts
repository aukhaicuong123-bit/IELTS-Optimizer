import express, { type Request, type Response } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'
import { GoogleGenAI } from '@google/genai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(express.json({ limit: '2mb' }))

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

import fs from 'fs'

// Initialize Gemini SDK if key is present in environment or .env file
let geminiApiKey = process.env.GEMINI_API_KEY || ''
if (!geminiApiKey || geminiApiKey === 'MY_GEMINI_API_KEY') {
  try {
    const envPath = path.resolve(__dirname, '.env')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      const m = envContent.match(/GEMINI_API_KEY=([^\s\r\n]+)/)
      if (m && m[1] && m[1] !== 'MY_GEMINI_API_KEY') {
        geminiApiKey = m[1].trim()
      }
    }
  } catch {}
}

const aiClient = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiApiKey),
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

export interface AICoachRequest {
  taskTitle: string
  taskPrompt: string
  taskType: 'academic_task1' | 'general_task1' | 'task2' | 'speaking' | 'reading' | 'listening'
  studentSubmission: string
  mode: 'evaluate' | 'approach' | 'hint'
}

// AI Coach Analysis Proxy Endpoint
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    const { taskTitle, taskPrompt, taskType, studentSubmission, mode } = req.body as AICoachRequest

    if (!taskPrompt || typeof taskPrompt !== 'string') {
      res.status(400).json({ error: 'taskPrompt is required' })
      return
    }

    const VALID_MODES = ['evaluate', 'approach', 'hint']
    if (!mode || !VALID_MODES.includes(mode)) {
      res.status(400).json({ error: 'mode must be one of: evaluate, approach, hint' })
      return
    }

    const VALID_TASK_TYPES = ['academic_task1', 'general_task1', 'task2', 'speaking', 'reading', 'listening']
    if (!taskType || !VALID_TASK_TYPES.includes(taskType)) {
      res.status(400).json({ error: `taskType must be one of: ${VALID_TASK_TYPES.join(', ')}` })
      return
    }

    if (mode === 'evaluate' && (!studentSubmission || studentSubmission.trim().split(/\s+/).length < 10)) {
      res.status(400).json({ error: 'Bài viết cần tối thiểu 10 từ để AI có thể đánh giá chi tiết.' })
      return
    }

    // Mode: Get approach hints before writing
    if (mode === 'approach' || mode === 'hint') {
      if (aiClient) {
        try {
          const prompt = `You are a certified, supportive IELTS expert mentor.
The student is preparing to answer this IELTS ${taskType} task:
Title: "${taskTitle}"
Prompt: "${taskPrompt}"

Provide a structured, step-by-step approach outline in Vietnamese and English:
1. "understandTheTask": Key prompt requirements, tone, and pitfalls to avoid.
2. "recommendedStructure": Paragraph-by-paragraph essay plan or speaking outline.
3. "keyVocabulary": 4-6 high-scoring collocation suggestions relevant to this specific topic.
4. "selfCheckQuestions": 3 questions the student should ask themselves before submitting.

Format your response strictly as valid JSON with keys:
understandTheTask (string),
recommendedStructure (array of strings),
keyVocabulary (array of strings),
selfCheckQuestions (array of strings).`

          const response = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          })

          const text = response.text || '{}'
          const data = JSON.parse(text)
          res.json({ success: true, mode, data })
          return
        } catch (apiErr) {
          console.warn('[AI Coach] Gemini API error during approach generation, falling back:', apiErr)
        }
      }

      // Rule-based fallback if no API key or API call fails
      res.json({
        success: true,
        mode,
        isFallback: true,
        data: {
          understandTheTask: `Dạng bài: ${taskType}. Hãy đọc kỹ các yêu cầu cốt lõi của đề, xác định rõ quan điểm và chia đoạn mạch lạc.`,
          recommendedStructure: [
            'Mở bài: Paraphrase lại đề bài và nêu rõ luận điểm chính.',
            'Thân bài 1: Phát triển ý chính thứ nhất với ví dụ và giải thích cụ thể.',
            'Thân bài 2: Phát triển ý chính thứ hai hoặc góc nhìn phản biện.',
            'Kết bài: Khái quát lại câu trả lời và khẳng định lại quan điểm.'
          ],
          keyVocabulary: [
            'significant transformation',
            'substantiate an argument',
            'socioeconomic ramifications',
            'comparative analysis'
          ],
          selfCheckQuestions: [
            'Tôi đã trả lời đầy đủ tất cả các phần của đề bài chưa?',
            'Các đoạn văn có câu chủ đề (topic sentence) rõ ràng không?',
            'Tôi đã kiểm tra lỗi chính tả và mạo từ (a/an/the) chưa?'
          ]
        }
      })
      return
    }

    // Mode: Full essay evaluation with grounded evidence
    if (aiClient) {
      try {
        const prompt = `You are an elite, evidence-based IELTS examiner.
Evaluate the following student submission strictly against the official IELTS ${taskType} rubric.

Task Title: "${taskTitle}"
Task Prompt: "${taskPrompt}"
Student Submission:
"""
${studentSubmission}
"""

EVALUATION RULES (CRITICAL):
1. Grounding: All quotations in "evidenceQuotes" MUST be exact, verbatim substrings extracted from the student's submission. Never hallucinate or alter quotes.
2. Criteria: Assess the 4 official criteria:
   - Task Achievement / Task Response
   - Coherence and Cohesion
   - Lexical Resource
   - Grammatical Range and Accuracy
3. Constructive Feedback: Identify 1-3 high-impact priority issues with actionable sentence rewrite suggestions.
4. Transparency: The estimated band score is purely for formative practice, not an official test report.

Respond ONLY with valid JSON matching this schema:
{
  "overallBandEstimate": number (e.g. 6.5),
  "overallAssessment": string,
  "criteria": {
    "taskAchievementOrResponse": { "score": number, "comment": string, "evidence": string },
    "coherenceAndCohesion": { "score": number, "comment": string, "evidence": string },
    "lexicalResource": { "score": number, "comment": string, "evidence": string },
    "grammaticalRangeAndAccuracy": { "score": number, "comment": string, "evidence": string }
  },
  "strengths": [string],
  "priorityIssues": [string],
  "actionableRevisions": [
    { "originalExcerpt": string, "suggestedRewrite": string, "reason": string }
  ],
  "nextExerciseRecommendation": string,
  "limitationsNotice": string
}`

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        })

        const text = response.text || '{}'
        const assessment = JSON.parse(text)
        res.json({ success: true, mode: 'evaluate', data: assessment })
        return
      } catch (err) {
        console.warn('[AI Coach] Gemini API call failed, providing structured local analysis:', err)
      }
    }

    // Fallback evaluation if GEMINI_API_KEY is not configured
    const words = studentSubmission.trim().split(/\s+/)
    const wordCount = words.length
    const targetMin = taskType === 'task2' ? 250 : 150

    res.json({
      success: true,
      mode: 'evaluate',
      isFallback: true,
      data: {
        overallBandEstimate: wordCount >= targetMin ? 6.0 : 5.0,
        overallAssessment: `Bài viết đã hoàn thành ${wordCount} từ (yêu cầu tối thiểu: ${targetMin} từ). Để nhận phân tích chi tiết thời gian thực từ mô hình Gemini, vui lòng cấu hình GEMINI_API_KEY trong file .env trên máy chủ.`,
        criteria: {
          taskAchievementOrResponse: {
            score: wordCount >= targetMin ? 6.0 : 5.0,
            comment: wordCount >= targetMin ? 'Đáp ứng độ dài tối thiểu của đề bài.' : 'Chưa đạt đủ số từ tối thiểu theo quy định.',
            evidence: words.slice(0, 8).join(' ') + '...'
          },
          coherenceAndCohesion: {
            score: 6.0,
            comment: 'Cấu trúc bài viết đã chia đoạn cơ bản.',
            evidence: 'Bố cục bài viết gồm các đoạn văn nối tiếp.'
          },
          lexicalResource: {
            score: 6.0,
            comment: 'Sử dụng các từ vựng theo chủ đề ở mức thông dụng.',
            evidence: 'Từ vựng diễn đạt đúng ngữ cảnh cơ bản.'
          },
          grammaticalRangeAndAccuracy: {
            score: 5.5,
            comment: 'Kết hợp câu đơn và câu ghép, cần chú ý tính chính xác của các cấu trúc phức tạp.',
            evidence: 'Các câu văn thể hiện ý tưởng người học.'
          }
        },
        strengths: ['Có ý thức chia đoạn theo luận điểm', 'Bài viết bám sát đề tài'],
        priorityIssues: [
          wordCount < targetMin ? 'Tăng dung lượng bài viết để đạt số từ tiêu chuẩn' : 'Mở rộng vốn từ vựng học thuật C1/C2',
          'Sử dụng thêm các liên từ chỉ sự tương phản và nhượng bộ'
        ],
        actionableRevisions: [
          {
            originalExcerpt: words.slice(0, 10).join(' '),
            suggestedRewrite: 'Phát triển ý với ví dụ thực tiễn để củng cố luận điểm.',
            reason: 'Tăng tính thuyết phục và độ phong phú cho tiêu chí Task Response.'
          }
        ],
        nextExerciseRecommendation: 'Luyện tập thêm dạng bài tương tự trong Thư viện đề.',
        limitationsNotice:
          'Lưu ý: Đánh giá này dựa trên các quy tắc định lượng nội bộ (chưa kết nối GEMINI_API_KEY). Điểm số ước lượng chỉ mang tính tham khảo.'
      }
    })
  } catch (error: any) {
    console.error('[AI Coach] Unexpected error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// In-memory cache for generated TTS audio to prevent redundant API calls
const ttsAudioCache = new Map<string, string>()

// Helper to parse transcript lines into structured speaker turns
function parseDialogueTurns(rawText: string): { speaker: string; text: string }[] {
  const lines = rawText.split('\n')
  const turns: { speaker: string; text: string }[] = []
  let currentSpeaker = 'Speaker'
  let currentBuffer = ''

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const match = line.match(/^([A-Za-z0-9\.\s'-]{1,30}):\s*(.*)$/)
    if (match) {
      if (currentBuffer.trim()) {
        turns.push({ speaker: currentSpeaker, text: currentBuffer.trim() })
        currentBuffer = ''
      }
      currentSpeaker = match[1].trim()
      currentBuffer = match[2].trim()
    } else {
      if (currentBuffer) {
        currentBuffer += ' ' + line
      } else {
        currentBuffer = line
      }
    }
  }

  if (currentBuffer.trim()) {
    turns.push({ speaker: currentSpeaker, text: currentBuffer.trim() })
  }

  return turns
}

// Human-like Studio Speech Synthesis Endpoint (Gemini TTS: multi-speaker & single-speaker)
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voiceName = 'Kore',
      style = 'Clear, engaging British IELTS academic speaker with natural intonation, authentic pauses, and lively pacing'
    } = req.body || {}

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'text is required' })
      return
    }

    if (!aiClient) {
      res.status(503).json({
        error: 'Gemini API is not configured on this server. Browser SpeechSynthesis fallback should be used.',
        isFallback: true
      })
      return
    }

    // Supported prebuilt voices: 'Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'
    const allowedVoices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr']
    const selectedVoice = allowedVoices.includes(voiceName) ? voiceName : 'Kore'

    const turns = parseDialogueTurns(text)
    const distinctSpeakers = Array.from(new Set(turns.map(t => t.speaker))).filter(s => s !== 'Speaker')

    // Determine voice assignments for characters
    // Primary speaker gets selectedVoice. Secondary speaker gets a distinct complementary voice.
    let voice1 = selectedVoice
    let voice2 = 'Puck'
    if (voice1 === 'Kore') voice2 = 'Puck'
    else if (voice1 === 'Puck') voice2 = 'Kore'
    else if (voice1 === 'Fenrir') voice2 = 'Kore'
    else if (voice1 === 'Charon') voice2 = 'Kore'
    else if (voice1 === 'Zephyr') voice2 = 'Puck'

    const cacheKey = `${selectedVoice}::${distinctSpeakers.length}::${turns.map(t => `${t.speaker}:${t.text}`).join('|')}`
    if (ttsAudioCache.has(cacheKey)) {
      res.json({
        success: true,
        cached: true,
        audioBase64: ttsAudioCache.get(cacheKey),
        mimeType: 'audio/wav',
        voice: selectedVoice,
        speakers: distinctSpeakers
      })
      return
    }

    let base64Audio: string | undefined

    // If exactly 2 distinct speakers in dialogue, synthesize with multi-speaker Gemini TTS
    if (distinctSpeakers.length === 2) {
      try {
        const multiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: turns.map(turn => ({
                text: `${turn.speaker}: ${turn.text}`,
                speechMetadata: {
                  speaker: turn.speaker
                }
              }))
            }
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: distinctSpeakers[0],
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: voice1 }
                    }
                  },
                  {
                    speaker: distinctSpeakers[1],
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: voice2 }
                    }
                  }
                ]
              }
            }
          }
        })
        base64Audio = multiResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
      } catch (multiErr) {
        console.warn('[AI TTS] Multi-speaker failed, falling back to clean single-speaker TTS:', multiErr)
      }
    }

    // Fallback or single-speaker monologue: strip character labels so it never reads "Advisor:", "Student:", etc.
    if (!base64Audio) {
      const cleanMonologueText = turns.map(t => t.text).join(' ')
      const singleResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanMonologueText,
                speechMetadata: {
                  style
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice }
            }
          }
        }
      })
      base64Audio = singleResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    }

    if (!base64Audio) {
      throw new Error('No audio data received from Gemini TTS')
    }

    // Cache up to 100 audio tracks
    if (ttsAudioCache.size > 100) {
      const firstKey = ttsAudioCache.keys().next().value
      if (firstKey) ttsAudioCache.delete(firstKey)
    }
    ttsAudioCache.set(cacheKey, base64Audio)

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voice: selectedVoice,
      speakers: distinctSpeakers
    })
  } catch (error: any) {
    console.error('[AI TTS] Error generating natural speech:', error)
    res.status(500).json({
      error: error.message || 'TTS Generation Failed',
      isFallback: true
    })
  }
})

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')))
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
    })
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    })
    app.use(vite.middlewares)
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IELTS Optimizer Server] Running at http://0.0.0.0:${PORT}`)
  })
}

startServer().catch(err => {
  console.error('[IELTS Optimizer Server] Failed to start server:', err)
  process.exit(1)
})
