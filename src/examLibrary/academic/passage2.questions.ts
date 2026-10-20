import type { ExamQuestion } from '../types'

/** Academic Mock Test 1 - Passage 2 questions (14-26): matching-headings (14-19) + sentence completion (20-26). */
export const passage2Questions: ExamQuestion[] = [
  {
    id: 'acad-t1-p2-q14',
    number: 14,
    type: 'matching-headings',
    prompt: 'Paragraph 1',
    answerKey: 'i',
    explanation: 'Paragraph 1 describes the dominant twentieth-century approach and the fragmented landscapes it produced.',
    evidenceQuote: 'conservation meant controlling the number of things in the wild',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q15',
    number: 15,
    type: 'matching-headings',
    prompt: 'Paragraph 2',
    answerKey: 'ii',
    explanation: 'Paragraph 2 sets out the conflict between success for one species and the health of the wider community.',
    evidenceQuote: 'Success measured in terms of one or two charismatic species was not the same as a functioning ecosystem',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q16',
    number: 16,
    type: 'matching-headings',
    prompt: 'Paragraph 3',
    answerKey: 'iii',
    explanation: 'Paragraph 3 defines rewilding as the restoration of underlying processes.',
    evidenceQuote: 'the aim was to restore the processes that generate those outcomes',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q17',
    number: 17,
    type: 'matching-headings',
    prompt: 'Paragraph 4',
    answerKey: 'iv',
    explanation: 'Paragraph 4 explains that the cost of land has confined projects to cheap land.',
    evidenceQuote: 'Rewilding on any meaningful scale requires land, and land is expensive',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q18',
    number: 18,
    type: 'matching-headings',
    prompt: 'Paragraph 5',
    answerKey: 'v',
    explanation: 'Paragraph 5 describes the bison project and the cascade of species that followed.',
    evidenceQuote: 'the important lesson of the project was not the recovery of the bison but the cascade of effects that followed their return',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q19',
    number: 19,
    type: 'matching-headings',
    prompt: 'Paragraph 6',
    answerKey: 'vi',
    explanation: 'Paragraph 6 criticises the way small-scale results are generalised into large-scale claims.',
    evidenceQuote: 'a striking recovery in a small area is generalised into a claim about large-scale restoration',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q20',
    number: 20,
    type: 'sentence-completion',
    prompt: 'Rewilding asks not whether a particular species will be saved, but whether the ______ that once allowed a whole community of species to exist can be brought back.',
    answerKey: 'conditions',
    explanation: 'The passage contrasts saving a species with restoring the conditions that allowed a community to exist.',
    evidenceQuote: 'whether the conditions that had once allowed a whole community of species to exist could be brought back',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q21',
    number: 21,
    type: 'sentence-completion',
    prompt: 'The projects of the 1990s and 2000s were concentrated in places where land could be acquired ______, such as abandoned farmland and decommissioned industrial sites.',
    answerKey: 'cheaply',
    explanation: 'The text states these projects were concentrated where land could be bought cheaply.',
    evidenceQuote: 'concentrated in places where land could be acquired cheaply',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q22',
    number: 22,
    type: 'sentence-completion',
    prompt: 'In the German forest project, the estate was ______ and hunting stopped so that the European bison could be reintroduced.',
    answerKey: 'fenced',
    explanation: 'The passage describes the estate being fenced and hunting stopped.',
    evidenceQuote: 'the entire estate was fenced and hunting stopped',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q23',
    number: 23,
    type: 'sentence-completion',
    prompt: 'Large herbivores opened up dense young woodland, creating the open mosaic of grass and ______ that many ground-nesting birds require.',
    answerKey: 'shrub',
    explanation: 'The passage names grass and shrub as the components of the mosaic.',
    evidenceQuote: 'creating the open mosaic of grass and shrub that many ground-nesting birds require',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q24',
    number: 24,
    type: 'sentence-completion',
    prompt: 'One criticism of rewilding is that the ______ state being restored is itself a matter of scholarly disagreement.',
    answerKey: 'natural',
    explanation: 'The passage says the natural state that is restored is itself disputed among scholars.',
    evidenceQuote: 'the "natural" state being restored is itself a matter of scholarly disagreement',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q25',
    number: 25,
    type: 'sentence-completion',
    prompt: 'Recent proposals are framed less as a revolution in conservation thinking and more as an ______ of the range of tools available.',
    answerKey: 'extension',
    explanation: 'The text describes recent proposals as an extension of the tools available rather than a revolution.',
    evidenceQuote: 'more as an extension of the range of tools available to those trying to repair damaged landscapes',
    passageNumber: 2
  },
  {
    id: 'acad-t1-p2-q26',
    number: 26,
    type: 'sentence-completion',
    prompt: 'The most successful projects share a method rather than a philosophy: the patient accumulation of ______ about what a landscape will do if a particular pressure is removed.',
    answerKey: 'evidence',
    explanation: 'The final paragraph says what unites workable projects is a method involving patient accumulation of evidence.',
    evidenceQuote: 'the patient accumulation of evidence about what a landscape will do if a particular pressure is removed',
    passageNumber: 2
  }
]
