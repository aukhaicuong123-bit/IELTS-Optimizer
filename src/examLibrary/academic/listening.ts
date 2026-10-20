import type { FullListeningPaper } from '../types'
import { academicTest1ListeningSection1Transcript } from './listeningSection1.transcript'
import { academicTest1ListeningSection1Questions } from './listeningSection1.questions'
import { academicTest1ListeningSection2Transcript } from './listeningSection2.transcript'
import { academicTest1ListeningSection2Questions } from './listeningSection2.questions'
import {
  academicTest1ListeningSection3TranscriptPart1,
  academicTest1ListeningSection3TranscriptPart2
} from './listeningSection3.transcript'
import { academicTest1ListeningSection3Questions } from './listeningSection3.questions'
import {
  academicTest1ListeningSection4TranscriptPart1,
  academicTest1ListeningSection4TranscriptPart2
} from './listeningSection4.transcript'
import { academicTest1ListeningSection4Questions } from './listeningSection4.questions'

/** Academic Mock Test 1 — Listening paper (30 minutes, 40 questions). */
export const academicTest1Listening: FullListeningPaper = {
  id: 'acad-t1-listening',
  title: 'Academic Mock Test 1 — Listening',
  timeAllowedMinutes: 30,
  totalQuestions: 40,
  sections: [
    {
      sectionNumber: 1,
      title: 'Campus orientation tour',
      context:
        'A student liaison gives a tour of a new campus building to a group of prospective international students.',
      transcript: academicTest1ListeningSection1Transcript,
      questions: academicTest1ListeningSection1Questions
    },
    {
      sectionNumber: 2,
      title: 'Interview with an agronomist',
      context:
        'An interviewer talks to Dr Helen Marsh about climate-proof farming, soil health and the economics of adaptation.',
      transcript: academicTest1ListeningSection2Transcript,
      questions: academicTest1ListeningSection2Questions
    },
    {
      sectionNumber: 3,
      title: 'Planning a community garden',
      context:
        'Two students work out the budget and site for a proposed community garden before a council deadline.',
      transcript: `${academicTest1ListeningSection3TranscriptPart1}\n\n${academicTest1ListeningSection3TranscriptPart2}`,
      questions: academicTest1ListeningSection3Questions
    },
    {
      sectionNumber: 4,
      title: 'Lecture: medical imaging and false positives',
      context:
        'A lecturer explains base rates, screening errors, radiology workload and computer-assisted detection.',
      transcript: `${academicTest1ListeningSection4TranscriptPart1}\n\n${academicTest1ListeningSection4TranscriptPart2}`,
      questions: academicTest1ListeningSection4Questions
    }
  ]
}
