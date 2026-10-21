import type { FullReadingPaper } from '../types'
import { passage1Text } from './passage1.text'
import { passage1Questions } from './passage1.questions'
import { passage2Text } from './passage2.text'
import { passage2Questions } from './passage2.questions'
import { passage2HeadingBank } from './passage2.headings'
import { passage3Text } from './passage3.text'
import { passage3Questions } from './passage3.questions'

/** Academic Mock Test 1 — Reading paper (60 minutes, 40 questions). */
export const academicTest1Reading: FullReadingPaper = {
  id: 'acad-t1-reading',
  title: 'Academic Mock Test 1 — Reading',
  timeAllowedMinutes: 60,
  totalQuestions: 40,
  passages: [
    {
      passageNumber: 1,
      title: 'Urban Heat Islands',
      wordCount: 1010,
      text: passage1Text,
      questions: passage1Questions
    },
    {
      passageNumber: 2,
      title: 'Rewilding: Restoring Processes Rather Than Targets',
      wordCount: 1004,
      text: passage2Text,
      questions: passage2Questions,
      headingBank: passage2HeadingBank
    },
    {
      passageNumber: 3,
      title: 'Why We Sleep',
      wordCount: 937,
      text: passage3Text,
      questions: passage3Questions
    }
  ]
}
