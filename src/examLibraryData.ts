/**
 * IELTS Optimizer — Full Exam Library Data & Standard IELTS Band Scoring
 *
 * Modeled after ieltsonlinetests.com/ielts-exam-library
 * Features complete, authentic test structures:
 * - Full Reading Test: 3 Passages, 40 Questions, 60 minutes
 * - Full Listening Test: 4 Sections, 40 Questions, 30 minutes
 * - Full Writing Test: Task 1 + Task 2, 60 minutes
 * - Full Speaking Test: Parts 1, 2, 3 (11-14 minutes)
 */

export interface ExamQuestion {
  id: string
  number: number // 1 to 40
  type: 'multiple-choice' | 'true-false-not-given' | 'yes-no-not-given' | 'sentence-completion' | 'matching-headings'
  prompt: string
  options?: string[]
  answerKey: string
  explanation: string
  evidenceQuote: string
  passageNumber?: 1 | 2 | 3
  sectionNumber?: 1 | 2 | 3 | 4
}

export interface ExamPassage {
  passageNumber: 1 | 2 | 3
  title: string
  wordCount: number
  text: string
  questions: ExamQuestion[]
}

export interface FullReadingPaper {
  id: string
  title: string
  timeAllowedMinutes: 60
  totalQuestions: 40
  passages: ExamPassage[]
}

export interface FullListeningSection {
  sectionNumber: 1 | 2 | 3 | 4
  title: string
  context: string
  transcript: string
  questions: ExamQuestion[]
}

export interface FullListeningPaper {
  id: string
  title: string
  timeAllowedMinutes: 30
  totalQuestions: 40
  sections: FullListeningSection[]
}

export interface FullWritingPaper {
  id: string
  title: string
  timeAllowedMinutes: 60
  task1: {
    title: string
    prompt: string
    type: 'academic_task1' | 'general_task1'
    stimulusType: 'chart' | 'diagram' | 'table' | 'letter'
    stimulusDescription: string
    minimumWords: 150
    modelAnswer?: string
  }
  task2: {
    title: string
    prompt: string
    minimumWords: 250
    modelAnswer?: string
  }
}

export interface FullSpeakingPaper {
  id: string
  title: string
  part1: {
    topic: string
    questions: string[]
    modelAnswers?: string[]
  }
  part2: {
    topic: string
    prompt: string
    cueCardBullets: string[]
    prepTimeSeconds: 60
    speakingTimeSeconds: 120
    modelAnswer?: string
  }
  part3: {
    topic: string
    questions: string[]
    modelAnswers?: string[]
  }
}

export interface FullIELTSExam {
  id: string
  code: string // e.g. "IELTS-ACTUAL-2026-VOL1-TEST1"
  title: string
  volume: string
  module: 'Academic' | 'General Training'
  difficulty: 'Standard Exam'
  completedCount: number
  averageBand: number
  reading: FullReadingPaper
  listening: FullListeningPaper
  writing: FullWritingPaper
  speaking: FullSpeakingPaper
}

/**
 * Standard Academic Reading raw score to Band Score conversion table
 * Source: Official Cambridge IELTS scoring standards
 */
export function calculateAcademicReadingBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0
  if (rawScore >= 37) return 8.5
  if (rawScore >= 35) return 8.0
  if (rawScore >= 33) return 7.5
  if (rawScore >= 30) return 7.0
  if (rawScore >= 27) return 6.5
  if (rawScore >= 23) return 6.0
  if (rawScore >= 19) return 5.5
  if (rawScore >= 15) return 5.0
  if (rawScore >= 13) return 4.5
  if (rawScore >= 10) return 4.0
  if (rawScore >= 8) return 3.5
  if (rawScore >= 6) return 3.0
  if (rawScore >= 4) return 2.5
  return 2.0
}

/**
 * Standard Listening raw score to Band Score conversion table
 * Source: Official Cambridge IELTS scoring standards
 */
export function calculateListeningBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0
  if (rawScore >= 37) return 8.5
  if (rawScore >= 35) return 8.0
  if (rawScore >= 32) return 7.5
  if (rawScore >= 30) return 7.0
  if (rawScore >= 26) return 6.5
  if (rawScore >= 23) return 6.0
  if (rawScore >= 18) return 5.5
  if (rawScore >= 16) return 5.0
  if (rawScore >= 13) return 4.5
  if (rawScore >= 10) return 4.0
  if (rawScore >= 8) return 3.5
  if (rawScore >= 6) return 3.0
  return 2.5
}

// =========================================================================
// FULL EXAM 1: IELTS ACADEMIC PRACTICE TEST 1 (Recent Actual Collection 2026)
// =========================================================================

const firstAcademicExam: FullIELTSExam = {
    id: 'ielts-exam-acad-01',
    code: 'IELTS-ACTUAL-2026-VOL1-TEST1',
    title: 'IELTS Academic Practice Test 1',
    volume: 'Recent Actual Tests 2026 — Volume 1',
    module: 'Academic',
    difficulty: 'Standard Exam',
    completedCount: 1420,
    averageBand: 6.5,
    listening: {
      id: 'listening-paper-01',
      title: 'Academic Listening — Full 40 Questions (4 Sections)',
      timeAllowedMinutes: 30,
      totalQuestions: 40,
      sections: [
        {
          sectionNumber: 1,
          title: 'Section 1: University Student Accommodation Booking',
          context: 'A student enquiring about accommodation options with a housing officer.',
          transcript: `Officer: Good morning, Westfield University Student Housing Office. How can I help you today?
Student: Hello, my name is Alex Turner. I have been accepted for the Master's in Data Science starting this autumn, and I would like to enquire about university-managed accommodation.
Officer: Congratulations on your admission, Alex! We have several options. For postgraduates, the most popular choice is Victoria Court, which offers en-suite single study bedrooms with a shared kitchen between four students.
Student: That sounds suitable. Is the kitchen fully equipped, or do we need to bring our own utensils?
Officer: The kitchen includes a refrigerator, microwave, and electric oven. However, students should bring their own cooking pans and cutlery.
Student: What is the contract length? Is it for 40 weeks or the full 52 weeks?
Officer: Postgraduate contracts are 50 weeks, beginning on the 15th of September. The weekly rental rate is 175 pounds, which conveniently includes all utilities and high-speed broadband internet.
Student: And what about the security deposit?
Officer: The refundable deposit is 350 pounds, payable upon signing the agreement.
Student: Are there laundry facilities on site?
Officer: Yes, a self-service card-operated laundry room is located in the basement of Block B.
Student: Perfect. What about bicycle storage? I plan to cycle to campus.
Officer: We have a secure, sheltered bicycle shed accessible only with your student swipe card. Car parking, however, is strictly restricted to students with mobility requirements.
Student: Understood. How do I proceed with the reservation?
Officer: You can complete the application form on our student portal before the 31st of July.`,
          questions: [
            {
              id: 'e1-l-q1',
              number: 1,
              type: 'sentence-completion',
              prompt: 'The recommended postgraduate residence is named _____ Court.',
              options: ['Victoria', 'Albert', 'Elizabeth', 'Windsor'],
              answerKey: 'Victoria',
              explanation: 'The officer specifies that Victoria Court is the most popular choice for postgraduates.',
              evidenceQuote: 'the most popular choice is Victoria Court',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q2',
              number: 2,
              type: 'sentence-completion',
              prompt: 'How many students share each kitchen in the residence?',
              options: ['Four', 'Two', 'Six', 'Eight'],
              answerKey: 'Four',
              explanation: 'The officer mentions a shared kitchen between four students.',
              evidenceQuote: 'shared kitchen between four students',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q3',
              number: 3,
              type: 'multiple-choice',
              prompt: 'Which item is NOT provided in the shared kitchen?',
              options: ['Cooking pans and cutlery', 'Electric oven', 'Microwave', 'Refrigerator'],
              answerKey: 'Cooking pans and cutlery',
              explanation: 'The officer states students should bring their own cooking pans and cutlery.',
              evidenceQuote: 'students should bring their own cooking pans and cutlery',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q4',
              number: 4,
              type: 'sentence-completion',
              prompt: 'The postgraduate accommodation contract lasts for _____ weeks.',
              options: ['50', '40', '52', '48'],
              answerKey: '50',
              explanation: 'Postgraduate contracts are 50 weeks.',
              evidenceQuote: 'Postgraduate contracts are 50 weeks',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q5',
              number: 5,
              type: 'sentence-completion',
              prompt: 'The weekly rental fee is _____ pounds including utilities and internet.',
              options: ['175', '150', '200', '185'],
              answerKey: '175',
              explanation: 'The weekly rental rate is 175 pounds.',
              evidenceQuote: 'The weekly rental rate is 175 pounds',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q6',
              number: 6,
              type: 'sentence-completion',
              prompt: 'The security deposit amount required is _____ pounds.',
              options: ['350', '250', '400', '500'],
              answerKey: '350',
              explanation: 'The refundable deposit is 350 pounds.',
              evidenceQuote: 'The refundable deposit is 350 pounds',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q7',
              number: 7,
              type: 'multiple-choice',
              prompt: 'Where is the laundry room located?',
              options: ['Basement of Block B', 'Ground floor of Block A', 'Next to the dining hall', 'Opposite the main reception'],
              answerKey: 'Basement of Block B',
              explanation: 'The self-service laundry room is located in the basement of Block B.',
              evidenceQuote: 'located in the basement of Block B',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q8',
              number: 8,
              type: 'multiple-choice',
              prompt: 'How is the bicycle storage accessed?',
              options: ['Student swipe card', 'Combination padlock', 'Physical brass key', 'Thumbprint scanner'],
              answerKey: 'Student swipe card',
              explanation: 'The bicycle shed is accessible only with your student swipe card.',
              evidenceQuote: 'accessible only with your student swipe card',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q9',
              number: 9,
              type: 'multiple-choice',
              prompt: 'Who is allowed to park cars on the premises?',
              options: [
                'Students with mobility requirements only',
                'All postgraduate students',
                'Any student paying an annual parking permit',
                'Final year undergraduate students only'
              ],
              answerKey: 'Students with mobility requirements only',
              explanation: 'Car parking is strictly restricted to students with mobility requirements.',
              evidenceQuote: 'strictly restricted to students with mobility requirements',
              sectionNumber: 1
            },
            {
              id: 'e1-l-q10',
              number: 10,
              type: 'sentence-completion',
              prompt: 'The deadline for submitting the application form is the 31st of _____.',
              options: ['July', 'August', 'September', 'June'],
              answerKey: 'July',
              explanation: 'The form must be completed before the 31st of July.',
              evidenceQuote: 'before the 31st of July',
              sectionNumber: 1
            }
          ]
        },
        {
          sectionNumber: 2,
          title: 'Section 2: Riverdale Nature Reserve Orientation',
          context: 'A talk by the head park ranger introducing the reserve facilities and conservation programmes.',
          transcript: `Ranger: Good afternoon everyone, and welcome to the Riverdale Nature Reserve orientation. My name is Gordon Vance, the Senior Ranger here. Spanning over 450 hectares of protected wetlands, ancient oak woodlands, and tidal salt marshes, Riverdale is designated as a site of special scientific interest.
First, a few logistical details about our Visitor Centre. The centre is open daily from 9:00 AM to 5:30 PM throughout the summer season. Admission to the trails is completely free, though we encourage a voluntary donation of three pounds to support our wildlife rehabilitation efforts.
We have three primary walking loops. The blue trail, known as the Heron Boardwalk, is 1.5 kilometres long, fully wheelchair accessible, and takes about thirty minutes. It leads directly to our main observation hide overlooking the tidal lagoon. The red trail extends 4.2 kilometres through the dense deciduous forest; please note this path has rough terrain and sturdy hiking boots are strongly advised. Lastly, the yellow route traces the riverbank and connects with the historic watermill.
Regarding wildlife viewing, the optimum window for observing migratory waders and kingfishers is two hours prior to high tide, when birds congregate on the exposed mudflats. We provide binoculars for rent at the reception desk for a nominal fee of two pounds.
For safety, dogs must be kept on a short lead at all times to prevent disturbance to ground-nesting lapwings. Picnicking is permitted exclusively in the designated orchard area near the car park, and all litter must be carried out.
Finally, we run volunteer conservation workdays every second Saturday of the month, focusing on invasive rhododendron clearance and pond clearing. Anyone interested can register at the counter.`,
          questions: [
            {
              id: 'e1-l-q11',
              number: 11,
              type: 'multiple-choice',
              prompt: 'What is the total area covered by Riverdale Nature Reserve?',
              options: ['Over 450 hectares', 'Around 250 hectares', '300 acres', '600 hectares'],
              answerKey: 'Over 450 hectares',
              explanation: 'The ranger notes Riverdale spans over 450 hectares.',
              evidenceQuote: 'Spanning over 450 hectares of protected wetlands',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q12',
              number: 12,
              type: 'multiple-choice',
              prompt: 'What time does the Visitor Centre close during the summer season?',
              options: ['5:30 PM', '6:00 PM', '5:00 PM', '4:30 PM'],
              answerKey: '5:30 PM',
              explanation: 'Open daily from 9:00 AM to 5:30 PM.',
              evidenceQuote: 'open daily from 9:00 AM to 5:30 PM',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q13',
              number: 13,
              type: 'sentence-completion',
              prompt: 'Which walking route is fully wheelchair accessible?',
              options: ['Blue trail (Heron Boardwalk)', 'Red trail', 'Yellow route', 'Green forest loop'],
              answerKey: 'Blue trail (Heron Boardwalk)',
              explanation: 'The blue trail, Heron Boardwalk, is fully wheelchair accessible.',
              evidenceQuote: 'The blue trail, known as the Heron Boardwalk, is 1.5 kilometres long, fully wheelchair accessible',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q14',
              number: 14,
              type: 'multiple-choice',
              prompt: 'Why are sturdy hiking boots recommended for the red trail?',
              options: ['The path has rough terrain', 'There are deep river crossings', 'Mud is permanently knee-deep', 'Steep cliff edges require climbing gear'],
              answerKey: 'The path has rough terrain',
              explanation: 'The red trail has rough terrain and sturdy hiking boots are advised.',
              evidenceQuote: 'please note this path has rough terrain and sturdy hiking boots are strongly advised',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q15',
              number: 15,
              type: 'sentence-completion',
              prompt: 'The yellow walking route connects with a historic _____.',
              options: ['watermill', 'lighthouse', 'stone bridge', 'iron foundry'],
              answerKey: 'watermill',
              explanation: 'The yellow route connects with the historic watermill.',
              evidenceQuote: 'connects with the historic watermill',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q16',
              number: 16,
              type: 'multiple-choice',
              prompt: 'When is the best time to observe migratory birds on the mudflats?',
              options: ['Two hours before high tide', 'At sunrise', 'Exactly at low tide', 'During late afternoon sunset'],
              answerKey: 'Two hours before high tide',
              explanation: 'The optimum window is two hours prior to high tide.',
              evidenceQuote: 'optimum window for observing migratory waders and kingfishers is two hours prior to high tide',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q17',
              number: 17,
              type: 'sentence-completion',
              prompt: 'Binocular rental at the reception desk costs _____ pounds.',
              options: ['two', 'three', 'five', 'four'],
              answerKey: 'two',
              explanation: 'Binoculars for rent for a nominal fee of two pounds.',
              evidenceQuote: 'binoculars for rent at the reception desk for a nominal fee of two pounds',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q18',
              number: 18,
              type: 'multiple-choice',
              prompt: 'Why must dogs be kept on leads?',
              options: [
                'To prevent disturbance to ground-nesting birds',
                'Because cattle roam freely on the trail',
                'To stop them swimming in the irrigation pond',
                'Due to local municipal council bylaws'
              ],
              answerKey: 'To prevent disturbance to ground-nesting birds',
              explanation: 'Dogs must be kept on a lead to prevent disturbance to ground-nesting lapwings.',
              evidenceQuote: 'prevent disturbance to ground-nesting lapwings',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q19',
              number: 19,
              type: 'sentence-completion',
              prompt: 'Picnics are allowed only in the designated _____ area.',
              options: ['orchard', 'meadow', 'boardwalk', 'watermill lawn'],
              answerKey: 'orchard',
              explanation: 'Picnicking is permitted exclusively in the designated orchard area.',
              evidenceQuote: 'permitted exclusively in the designated orchard area near the car park',
              sectionNumber: 2
            },
            {
              id: 'e1-l-q20',
              number: 20,
              type: 'multiple-choice',
              prompt: 'When do volunteer conservation sessions take place?',
              options: ['Every second Saturday of the month', 'Every Sunday morning', 'First Monday of each month', 'Twice weekly on Wednesdays and Fridays'],
              answerKey: 'Every second Saturday of the month',
              explanation: 'Volunteer workdays happen every second Saturday of the month.',
              evidenceQuote: 'volunteer conservation workdays every second Saturday of the month',
              sectionNumber: 2
            }
          ]
        },
        {
          sectionNumber: 3,
          title: 'Section 3: Sustainable Geopolymer Concrete Tutorial',
          context: 'Two engineering students discussing their dissertation findings with their academic supervisor.',
          transcript: `Professor: Good afternoon, Chloe, Liam. Let us review the preliminary data for your research project on geopolymer concrete formulations. Liam, what was the primary motivation behind substituting Ordinary Portland Cement?
Liam: Well, Dr. Harris, traditional Portland cement manufacturing accounts for approximately eight percent of worldwide anthropogenic carbon emissions, predominantly due to the high-temperature calcination of limestone at 1450 degrees Celsius. In contrast, geopolymers synthesize industrial byproducts like pulverized fly ash and ground granulated blast furnace slag.
Professor: Excellent. And Chloe, how did your laboratory test batches behave regarding 28-day compressive strength?
Chloe: We evaluated three ratios of sodium silicate to sodium hydroxide activator solutions. Mixture B, which contained sixty percent blast furnace slag and forty percent fly ash cured at ambient room temperature, achieved a compressive strength of 52 megapascals, comfortably exceeding the 40 megapascal benchmark required for commercial structural precast beams.
Liam: However, we observed that workability decreased drastically when the alkali activator dosage exceeded twelve percent by mass. The setting time accelerated to under fifteen minutes, which would pose significant challenges during on-site pouring and compaction.
Professor: That is a well-documented phenomenon. How do you propose mitigating rapid flash-setting in commercial applications?
Chloe: We researched incorporating organic setting retarders, specifically sodium citrate or borax at 1.5 percent concentrations. Preliminary trials demonstrated that sodium citrate extended workability to seventy minutes without compromising ultimate mechanical integrity.
Professor: Good problem-solving. What about acid resistance and chloride ion penetration tests?
Liam: Geopolymer specimens demonstrated superior durability against sulfuric acid immersion, suffering only 2.1 percent mass loss compared to nearly fourteen percent in conventional Portland concrete.
Professor: Impressive. For your final submission, make sure you complete the life-cycle carbon audit and deliver the draft by Friday the 18th.`,
          questions: [
            {
              id: 'e1-l-q21',
              number: 21,
              type: 'multiple-choice',
              prompt: 'What percentage of global anthropogenic CO2 emissions does traditional cement production cause?',
              options: ['Approximately eight percent', 'Nearly fifteen percent', 'Five percent', 'Over twenty percent'],
              answerKey: 'Approximately eight percent',
              explanation: 'Liam notes traditional cement accounts for approximately eight percent of worldwide carbon emissions.',
              evidenceQuote: 'accounts for approximately eight percent of worldwide anthropogenic carbon emissions',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q22',
              number: 22,
              type: 'multiple-choice',
              prompt: 'At what temperature is limestone calcined in Portland cement kilns?',
              options: ['1450 degrees Celsius', '1000 degrees Celsius', '1200 degrees Celsius', '1800 degrees Celsius'],
              answerKey: '1450 degrees Celsius',
              explanation: 'High-temperature calcination of limestone at 1450 degrees Celsius.',
              evidenceQuote: 'calcination of limestone at 1450 degrees Celsius',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q23',
              number: 23,
              type: 'sentence-completion',
              prompt: 'Geopolymers utilize industrial byproducts such as pulverized _____ and blast furnace slag.',
              options: ['fly ash', 'silica sand', 'clay powder', 'crushed shale'],
              answerKey: 'fly ash',
              explanation: 'Byproducts like pulverized fly ash and ground blast furnace slag.',
              evidenceQuote: 'industrial byproducts like pulverized fly ash and ground granulated blast furnace slag',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q24',
              number: 24,
              type: 'sentence-completion',
              prompt: 'Mixture B achieved a compressive strength of _____ megapascals at 28 days.',
              options: ['52', '40', '65', '48'],
              answerKey: '52',
              explanation: 'Mixture B achieved a compressive strength of 52 megapascals.',
              evidenceQuote: 'achieved a compressive strength of 52 megapascals',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q25',
              number: 25,
              type: 'multiple-choice',
              prompt: 'What occurred when the alkali activator dosage exceeded twelve percent?',
              options: [
                'Setting time accelerated to under 15 minutes',
                'The concrete failed to harden after 48 hours',
                'Cracks developed immediately during mixing',
                'Color changed from grey to bright orange'
              ],
              answerKey: 'Setting time accelerated to under 15 minutes',
              explanation: 'Liam states setting time accelerated to under fifteen minutes.',
              evidenceQuote: 'The setting time accelerated to under fifteen minutes',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q26',
              number: 26,
              type: 'sentence-completion',
              prompt: 'What additive was chosen to prolong workability without harming strength?',
              options: ['sodium citrate', 'calcium chloride', 'sulfuric acid', 'gypsum powder'],
              answerKey: 'sodium citrate',
              explanation: 'Preliminary trials demonstrated sodium citrate extended workability.',
              evidenceQuote: 'sodium citrate extended workability to seventy minutes without compromising ultimate mechanical integrity',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q27',
              number: 27,
              type: 'sentence-completion',
              prompt: 'Sodium citrate extended workability time to _____ minutes.',
              options: ['seventy', 'forty', 'sixty', 'ninety'],
              answerKey: 'seventy',
              explanation: 'Extended workability to seventy minutes.',
              evidenceQuote: 'extended workability to seventy minutes',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q28',
              number: 28,
              type: 'multiple-choice',
              prompt: 'How did geopolymer concrete perform in the sulfuric acid immersion test?',
              options: [
                'Suffered only 2.1% mass loss',
                'Dissolved completely within 7 days',
                'Suffered 14% mass loss like Portland cement',
                'Gained mass due to chemical absorption'
              ],
              answerKey: 'Suffered only 2.1% mass loss',
              explanation: 'Geopolymer specimens suffered only 2.1 percent mass loss compared to nearly 14 percent in Portland.',
              evidenceQuote: 'suffering only 2.1 percent mass loss compared to nearly fourteen percent',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q29',
              number: 29,
              type: 'sentence-completion',
              prompt: 'Dr. Harris instructs the students to complete a life-cycle _____ audit.',
              options: ['carbon', 'financial', 'water', 'energy'],
              answerKey: 'carbon',
              explanation: 'Make sure you complete the life-cycle carbon audit.',
              evidenceQuote: 'complete the life-cycle carbon audit',
              sectionNumber: 3
            },
            {
              id: 'e1-l-q30',
              number: 30,
              type: 'sentence-completion',
              prompt: 'The final draft is due by Friday the _____ of the month.',
              options: ['18th', '15th', '21st', '25th'],
              answerKey: '18th',
              explanation: 'Deliver the draft by Friday the 18th.',
              evidenceQuote: 'deliver the draft by Friday the 18th',
              sectionNumber: 3
            }
          ]
        },
        {
          sectionNumber: 4,
          title: 'Section 4: Deep-Sea Hydrothermal Vent Ecosystems',
          context: 'An academic biology lecture on chemosynthetic organisms and extreme environments.',
          transcript: `Lecturer: Today we examine one of the most astonishing biological discoveries of the late twentieth century: hydrothermal vent ecosystems situated along mid-ocean tectonic spreading ridges. Until their discovery in 1977 near the Galapagos Rift by the submersible Alvin, terrestrial science operated on the fundamental premise that all planetary ecosystems depend inextricably on solar phototrophy.
Hydrothermal vents, or black smokers, emerge where tectonic plates diverge. Seawater percolates deep into oceanic fissures, is superheated by underlying magma chambers to temperatures exceeding 400 degrees Celsius, and dissolves heavy minerals including iron, copper, and zinc sulfides. The extreme hydrostatic pressure—often exceeding 250 atmospheres—prevents this superheated liquid from boiling. As it erupts into freezing bottom water, minerals precipitate, forming towering chimney structures.
In total darkness, life flourishes without sunlight. The base of the trophic web consists not of photosynthetic plants, but of chemolithoautotrophic bacteria. These extremophile microbes oxidize hydrogen sulfide gas emanating from the vents, fixing inorganic carbon dioxide into organic carbohydrates.
The most conspicuous megafauna inhabiting these vents is the giant tube worm, Riftia pachyptila, which can reach lengths of over two meters. Uniquely, mature tube worms possess no mouth, gut, or digestive tract whatsoever. Instead, they rely on an internal organ called the trophosome, densely colonized by symbiotic sulfur-oxidizing bacteria. The worm's bright red plume contains a specialized form of hemoglobin capable of binding both oxygen and toxic hydrogen sulfide simultaneously, delivering these metabolic substrates directly to its internal symbionts.
Other specialized organisms include the Pompeii worm, Alvinella pompejana, recognized as one of the most heat-tolerant animals known, tolerating continuous temperatures of 80 degrees Celsius thanks to a protective layer of epibiotic bacteria that acts as thermal insulation.
Studying these deep-sea extremophiles holds profound significance. Enzymes isolated from vent bacteria exhibit exceptional thermal stability, revolutionizing molecular biology and PCR diagnostic technology. Furthermore, vent systems provide the leading planetary model for astrobiologists seeking potential extraterrestrial life within the sub-surface oceans of icy moons such as Jupiter's Europa and Saturn's Enceladus.`,
          questions: [
            {
              id: 'e1-l-q31',
              number: 31,
              type: 'multiple-choice',
              prompt: 'In which year were hydrothermal vent ecosystems first discovered by the submersible Alvin?',
              options: ['1977', '1969', '1985', '1992'],
              answerKey: '1977',
              explanation: 'Discovered in 1977 near the Galapagos Rift.',
              evidenceQuote: 'Until their discovery in 1977 near the Galapagos Rift by the submersible Alvin',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q32',
              number: 32,
              type: 'sentence-completion',
              prompt: 'The superheated hydrothermal fluids can reach temperatures exceeding _____ degrees Celsius.',
              options: ['400', '250', '300', '500'],
              answerKey: '400',
              explanation: 'Superheated by underlying magma chambers to temperatures exceeding 400 degrees Celsius.',
              evidenceQuote: 'superheated by underlying magma chambers to temperatures exceeding 400 degrees Celsius',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q33',
              number: 33,
              type: 'multiple-choice',
              prompt: 'Why does the superheated fluid not boil into steam inside the vents?',
              options: [
                'Extreme hydrostatic pressure exceeding 250 atmospheres',
                'High salinity prevents phase change',
                'Immediate cooling by basalt bedrock',
                'Presence of mineral sulfur catalysts'
              ],
              answerKey: 'Extreme hydrostatic pressure exceeding 250 atmospheres',
              explanation: 'The extreme hydrostatic pressure exceeding 250 atmospheres prevents boiling.',
              evidenceQuote: 'The extreme hydrostatic pressure—often exceeding 250 atmospheres—prevents this superheated liquid from boiling',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q34',
              number: 34,
              type: 'sentence-completion',
              prompt: 'The primary producers at the base of the vent food web are chemolithoautotrophic _____.',
              options: ['bacteria', 'algae', 'plankton', 'fungi'],
              answerKey: 'bacteria',
              explanation: 'The base consists of chemolithoautotrophic bacteria.',
              evidenceQuote: 'consists not of photosynthetic plants, but of chemolithoautotrophic bacteria',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q35',
              number: 35,
              type: 'multiple-choice',
              prompt: 'What gas do vent microbes oxidize to fix carbon into organic nutrients?',
              options: ['Hydrogen sulfide', 'Methane gas', 'Nitrogen dioxide', 'Carbon monoxide'],
              answerKey: 'Hydrogen sulfide',
              explanation: 'Microbes oxidize hydrogen sulfide gas emanating from vents.',
              evidenceQuote: 'oxidize hydrogen sulfide gas emanating from the vents',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q36',
              number: 36,
              type: 'sentence-completion',
              prompt: 'The giant tube worm Riftia pachyptila lacks a mouth and digestive gut, relying on an organ called the _____.',
              options: ['trophosome', 'chloroplast', 'plume', 'operculum'],
              answerKey: 'trophosome',
              explanation: 'Relying on an internal organ called the trophosome.',
              evidenceQuote: 'Instead, they rely on an internal organ called the trophosome',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q37',
              number: 37,
              type: 'multiple-choice',
              prompt: 'What is unique about the hemoglobin in the giant tube worm?',
              options: [
                'Binds both oxygen and toxic hydrogen sulfide simultaneously',
                'Contains copper atoms instead of iron atoms',
                'Flows freely without any vascular vessels',
                'Crystallizes when exposed to cold temperatures'
              ],
              answerKey: 'Binds both oxygen and toxic hydrogen sulfide simultaneously',
              explanation: 'Specialized hemoglobin binding both oxygen and toxic hydrogen sulfide simultaneously.',
              evidenceQuote: 'capable of binding both oxygen and toxic hydrogen sulfide simultaneously',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q38',
              number: 38,
              type: 'sentence-completion',
              prompt: 'The Pompeii worm Alvinella pompejana tolerates sustained temperatures of up to _____ degrees Celsius.',
              options: ['80', '60', '100', '120'],
              answerKey: '80',
              explanation: 'Tolerating continuous temperatures of 80 degrees Celsius.',
              evidenceQuote: 'tolerating continuous temperatures of 80 degrees Celsius',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q39',
              number: 39,
              type: 'multiple-choice',
              prompt: 'How has the study of vent bacterial enzymes benefited scientific technology?',
              options: [
                'Revolutionized PCR and molecular biology with heat-stable enzymes',
                'Allowed commercial deep-sea drilling without metal corrosion',
                'Provided an antidote against snake venom toxicity',
                'Replaced artificial nitrogen fertilizer in agriculture'
              ],
              answerKey: 'Revolutionized PCR and molecular biology with heat-stable enzymes',
              explanation: 'Vent enzymes revolutionized molecular biology and PCR diagnostic technology.',
              evidenceQuote: 'Enzymes isolated from vent bacteria exhibit exceptional thermal stability, revolutionizing molecular biology and PCR diagnostic technology',
              sectionNumber: 4
            },
            {
              id: 'e1-l-q40',
              number: 40,
              type: 'sentence-completion',
              prompt: 'Hydrothermal vents serve as an analog for potential extraterrestrial life on icy moons such as _____.',
              options: ['Europa', 'Titan', 'Mars', 'Io'],
              answerKey: 'Europa',
              explanation: 'Planetary model for sub-surface oceans of icy moons such as Europa.',
              evidenceQuote: 'oceans of icy moons such as Jupiter\'s Europa and Saturn\'s Enceladus',
              sectionNumber: 4
            }
          ]
        }
      ]
    },
    reading: {
      id: 'reading-paper-01',
      title: 'Academic Reading — Full 40 Questions (3 Passages)',
      timeAllowedMinutes: 60,
      totalQuestions: 40,
      passages: [
        {
          passageNumber: 1,
          title: 'Passage 1: The Domestication of the Honeybee and Ancient Agriculture',
          wordCount: 840,
          text: `The relationship between human civilizations and the Western honeybee (Apis mellifera) extends into antiquity far earlier than previously documented by archeological scholarship. Analysis of lipid residues preserved inside Neolithic ceramic vessels across Europe and the Near East reveals widespread exploitation of bee products dating back nearly nine thousand years. In prehistoric farming settlements throughout the Anatolian plateau and the Fertile Crescent, beeswax was regularly deployed as a waterproofing sealant for grain storage jars and as a binding resin in stone tool hafting.

By the third millennium BCE, the Old Kingdom of Egypt had industrialized apiculture on an unprecedented scale. Hieroglyphic wall reliefs in the sun temple of Nyuserre Ini depict apiarists tending cylindrical ceramic hives stacked in horizontal rows. These hives were periodically moved on wooden barges along the Nile to synchronize with seasonal crop blooming cycles, establishing the earliest historical record of migratory beekeeping. In ancient Egyptian cosmology, honeybees were venerated as the tears of the sun deity Ra, and purified honey served as an indispensable embalming medium and medical antibiotic.

During the Greco-Roman period, observational knowledge of bee colony governance advanced considerably, although anatomical misconceptions persisted. Aristotle documented the division of labor among nectar collectors, comb builders, and hive sentinels in his Historia Animalium, yet he mistakenly classified the queen bee as a male "king." The agricultural writer Columella provided detailed instructions on smoker construction, swarm prevention, and selective honey harvesting that preserved the winter stores of colonies.

However, traditional apiculture relied on destructive harvesting methods. Skeps woven from straw or hollowed log hives had to be smothered with burning sulfur fumes to extract wax and honey, inevitably killing the entire colony. It was not until 1851 that the American clergyman Lorenzo Langstroth discovered the principle of "bee space"—a precise spatial corridor measuring between 6.4 and 9.5 millimeters. If hive components maintain this clearance, bees will neither bridge the gap with comb nor cement it with sticky propolis. Langstroth patented the movable-frame hive, permitting beekeepers to inspect combs and extract honey without harming the brood or queen, transforming beekeeping into a modern sustainable industry.`,
          questions: [
            {
              id: 'e1-p1-q1',
              number: 1,
              type: 'multiple-choice',
              prompt: 'According to Paragraph 1, what did Neolithic farmers use beeswax for?',
              options: [
                'Waterproofing jars and binding stone tools',
                'Preserving honeybee specimens in clay vessels',
                'Lighting temples and decorative embalming',
                'Fueling ceramic kilns for pottery manufacturing'
              ],
              answerKey: 'Waterproofing jars and binding stone tools',
              explanation: 'The text notes beeswax was deployed as a waterproofing sealant for grain jars and as a binding resin in stone tool hafting.',
              evidenceQuote: 'beeswax was regularly deployed as a waterproofing sealant for grain storage jars and as a binding resin in stone tool hafting',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q2',
              number: 2,
              type: 'true-false-not-given',
              prompt: 'Ancient Egyptian apiarists transported hives along the Nile to follow flowering crops.',
              answerKey: 'TRUE',
              explanation: 'The text confirms hives were moved on wooden barges along the Nile to synchronize with seasonal blooming cycles.',
              evidenceQuote: 'These hives were periodically moved on wooden barges along the Nile to synchronize with seasonal crop blooming cycles',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q3',
              number: 3,
              type: 'true-false-not-given',
              prompt: 'Aristotle correctly identified the biological sex of the queen bee.',
              answerKey: 'FALSE',
              explanation: 'Aristotle mistakenly classified the queen bee as a male "king".',
              evidenceQuote: 'yet he mistakenly classified the queen bee as a male "king"',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q4',
              number: 4,
              type: 'multiple-choice',
              prompt: 'What was the major drawback of traditional skeps and hollowed log hives?',
              options: [
                'Sulfur fumes killed the whole colony during harvesting',
                'Straw skeps allowed rainwater to ruin the brood combs',
                'Log hives attracted too many hornets and wasps',
                'Sulfur residues made honey toxic for human consumption'
              ],
              answerKey: 'Sulfur fumes killed the whole colony during harvesting',
              explanation: 'Colonies had to be smothered with burning sulfur fumes to extract honey, killing the entire colony.',
              evidenceQuote: 'had to be smothered with burning sulfur fumes to extract wax and honey, inevitably killing the entire colony',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q5',
              number: 5,
              type: 'sentence-completion',
              prompt: 'Lorenzo Langstroth revolutionized apiculture by discovering the exact spatial corridor known as _____.',
              options: ['bee space', 'propolis gap', 'honey corridor', 'langstroth margin'],
              answerKey: 'bee space',
              explanation: 'Langstroth discovered the principle of "bee space" measuring between 6.4 and 9.5 mm.',
              evidenceQuote: 'Lorenzo Langstroth discovered the principle of "bee space"—a precise spatial corridor',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q6',
              number: 6,
              type: 'true-false-not-given',
              prompt: 'Bees will fill any gap smaller than 6.4 millimeters with honey.',
              answerKey: 'NOT GIVEN',
              explanation: 'The passage explains bee space prevents comb bridging or propolis cement, but does not state gaps smaller than 6.4mm are filled with honey.',
              evidenceQuote: 'If hive components maintain this clearance, bees will neither bridge the gap with comb nor cement it with sticky propolis',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q7',
              number: 7,
              type: 'multiple-choice',
              prompt: 'How did Langstroth\'s movable-frame hive transform beekeeping?',
              options: [
                'Permitted honey extraction without destroying the colony or brood',
                'Tripled the quantity of royal jelly produced each spring',
                'Eliminated the necessity for smoker construction',
                'Automated wax separation from raw honeycomb'
              ],
              answerKey: 'Permitted honey extraction without destroying the colony or brood',
              explanation: 'It allowed inspecting combs and extracting honey without harming the brood or queen.',
              evidenceQuote: 'permitting beekeepers to inspect combs and extract honey without harming the brood or queen',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q8',
              number: 8,
              type: 'true-false-not-given',
              prompt: 'Lipid analysis confirmed beekeeping in the Americas predated European colonization.',
              answerKey: 'NOT GIVEN',
              explanation: 'The passage discusses Neolithic findings in Europe and the Near East, making no claim about pre-Columbian Americas.',
              evidenceQuote: 'Analysis of lipid residues preserved inside Neolithic ceramic vessels across Europe and the Near East',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q9',
              number: 9,
              type: 'sentence-completion',
              prompt: 'In Egyptian religious beliefs, honeybees were regarded as the tears of _____.',
              options: ['Ra', 'Osiris', 'Anubis', 'Horus'],
              answerKey: 'Ra',
              explanation: 'Honeybees were venerated as the tears of the sun deity Ra.',
              evidenceQuote: 'honeybees were venerated as the tears of the sun deity Ra',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q10',
              number: 10,
              type: 'multiple-choice',
              prompt: 'Which Roman writer gave advice on selective harvesting to preserve colonies over winter?',
              options: ['Columella', 'Aristotle', 'Nyuserre Ini', 'Langstroth'],
              answerKey: 'Columella',
              explanation: 'The agricultural writer Columella provided detailed instructions.',
              evidenceQuote: 'The agricultural writer Columella provided detailed instructions on smoker construction',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q11',
              number: 11,
              type: 'true-false-not-given',
              prompt: 'Bees use propolis as a flexible honey container.',
              answerKey: 'FALSE',
              explanation: 'The text notes propolis is a sticky cement used to fill gaps, not a flexible honey container.',
              evidenceQuote: 'cement it with sticky propolis',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q12',
              number: 12,
              type: 'sentence-completion',
              prompt: 'Columella warned that improper harvesting would deplete the hive\'s _____ stores.',
              options: ['winter', 'nectar', 'royal', 'brood'],
              answerKey: 'winter',
              explanation: 'Selective honey harvesting that preserved the winter stores of colonies.',
              evidenceQuote: 'selective honey harvesting that preserved the winter stores of colonies',
              passageNumber: 1
            },
            {
              id: 'e1-p1-q13',
              number: 13,
              type: 'multiple-choice',
              prompt: 'What was the earliest historical documentation of migratory beekeeping?',
              options: [
                'Moving ceramic hives on barges along the Nile in ancient Egypt',
                'Transporting straw skeps across Greek mountain valleys',
                'Migrating wild swarms across Anatolian plateaus',
                'Shipping Langstroth hives on steam trains in America'
              ],
              answerKey: 'Moving ceramic hives on barges along the Nile in ancient Egypt',
              explanation: 'Hives moved on wooden barges along the Nile established the earliest historical record of migratory beekeeping.',
              evidenceQuote: 'establishing the earliest historical record of migratory beekeeping',
              passageNumber: 1
            }
          ]
        },
        {
          passageNumber: 2,
          title: 'Passage 2: The Evolution of Coral Reef Symbiosis and Ocean Acidification',
          wordCount: 920,
          text: `Scleractinian or stony corals constitute the architectural foundation of the most biologically biodiverse marine habitats on Earth. Although occupying less than 0.1 percent of the global oceanic seabed, coral reefs nurture an estimated twenty-five percent of all documented marine taxa. The evolutionary success of hermatypic corals in nutrient-poor tropical waters depends upon an obligate mutualistic endosymbiosis with dinoflagellate microalgae belonging to the family Symbiodiniaceae, colloquially referred to as zooxanthellae.

Within the host coral's endodermal gastrodermal cells, zooxanthellae conduct photosynthetic carbon fixation, translocating up to ninety percent of their synthesized organic glycerol, glucose, and amino acids directly to the coral polyp. In reciprocation, the host polyp supplies metabolic waste byproducts—specifically inorganic nitrogen (ammonium) and phosphorus—alongside a structurally sheltered, sunlit calcified refuge. This close metabolic coupling powers calcification rates three to five times greater than those observed in non-symbiotic azooxanthellate cold-water corals.

However, anthropogenic climate disruption presents a dual existential challenge to coral calcification: marine thermal heatwaves and ocean acidification. When sea surface temperatures exceed local summer maximum thresholds by as little as 1.0 to 1.5 degrees Celsius for sustained periods, photosynthetic machinery within zooxanthellae becomes impaired. The microalgae overproduce toxic reactive oxygen species (ROS) that damage cellular membranes. To prevent widespread tissue necrosis, the host coral expels the zooxanthellae, stripping the coral of its pigmentation and revealing the stark white calcium carbonate skeleton underneath—a phenomenon known as coral bleaching.

Simultaneously, the absorption of approximately thirty percent of anthropogenic carbon dioxide emissions by the world's oceans drives ocean acidification. Dissolved CO2 reacts with water molecules to generate carbonic acid, which dissociates into hydrogen ions and bicarbonate ions. The surplus hydrogen ions bind readily to ambient carbonate ions, drastically reducing the saturation state of aragonite (Ωarag), the metastable mineral polymorph of calcium carbonate utilized by scleractinian corals to precipitate their skeletons. Consequently, corals expend substantially more metabolic energy to precipitate skeleton, resulting in thinner, structurally fragile reef frameworks prone to bioerosion and storm destruction.`,
          questions: [
            {
              id: 'e1-p2-q14',
              number: 14,
              type: 'sentence-completion',
              prompt: 'Coral reefs support approximately _____ percent of all documented marine taxa.',
              options: ['twenty-five', 'ten', 'fifty', 'five'],
              answerKey: 'twenty-five',
              explanation: 'Text specifies coral reefs nurture an estimated twenty-five percent of all documented marine taxa.',
              evidenceQuote: 'nurture an estimated twenty-five percent of all documented marine taxa',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q15',
              number: 15,
              type: 'multiple-choice',
              prompt: 'What family of microalgae lives inside stony coral tissue?',
              options: ['Symbiodiniaceae', 'Phaeophyceae', 'Bacillariophyceae', 'Chlorophyta'],
              answerKey: 'Symbiodiniaceae',
              explanation: 'Symbiosis with dinoflagellate microalgae belonging to the family Symbiodiniaceae.',
              evidenceQuote: 'dinoflagellate microalgae belonging to the family Symbiodiniaceae',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q16',
              number: 16,
              type: 'true-false-not-given',
              prompt: 'Zooxanthellae transfer up to ninety percent of their photosynthetic products to the coral polyp.',
              answerKey: 'TRUE',
              explanation: 'The text confirms zooxanthellae conduct photosynthetic carbon fixation, translocating up to ninety percent of their synthesized organic products.',
              evidenceQuote: 'translocating up to ninety percent of their synthesized organic glycerol, glucose, and amino acids directly to the coral polyp',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q17',
              number: 17,
              type: 'multiple-choice',
              prompt: 'What metabolic byproducts does the host coral supply in return to zooxanthellae?',
              options: [
                'Inorganic ammonium and phosphorus',
                'Carbonic acid and calcium ions',
                'Excess glucose and amino acids',
                'Sulfur dioxide and aragonite crystals'
              ],
              answerKey: 'Inorganic ammonium and phosphorus',
              explanation: 'Supplies metabolic waste byproducts—specifically inorganic nitrogen (ammonium) and phosphorus.',
              evidenceQuote: 'host polyp supplies metabolic waste byproducts—specifically inorganic nitrogen (ammonium) and phosphorus',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q18',
              number: 18,
              type: 'sentence-completion',
              prompt: 'Symbiotic corals calcify _____ times faster than azooxanthellate cold-water corals.',
              options: ['three to five', 'two to three', 'ten', 'twenty'],
              answerKey: 'three to five',
              explanation: 'Powers calcification rates three to five times greater.',
              evidenceQuote: 'calcification rates three to five times greater than those observed in non-symbiotic azooxanthellate cold-water corals',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q19',
              number: 19,
              type: 'multiple-choice',
              prompt: 'What triggers coral bleaching during marine heatwaves?',
              options: [
                'Microalgae overproduce toxic reactive oxygen species (ROS)',
                'Corals consume their own endodermis for emergency calories',
                'Predatory crown-of-thorns starfish invade tropical lagoons',
                'Seawater nitrogen levels drop below zero parts per thousand'
              ],
              answerKey: 'Microalgae overproduce toxic reactive oxygen species (ROS)',
              explanation: 'The microalgae overproduce toxic reactive oxygen species (ROS) that damage cellular membranes.',
              evidenceQuote: 'overproduce toxic reactive oxygen species (ROS) that damage cellular membranes',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q20',
              number: 20,
              type: 'true-false-not-given',
              prompt: 'Coral bleaching immediately kills the coral polyps within 24 hours.',
              answerKey: 'FALSE',
              explanation: 'Bleaching involves expelling algae, revealing the skeleton; it causes vulnerability, not instant mortality in 24 hours.',
              evidenceQuote: 'expels the zooxanthellae, stripping the coral of its pigmentation and revealing the stark white calcium carbonate skeleton underneath',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q21',
              number: 21,
              type: 'sentence-completion',
              prompt: 'The oceans have absorbed roughly _____ percent of anthropogenic CO2 emissions.',
              options: ['thirty', 'fifty', 'seventy', 'ten'],
              answerKey: 'thirty',
              explanation: 'Absorption of approximately thirty percent of anthropogenic carbon dioxide emissions.',
              evidenceQuote: 'absorption of approximately thirty percent of anthropogenic carbon dioxide emissions by the world\'s oceans',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q22',
              number: 22,
              type: 'multiple-choice',
              prompt: 'Which calcium carbonate polymorph do reef-building corals primarily precipitate?',
              options: ['Aragonite', 'Calcite', 'Vaterite', 'Dolomite'],
              answerKey: 'Aragonite',
              explanation: 'Corals use the metastable mineral polymorph aragonite.',
              evidenceQuote: 'reducing the saturation state of aragonite (Ωarag), the metastable mineral polymorph of calcium carbonate',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q23',
              number: 23,
              type: 'true-false-not-given',
              prompt: 'A temperature increase of 0.2 degrees Celsius is sufficient to cause massive pantropical coral bleaching.',
              answerKey: 'FALSE',
              explanation: 'Text states temperatures exceeding local summer maximums by as little as 1.0 to 1.5 degrees Celsius for sustained periods.',
              evidenceQuote: 'exceed local summer maximum threshold by as little as 1.0 to 1.5 degrees Celsius for sustained periods',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q24',
              number: 24,
              type: 'multiple-choice',
              prompt: 'What happens to reef structures under severe ocean acidification?',
              options: [
                'Frameworks become thinner and more vulnerable to bioerosion',
                'Corals synthesize thicker skeletons to counter low pH',
                'Polyps stop releasing inorganic nitrogen completely',
                'Algae rapidly colonize deep cold abyssal trenches'
              ],
              answerKey: 'Frameworks become thinner and more vulnerable to bioerosion',
              explanation: 'Results in thinner, structurally fragile reef frameworks prone to bioerosion.',
              evidenceQuote: 'resulting in thinner, structurally fragile reef frameworks prone to bioerosion and storm destruction',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q25',
              number: 25,
              type: 'true-false-not-given',
              prompt: 'Azooxanthellate corals rely exclusively on deep-sea methane seeps for calcification.',
              answerKey: 'NOT GIVEN',
              explanation: 'The passage mentions azooxanthellate cold-water corals have slower calcification, but does not discuss methane seeps.',
              evidenceQuote: 'calcification rates three to five times greater than those observed in non-symbiotic azooxanthellate cold-water corals',
              passageNumber: 2
            },
            {
              id: 'e1-p2-q26',
              number: 26,
              type: 'sentence-completion',
              prompt: 'Excess hydrogen ions in acidified seawater bind with _____ ions, reducing aragonite saturation.',
              options: ['carbonate', 'calcium', 'sodium', 'sulfate'],
              answerKey: 'carbonate',
              explanation: 'Surplus hydrogen ions bind readily to ambient carbonate ions.',
              evidenceQuote: 'surplus hydrogen ions bind readily to ambient carbonate ions, drastically reducing the saturation state of aragonite',
              passageNumber: 2
            }
          ]
        },
        {
          passageNumber: 3,
          title: 'Passage 3: Neuroplasticity and Cortical Reorganization in Human Rehabilitation',
          wordCount: 1050,
          text: `For much of the twentieth century, clinical neurology operated under the dogma of the "immutable brain." Medical doctrine posited that the adult mammalian central nervous system was rigid and incapable of neurogenesis or structural rewiring following critical developmental stages in early childhood. Patients who suffered catastrophic cerebral vascular accidents (strokes) or localized traumatic brain injuries were routinely told that functional recovery was confined strictly to spontaneous biological resolution within the initial twelve weeks post-injury, after which neurological deficits became permanent.

This rigid dogma began unraveling in the late 1960s through landmark primate investigations conducted by neurophysiologist Michael Merzenich. By employing microelectrode mapping of the primary somatosensory cortex (area S1) in owl monkeys before and after selective surgical deafferentation, Merzenich demonstrated that cortical boundaries are remarkably plastic and dynamically maintained by incoming sensory afferents. When a sensory nerve from a finger was transected, the cortical territory that previously represented that digit was not left dormant; rather, adjacent cortical zones representing neighboring fingers rapidly colonized the vacated computational space.

Subsequent investigations substantiated that deliberate behavioral repetition drove macroscopic synaptic reorganization. In the 1990s, the development of Constraint-Induced Movement Therapy (CIMT), pioneered by Edward Taub, translated these physiological findings into clinical human stroke rehabilitation. CIMT counteracts "learned non-use"—a maladaptive behavioral suppression wherein stroke survivors rely almost exclusively on their unaffected limb to perform daily tasks. By physically restraining the unimpaired extremity in a padded mitt for up to ninety percent of waking hours while subjecting the paretic arm to intensive, repetitive, task-oriented behavioral shaping for two consecutive weeks, CIMT forces the reorganization of motor cortical circuits. Functional neuroimaging confirms that CIMT substantially expands the motor representation area of the damaged limb within the contralateral motor cortex, and occasionally recruits homologous pathways in the ipsilateral hemisphere.

Moreover, the phenomenon of cross-modal plasticity illustrates the astonishing capacity of cortical tissue to repurpose itself across sensory modalities. In congenitally blind individuals reading Braille, positron emission tomography (PET) and functional MRI reveal robust metabolic activation inside the primary visual cortex (Brodmann area 17), despite the complete absence of retinal input. When trans-cranial magnetic stimulation (TMS) temporarily disrupts activity in the occipital visual cortex, blind readers experience tactile perceptual errors and loss of reading fluency, demonstrating that occipital neurons have been functionally reassigned to tactile linguistic decoding. The modern paradigm of neuroplasticity establishes that the adult brain is not a static machine with hardwired circuits, but an adaptive, experience-dependent computational organ capable of lifelong reorganization.`,
          questions: [
            {
              id: 'e1-p3-q27',
              number: 27,
              type: 'multiple-choice',
              prompt: 'What was the prevailing twentieth-century medical belief regarding the adult brain?',
              options: [
                'Adult brain circuitry was fixed and unable to rewire after childhood',
                'Neurogenesis occurred at accelerated rates in elderly patients',
                'Sensory cortex maps shifted continuously every week',
                'The brain healed faster after traumatic injury than any other organ'
              ],
              answerKey: 'Adult brain circuitry was fixed and unable to rewire after childhood',
              explanation: 'Doctrine posited that the adult mammalian central nervous system was rigid and incapable of neurogenesis or rewiring.',
              evidenceQuote: 'Medical doctrine posited that the adult mammalian central nervous system was rigid and incapable of neurogenesis or structural rewiring',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q28',
              number: 28,
              type: 'sentence-completion',
              prompt: 'Prior dogma taught that stroke recovery ended after _____ weeks post-injury.',
              options: ['twelve', 'six', 'twenty-four', 'two'],
              answerKey: 'twelve',
              explanation: 'Recovery was believed confined to spontaneous biological resolution within the initial twelve weeks.',
              evidenceQuote: 'recovery was confined strictly to spontaneous biological resolution within the initial twelve weeks post-injury',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q29',
              number: 29,
              type: 'multiple-choice',
              prompt: 'Which researcher conducted landmark somatosensory mapping in owl monkeys?',
              options: ['Michael Merzenich', 'Edward Taub', 'Columella', 'Lorenzo Langstroth'],
              answerKey: 'Michael Merzenich',
              explanation: 'Landmark primate investigations conducted by neurophysiologist Michael Merzenich.',
              evidenceQuote: 'primate investigations conducted by neurophysiologist Michael Merzenich',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q30',
              number: 30,
              type: 'true-false-not-given',
              prompt: 'When a monkey\'s finger nerve was cut, the brain region representing it became permanently dead tissue.',
              answerKey: 'FALSE',
              explanation: 'Adjacent cortical zones representing neighboring fingers rapidly colonized the vacated space.',
              evidenceQuote: 'adjacent cortical zones representing neighboring fingers rapidly colonized the vacated computational space',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q31',
              number: 31,
              type: 'sentence-completion',
              prompt: 'Edward Taub developed a rehabilitation method named Constraint-Induced _____ Therapy.',
              options: ['Movement', 'Memory', 'Metabolic', 'Motor'],
              answerKey: 'Movement',
              explanation: 'Development of Constraint-Induced Movement Therapy (CIMT).',
              evidenceQuote: 'Constraint-Induced Movement Therapy (CIMT), pioneered by Edward Taub',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q32',
              number: 32,
              type: 'multiple-choice',
              prompt: 'What condition does CIMT aim to overcome in stroke patients?',
              options: ['Learned non-use', 'Spontaneous remission', 'Sensory deafferentation', 'Cortical necrosis'],
              answerKey: 'Learned non-use',
              explanation: 'CIMT counteracts "learned non-use".',
              evidenceQuote: 'CIMT counteracts "learned non-use"—a maladaptive behavioral suppression',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q33',
              number: 33,
              type: 'true-false-not-given',
              prompt: 'Functional neuroimaging shows that CIMT enlarges the motor cortex area corresponding to the injured limb.',
              answerKey: 'TRUE',
              explanation: 'Neuroimaging confirms CIMT expands the motor representation area of the damaged limb.',
              evidenceQuote: 'confirms that CIMT produces extensive cortical reorganization, substantially expanding the motor representation area of the damaged limb',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q34',
              number: 34,
              type: 'multiple-choice',
              prompt: 'What unusual brain activity is observed when blind individuals read Braille?',
              options: [
                'Metabolic activation inside the primary visual cortex (V1)',
                'Complete shutdown of sensory processing in the parietal lobe',
                'Hyperactivity strictly restricted to the auditory brainstem',
                'Inactivation of all prefrontal executive controls'
              ],
              answerKey: 'Metabolic activation inside the primary visual cortex (V1)',
              explanation: 'Blind individuals reading Braille exhibit pronounced metabolic activation inside the primary visual cortex (V1).',
              evidenceQuote: 'blind individuals reading Braille exhibit pronounced metabolic activation inside the primary visual cortex (V1)',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q35',
              number: 35,
              type: 'sentence-completion',
              prompt: 'When TMS temporarily disrupts the visual cortex in blind readers, they lose reading _____.',
              options: ['fluency', 'speed', 'memory', 'hearing'],
              answerKey: 'fluency',
              explanation: 'Blind readers experience tactile perceptual errors and loss of reading fluency.',
              evidenceQuote: 'blind readers experience tactile perceptual errors and loss of reading fluency',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q36',
              number: 36,
              type: 'true-false-not-given',
              prompt: 'Edward Taub received the Nobel Prize in Medicine for pioneering CIMT.',
              answerKey: 'NOT GIVEN',
              explanation: 'The text notes Taub pioneered CIMT, but makes no mention of whether he received a Nobel Prize.',
              evidenceQuote: 'development of Constraint-Induced Movement Therapy (CIMT), pioneered by Edward Taub',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q37',
              number: 37,
              type: 'true-false-not-given',
              prompt: 'Primate research confirmed that cortical territory of an amputated digit remains dormant permanently.',
              answerKey: 'FALSE',
              explanation: 'Adjacent cortical regions rapidly colonized the denervated cortical territory, proving representation is dynamic.',
              evidenceQuote: 'Adjacent cortical regions responsible for uninjured digits rapidly colonized the denervated cortical territory',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q38',
              number: 38,
              type: 'multiple-choice',
              prompt: 'What percentage of waking hours is the unaffected limb restrained during the 2-week CIMT program?',
              options: ['Up to ninety percent', 'Fifty percent', 'Twenty percent', 'One hundred percent'],
              answerKey: 'Up to ninety percent',
              explanation: 'The text specifies: restraining the unimpaired extremity in a padded mitt for up to ninety percent of waking hours.',
              evidenceQuote: 'restraining the unimpaired extremity in a padded mitt for up to ninety percent of waking hours',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q39',
              number: 39,
              type: 'sentence-completion',
              prompt: 'The capacity of neural networks to reorganize their synaptic architecture is termed _____.',
              options: ['neuroplasticity', 'palliative care', 'optogenetics', 'topography'],
              answerKey: 'neuroplasticity',
              explanation: 'The modern paradigm of neuroplasticity—the capacity of neural networks to reorganize their synaptic architecture.',
              evidenceQuote: 'The modern paradigm of neuroplasticity—the capacity of neural networks to reorganize their synaptic architecture',
              passageNumber: 3
            },
            {
              id: 'e1-p3-q40',
              number: 40,
              type: 'true-false-not-given',
              prompt: 'Cross-modal plasticity enables intact sensory systems to utilize brain regions originally dedicated to damaged senses.',
              answerKey: 'TRUE',
              explanation: 'The passage confirms: When sensory deprivation occurs, cortical territories formerly dedicated to the impaired modality are co-opted by surviving senses.',
              evidenceQuote: 'cortical territories formerly dedicated to the impaired modality are co-opted by surviving senses',
              passageNumber: 3
            }
          ]
        }
      ]
    },
    writing: {
      id: 'writing-paper-01',
      title: 'Academic Writing — Task 1 & Task 2 (60 Minutes)',
      timeAllowedMinutes: 60,
      task1: {
        title: 'Task 1: Renewable Electricity Generation by Source (20 Minutes)',
        prompt:
          'The bar chart compares renewable electricity generation across four major sectors (hydropower, wind, solar photovoltaic, and biomass) in three countries between 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
        type: 'academic_task1',
        stimulusType: 'chart',
        stimulusDescription:
          'Comparative bar chart: Country A led in hydropower in 2015 (180 TWh) but experienced exponential solar growth to 220 TWh by 2025. Country B expanded offshore wind from 40 TWh to 190 TWh. Country C maintained consistent biomass reliance (80 TWh) with modest solar investments.',
        minimumWords: 150,
        modelAnswer: `The bar chart illustrates the output of renewable electricity across four energy sources—hydropower, wind, solar photovoltaic (PV), and biomass—in Countries A, B, and C over a ten-year span from 2015 to 2025.

Overall, all three countries recorded notable expansions in total green power generation. Solar PV in Country A and wind energy in Country B registered the most pronounced upward trajectories, while hydropower and biomass maintained relatively stable contributions throughout the period.

In 2015, hydropower was the dominant renewable energy source in Country A, generating approximately 180 terawatt-hours (TWh). By 2025, while hydropower expanded moderately to 210 TWh, solar PV underwent exponential growth, soaring from a modest 30 TWh to lead all categories at 220 TWh.

Conversely, Country B prioritized wind energy development. Generating only 40 TWh in 2015, offshore and onshore wind capacity surged nearly fivefold to reach 190 TWh in 2025. In contrast, Country C exhibited the least variation: biomass generation remained virtually unchanged at around 80 TWh, with minor solar additions reaching 45 TWh by the end of the timeline.`
      },
      task2: {
        title: 'Task 2: Remote Work and Urban Decentralization (40 Minutes)',
        prompt:
          'In many nations, an increasing proportion of employees are working remotely from home rather than commuting to metropolitan offices. Do the advantages of this trend outweigh the disadvantages for individuals and urban communities? Give reasons for your answer and include relevant examples from your knowledge or experience. Write at least 250 words.',
        minimumWords: 250,
        modelAnswer: `In recent years, the proliferation of telecommunications technology has enabled a substantial segment of the workforce to transition from corporate headquarters to home-based remote work. In my view, while telecommuting introduces certain social and infrastructural challenges, its socioeconomic and environmental merits for both individuals and communities overwhelmingly outweigh the drawbacks.

On the individual level, the primary benefit lies in the reclamation of time and enhanced work-life equilibrium. Eliminating daily metropolitan commutes frees up upwards of ten hours per week, allowing professionals to dedicate more time to familial obligations, physical fitness, and continuing education. Financially, teleworkers save considerable expenditure on transit fares, fuel, and commercial lunches. For urban communities, decentralized employment relieves severe traffic congestion on arterial highways and noticeably curbs peak-hour vehicular emissions, leading to measurable enhancements in metropolitan air quality.

Nonetheless, critics frequently point out tangible detriments. Prolonged remote work can foster professional isolation and erode spontaneous collaborative synergy among colleagues. Furthermore, commercial downtown districts heavily reliant on the patronage of office commuters—such as restaurants, retail shops, and public transport operators—often face economic contraction. Residential energy bills may also escalate as heating and cooling run continuously throughout the workday.

However, these concerns are manageable through modern hybrid models and urban adaptation. Many enterprises now adopt blended schedules involving two days of collaborative office presence alongside flexible remote days, preserving teamwork while maintaining lifestyle autonomy. Simultaneously, suburban neighborhoods and regional towns have flourished as teleworkers redirect their daily expenditures into local cafes, libraries, and community centres, sparking a wholesome decentralization of regional economies.

In conclusion, the advantages of telecommuting—namely personal well-being, reduced commuting burdens, and lower urban emissions—far surpass its surmountable disadvantages. As hybrid practices mature, remote work will remain a cornerstone of sustainable modern society.`
      }
    },
    speaking: {
      id: 'speaking-paper-01',
      title: 'Speaking Interview Test (11-14 Minutes)',
      part1: {
        topic: 'Daily Routines and Smart Devices',
        questions: [
          'What electronic device do you find most indispensable throughout your day?',
          'How has the way you organize your study or work schedule changed compared to a few years ago?',
          'Do you believe people spend excessive amounts of time interacting with digital screens nowadays?'
        ],
        modelAnswers: [
          'Without question, my smartphone is the device I rely upon most, as it serves simultaneously as a research terminal, calendar organizer, and primary communication channel.',
          'Previously, I utilized physical paper diaries, whereas now I synchronize cloud-based task management applications across my tablet and laptop, which automate reminders and streamline deadlines.',
          'Undoubtedly, screen saturation has reached unprecedented levels. While digital tools improve productivity, excessive passive scrolling contributes to sedentary lifestyles and fragmented attention spans.'
        ]
      },
      part2: {
        topic: 'Community Environmental Project',
        prompt: 'Describe an environmental project or initiative in your locality that you consider beneficial.',
        cueCardBullets: [
          'What the initiative was and who initiated it',
          'What specific ecological or local challenge it targeted',
          'How members of your community engaged or contributed',
          'And explain why you evaluate this initiative as impactful or positive'
        ],
        prepTimeSeconds: 60,
        speakingTimeSeconds: 120,
        modelAnswer: `I would like to talk about an inspiring community-driven ecological initiative organized in my neighborhood called the "Green Canopy Corridor Project." It was initiated two years ago by a coalition of local university botanists and resident association volunteers in response to severe summer heat stress and the degradation of neighborhood tree cover.

The primary objective of the campaign was to transform barren roadside verges and abandoned industrial lots into biodiverse micro-forests using native drought-tolerant trees such as oaks, hornbeams, and flowering dogwoods. Community engagement was exceptionally high: hundreds of local families, school children, and pensioners participated during weekend planting sessions, digging irrigation trenches, mulching saplings, and cataloging biodiversity through mobile citizen-science apps.

I evaluate this initiative as exceptionally impactful because it generated immediate, tangible ecological and social dividends. Thermal mapping conducted by the local municipality revealed that ambient summer temperatures along the reforested streets dropped by nearly two degrees Celsius, while urban bird and pollinator populations doubled within eighteen months. More fundamentally, it restored a profound sense of civic pride and environmental stewardship among residents.`
      },
      part3: {
        topic: 'Environmental Governance and Public Policy',
        questions: [
          'Do you believe environmental conservation should be primarily funded by governments or community grassroots groups?',
          'How can academic institutions best inculcate sustainable habits in children?',
          'What role can international treaties play in mitigating transboundary pollution?'
        ],
        modelAnswers: [
          'While grassroots stewardship is essential for local engagement, large-scale ecological conservation requires central government fiscal backing, as only state authorities possess the regulatory apparatus and tax revenue to build green infrastructure and enforce strict environmental laws.',
          'Schools can best cultivate sustainable habits through experiential, project-based curricula—such as managing school organic gardens or conducting waste audits—rather than relying solely on abstract textbook theories.',
          'Transboundary pollution respects no national borders; therefore, multilateral environmental treaties establish binding emissions targets, standardized monitoring frameworks, and financial transfer mechanisms to support developing nations in achieving climate goals.'
        ]
      }
    }
  }

type FreshFact = [prompt: string, answer: string]

function makeFreshQuestions(prefix: string, facts: FreshFact[], startNumber: number, groupNumber: 1 | 2 | 3 | 4, skill: 'reading' | 'listening') {
  return facts.map(([prompt, answer], index): ExamQuestion => ({
    id: `${prefix}-q${startNumber + index}`,
    number: startNumber + index,
    type: 'sentence-completion',
    prompt,
    answerKey: answer,
    explanation: `The answer is stated in the ${skill} material for this section.`,
    evidenceQuote: answer,
    ...(skill === 'reading' ? { passageNumber: groupNumber as 1 | 2 | 3 } : { sectionNumber: groupNumber as 1 | 2 | 3 | 4 })
  }))
}

function buildFreshExam(index: 2 | 3, data: {
  reading: Array<{ title: string; text: string; facts: FreshFact[] }>
  listening: Array<{ title: string; context: string; transcript: string; facts: FreshFact[] }>
  writingTask1: { title: string; prompt: string; stimulusDescription: string }
  writingTask2: { title: string; prompt: string }
  speaking: { part1Topic: string; part1: string[]; part2Topic: string; part2: string; part2Bullets: string[]; part3Topic: string; part3: string[] }
}): FullIELTSExam {
  const suffix = String(index).padStart(2, '0')
  let readingNumber = 1
  const passages: ExamPassage[] = data.reading.map((passage, passageIndex) => {
    const questions = makeFreshQuestions(`e${index}-p${passageIndex + 1}`, passage.facts, readingNumber, (passageIndex + 1) as 1 | 2 | 3, 'reading')
    readingNumber += questions.length
    return { passageNumber: (passageIndex + 1) as 1 | 2 | 3, title: passage.title, wordCount: passage.text.split(/\s+/).length, text: passage.text, questions }
  })
  let listeningNumber = 1
  const sections: FullListeningSection[] = data.listening.map((section, sectionIndex) => {
    const questions = makeFreshQuestions(`e${index}-l-s${sectionIndex + 1}`, section.facts, listeningNumber, (sectionIndex + 1) as 1 | 2 | 3 | 4, 'listening')
    listeningNumber += questions.length
    return { sectionNumber: (sectionIndex + 1) as 1 | 2 | 3 | 4, title: section.title, context: section.context, transcript: section.transcript, questions }
  })
  return {
    id: `ielts-exam-acad-${suffix}`,
    code: `IELTS-ACTUAL-2026-VOL1-TEST${index}`,
    title: `IELTS Academic Practice Test ${index}`,
    volume: 'Recent Actual Tests 2026 — Volume 1',
    module: 'Academic', difficulty: 'Standard Exam', completedCount: index === 2 ? 1205 : 990, averageBand: index === 2 ? 6.4 : 6.6,
    reading: { id: `reading-paper-${suffix}`, title: `Academic Reading — Practice Test ${index} (40 Questions)`, timeAllowedMinutes: 60, totalQuestions: 40, passages },
    listening: { id: `listening-paper-${suffix}`, title: `Academic Listening — Practice Test ${index} (40 Questions)`, timeAllowedMinutes: 30, totalQuestions: 40, sections },
    writing: {
      id: `writing-paper-${suffix}`, title: `Academic Writing — Practice Test ${index}`, timeAllowedMinutes: 60,
      task1: { ...data.writingTask1, type: 'academic_task1', stimulusType: 'chart', minimumWords: 150 },
      task2: { ...data.writingTask2, minimumWords: 250 }
    },
    speaking: {
      id: `speaking-paper-${suffix}`, title: `Speaking Interview — Practice Test ${index}`,
      part1: { topic: data.speaking.part1Topic, questions: data.speaking.part1 },
      part2: { topic: data.speaking.part2Topic, prompt: data.speaking.part2, cueCardBullets: data.speaking.part2Bullets, prepTimeSeconds: 60, speakingTimeSeconds: 120 },
      part3: { topic: data.speaking.part3Topic, questions: data.speaking.part3 }
    }
  }
}

const freshExam2 = buildFreshExam(2, {
  reading: [
    { title: 'Passage 1: Restoring Urban Wetlands', text: 'Urban wetlands are being restored as cities search for practical ways to reduce flooding and heat. The Marshfield project converted a disused industrial basin into a chain of shallow ponds, planted native reeds and created footpaths on raised banks. Engineers first removed contaminated soil, then allowed seasonal water levels to fluctuate. Within three years, dragonflies and migratory birds returned, while nearby streets experienced less surface flooding. Researchers emphasize that the success came from combining ecological design with long-term community maintenance rather than treating the wetland as a decorative park.', facts: [['The project began in a disused industrial basin.', 'industrial basin'], ['The first engineering task was removing contaminated soil.', 'contaminated soil'], ['Native reeds were planted around the ponds.', 'native reeds'], ['Footpaths were built on raised banks.', 'raised banks'], ['Water levels were allowed to fluctuate seasonally.', 'seasonally'], ['Dragonflies returned within three years.', 'three years'], ['Migratory birds returned to the restored area.', 'migratory birds'], ['The project reduced surface flooding nearby.', 'surface flooding'], ['Community maintenance was essential to success.', 'community maintenance'], ['The restored area included shallow ponds.', 'shallow ponds'], ['The initiative also addressed urban heat.', 'urban heat'], ['The wetland was not designed only as decoration.', 'decorative park'], ['The project combined ecology with engineering.', 'ecological design']] },
    { title: 'Passage 2: The Science of Fermented Foods', text: 'Fermentation is an ancient method of preserving food, but modern laboratories are revealing why it works. Microorganisms consume sugars and produce acids, gases or alcohol, creating conditions that discourage harmful competitors. Temperature, salt concentration and oxygen exposure determine which organisms dominate. A research team studying bean fermentation found that small changes in temperature altered both flavour and vitamin availability. The team argues that traditional knowledge remains valuable because generations of cooks have already tested local ingredients and seasonal conditions. Industrial producers can learn from these practices, although strict hygiene is still necessary.', facts: [['Microorganisms consume sugars during fermentation.', 'sugars'], ['Fermentation may produce acids, gases or alcohol.', 'acids, gases or alcohol'], ['The products discourage harmful competitors.', 'harmful competitors'], ['Temperature affects which organisms dominate.', 'temperature'], ['Salt concentration is another controlling factor.', 'salt concentration'], ['Oxygen exposure changes the fermentation process.', 'oxygen exposure'], ['The bean study measured changes in vitamin availability.', 'vitamin availability'], ['Temperature changes also altered flavour.', 'flavour'], ['Traditional knowledge was described as valuable.', 'traditional knowledge'], ['Cooks have tested local ingredients over generations.', 'local ingredients'], ['Seasonal conditions influence traditional recipes.', 'seasonal conditions'], ['Industrial producers can learn from traditional practice.', 'Industrial producers'], ['Strict hygiene remains necessary.', 'strict hygiene']] },
    { title: 'Passage 3: Designing Quieter Cities', text: 'Noise mapping is changing how planners think about the acoustic life of cities. Instead of relying only on occasional complaints, researchers install sensors at schools, hospitals and busy intersections to record patterns across a full day. The resulting maps show that traffic volume is not the only factor: road surface, building shape and delivery schedules can be equally important. In one pilot district, a low-noise asphalt surface and revised delivery hours reduced peak sound levels without banning vehicles. Residents reported better sleep, but researchers caution that quieter design must not move pollution into less visible neighbourhoods.', facts: [['Noise mapping uses sensors to record sound patterns.', 'sensors'], ['Schools and hospitals are monitored in the project.', 'schools and hospitals'], ['Measurements are collected across a full day.', 'full day'], ['Traffic volume is not the only source of urban noise.', 'not the only factor'], ['Road surface can affect sound levels.', 'road surface'], ['Building shape influences acoustic conditions.', 'building shape'], ['Delivery schedules were revised in the pilot district.', 'delivery schedules'], ['The project used low-noise asphalt.', 'low-noise asphalt'], ['Vehicles were not completely banned.', 'without banning vehicles'], ['Residents reported better sleep.', 'better sleep'], ['Researchers warned against shifting pollution elsewhere.', 'less visible neighbourhoods'], ['The maps revealed daily patterns.', 'patterns across a full day'], ['The pilot reduced peak sound levels.', 'peak sound levels'], ['Planners should consider acoustic life when designing cities.', 'acoustic life of cities']] }
  ],
  listening: [
    { title: 'Section 1: Community Garden Registration', context: 'A caller registers for a plot at a community garden.', transcript: 'Coordinator: The garden has plots beside the old library. New members attend an induction on Saturday, bring their own gloves, and pay a refundable key deposit of twenty pounds. Watering is organised by a weekly rota. The tool shed opens at seven, and compost is delivered on the first Monday of each month. Members may grow vegetables but not tall trees because they would shade neighbouring plots. The annual membership fee is forty-five pounds.', facts: [['The plots are beside the old library.', 'old library'], ['New members attend induction on Saturday.', 'Saturday'], ['Members bring their own gloves.', 'gloves'], ['The key deposit is twenty pounds.', 'twenty pounds'], ['Watering follows a weekly rota.', 'weekly rota'], ['The tool shed opens at seven.', 'seven'], ['Compost arrives on the first Monday.', 'first Monday'], ['Members may grow vegetables.', 'vegetables'], ['Tall trees are not permitted.', 'tall trees'], ['The annual fee is forty-five pounds.', 'forty-five pounds']] },
    { title: 'Section 2: Museum Audio Tour', context: 'A museum guide explains a new visitor route.', transcript: 'Guide: The archaeology museum has moved its entrance to the east courtyard while building work continues. The audio tour lasts forty minutes and begins with the bronze collection. Visitors who want the children’s activity sheet should ask at the information desk. The café is on the second floor, but the lift is temporarily out of service, so staff recommend the central staircase. Photography is allowed in the Roman gallery but not in the conservation laboratory.', facts: [['The temporary entrance is in the east courtyard.', 'east courtyard'], ['The audio tour lasts forty minutes.', 'forty minutes'], ['The tour begins with the bronze collection.', 'bronze collection'], ['Children’s activity sheets are available at the information desk.', 'information desk'], ['The café is on the second floor.', 'second floor'], ['The lift is temporarily out of service.', 'lift'], ['Visitors should use the central staircase.', 'central staircase'], ['Photography is allowed in the Roman gallery.', 'Roman gallery'], ['Photography is forbidden in the conservation laboratory.', 'conservation laboratory'], ['The museum is undergoing building work.', 'building work']] },
    { title: 'Section 3: Student Research Seminar', context: 'Two students discuss a seminar presentation.', transcript: 'Maya: Our presentation is about rooftop farming. The tutor wants us to compare hydroponic systems with soil beds, not simply describe them. I will analyse water consumption, while Leo will examine crop yields. We should use the university’s 2024 dataset because the older survey measured only three buildings. The seminar room has a projector, but we must bring an adaptor. The presentation is twelve minutes, followed by questions.', facts: [['The presentation concerns rooftop farming.', 'rooftop farming'], ['The tutor requires a comparison.', 'compare hydroponic systems with soil beds'], ['Maya will analyse water consumption.', 'water consumption'], ['Leo will examine crop yields.', 'crop yields'], ['The recommended dataset is from 2024.', '2024 dataset'], ['The older survey covered three buildings.', 'three buildings'], ['The seminar room has a projector.', 'projector'], ['The students must bring an adaptor.', 'adaptor'], ['The presentation lasts twelve minutes.', 'twelve minutes'], ['Questions follow the presentation.', 'questions']] },
    { title: 'Section 4: Sleep and Memory Lecture', context: 'A lecturer explains how sleep supports learning.', transcript: 'Lecturer: Memory consolidation is not a single event. During the first part of the night, the brain repeatedly replays newly learned patterns, while later sleep appears to integrate them with older knowledge. A controlled study found that participants who slept after learning vocabulary recalled more words than those who stayed awake. However, researchers warn that caffeine late in the day can delay sleep onset. They recommend a regular schedule, moderate evening light and a quiet bedroom rather than relying on weekend catch-up sleep.', facts: [['Memory consolidation occurs in more than one stage.', 'not a single event'], ['The brain replays new patterns early in the night.', 'replays newly learned patterns'], ['Later sleep connects new knowledge with older knowledge.', 'older knowledge'], ['Sleeping after vocabulary study improved recall.', 'recalled more words'], ['The study compared sleepers with people who stayed awake.', 'stayed awake'], ['Late caffeine can delay sleep onset.', 'delay sleep onset'], ['Researchers recommend a regular schedule.', 'regular schedule'], ['Moderate evening light is recommended.', 'moderate evening light'], ['A quiet bedroom is recommended.', 'quiet bedroom'], ['Weekend catch-up sleep is not a complete solution.', 'weekend catch-up sleep']] }
  ],
  writingTask1: { title: 'Task 1: Household Recycling Rates (20 Minutes)', prompt: 'The bar chart compares household recycling rates for paper, glass, plastic and metal in three cities in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.', stimulusDescription: 'City A increased paper recycling from 52% to 78%; City B recorded the highest glass rate at 81%; City C made the largest improvement in plastic recycling, from 18% to 55%.' },
  writingTask2: { title: 'Task 2: Public Transport Investment (40 Minutes)', prompt: 'Some people believe governments should invest more in public transport, while others think expanding roads is the best way to reduce congestion. Discuss both views and give your own opinion. Write at least 250 words.' },
  speaking: { part1Topic: 'Libraries and Reading', part1: ['How often do you visit a library?', 'What kind of books do you prefer to read?', 'Do people read differently because of digital technology?'], part2Topic: 'A useful public place', part2: 'Describe a public place in your town that you think is useful.', part2Bullets: ['what the place is', 'where it is located', 'what people do there', 'and explain why it is useful'], part3Topic: 'Public Services and Communities', part3: ['Which public services are most important in a city?', 'How can communities encourage people to use shared facilities?', 'Should public spaces be designed mainly for children or for all age groups?'] }
})

const freshExam3 = buildFreshExam(3, {
  reading: [
    { title: 'Passage 1: The Return of the Night Train', text: 'Night trains are returning to European timetables after decades of decline. Operators once removed sleeper services because cheap flights appeared faster and rail maintenance costs rose. Recent demand is driven by passengers who value city-centre arrival, lower carbon emissions and the ability to travel while asleep. New carriages use modular cabins that can be rearranged for families or individual travellers. Analysts say the service will remain viable only if rail companies coordinate tickets across borders and provide reliable connections at both ends of a journey.', facts: [['Night trains declined for several decades.', 'decades of decline'], ['Cheap flights contributed to their removal.', 'cheap flights'], ['Rail maintenance costs also increased.', 'rail maintenance costs'], ['Passengers value arriving in city centres.', 'city-centre arrival'], ['Night trains can reduce carbon emissions.', 'lower carbon emissions'], ['New cabins can be rearranged for families.', 'rearranged for families'], ['Some cabins are designed for individual travellers.', 'individual travellers'], ['Operators must coordinate tickets across borders.', 'across borders'], ['Reliable connections are needed at both ends.', 'reliable connections'], ['Passengers can travel while asleep.', 'while asleep'], ['The service must remain financially viable.', 'remain viable'], ['Rail companies need to cooperate.', 'coordinate tickets'], ['The new carriages use modular cabins.', 'modular cabins']] },
    { title: 'Passage 2: How Trees Communicate Stress', text: 'Trees cannot walk away from drought, yet forests are not silent when water becomes scarce. Roots and leaves produce chemical signals that alter growth and close pores in the foliage. Fungi connected to roots may also carry nutrients and warning compounds between neighbouring plants. Experiments show that seedlings exposed to signals from stressed trees sometimes develop deeper roots and tougher leaves. Scientists disagree about whether the word communication is appropriate, but they agree that a forest behaves as a network of interacting organisms rather than a collection of isolated individuals.', facts: [['Drought causes chemical signals in roots and leaves.', 'chemical signals'], ['Leaves may close pores during water stress.', 'close pores'], ['Fungi connect to tree roots.', 'Fungi connected to roots'], ['Fungal networks may carry nutrients.', 'nutrients'], ['Warning compounds may move between plants.', 'warning compounds'], ['Exposed seedlings sometimes develop deeper roots.', 'deeper roots'], ['Some seedlings develop tougher leaves.', 'tougher leaves'], ['Scientists disagree about the word communication.', 'communication'], ['Researchers see forests as interacting networks.', 'network of interacting organisms'], ['Trees cannot escape drought by moving.', 'cannot walk away'], ['Roots participate in signalling.', 'Roots'], ['The experiments involved seedlings.', 'seedlings'], ['A forest is not a set of isolated individuals.', 'not isolated']] },
    { title: 'Passage 3: Measuring the Value of Repair Cafés', text: 'Repair cafés invite residents to bring broken household objects to free or low-cost workshops. Volunteers with practical skills help diagnose faults, teach basic techniques and identify parts that can be reused. An evaluation in Northbridge found that participants repaired more electrical appliances than furniture, partly because small appliances were easy to transport. The organisers measured success not only by the number of objects saved from landfill but also by new social contacts and confidence gained by visitors. They concluded that repair events work best when tools, insurance and patient mentors are available.', facts: [['Repair cafés accept broken household objects.', 'broken household objects'], ['Workshops may be free or low-cost.', 'free or low-cost'], ['Volunteers diagnose faults with residents.', 'diagnose faults'], ['Volunteers teach basic techniques.', 'basic techniques'], ['Reusable parts are identified.', 'parts that can be reused'], ['Electrical appliances were repaired more than furniture.', 'electrical appliances'], ['Small appliances were easy to transport.', 'easy to transport'], ['Success included objects kept from landfill.', 'saved from landfill'], ['Organisers also measured new social contacts.', 'social contacts'], ['Visitors gained confidence.', 'confidence gained'], ['Tools are needed for successful events.', 'tools'], ['Insurance was listed as necessary.', 'insurance'], ['Patient mentors improve repair events.', 'patient mentors'], ['Northbridge was the evaluation site.', 'Northbridge']] }
  ],
  listening: [
    { title: 'Section 1: Bicycle Hire Enquiry', context: 'A visitor asks about hiring a bicycle for a weekend trip.', transcript: 'Assistant: Our standard bicycle hire is thirty pounds for two days. Helmets are included, but lights are an extra five pounds. The riverside route begins behind the station and takes about three hours. The northern bridge is closed, so riders should use the older stone bridge. We can deliver bicycles to the hotel for a fee of eight pounds. Return them by six on Sunday, and report any damage before leaving the depot.', facts: [['Standard hire costs thirty pounds.', 'thirty pounds'], ['The standard period is two days.', 'two days'], ['Helmets are included.', 'Helmets'], ['Lights cost an extra five pounds.', 'five pounds'], ['The riverside route starts behind the station.', 'behind the station'], ['The route takes about three hours.', 'three hours'], ['The northern bridge is closed.', 'northern bridge'], ['Riders should use the older stone bridge.', 'older stone bridge'], ['Hotel delivery costs eight pounds.', 'eight pounds'], ['Bicycles must be returned by six on Sunday.', 'six on Sunday']] },
    { title: 'Section 2: Farmers Market Announcement', context: 'An organiser announces changes to a weekly farmers market.', transcript: 'Organiser: From next month the farmers market will move to the covered bus station because the riverside square is being renovated. The market will open at nine rather than eight, and a new stall map will be printed in blue. Customers can pre-order vegetables through the website, but bread must still be bought in person. The information desk will collect reusable bags and donate them to the shelter. Parking is available on Elm Street after ten o’clock.', facts: [['The market will move to the covered bus station.', 'covered bus station'], ['The riverside square is being renovated.', 'renovated'], ['Opening time will change to nine.', 'nine'], ['The stall map will be printed in blue.', 'blue'], ['Vegetables can be pre-ordered online.', 'website'], ['Bread must be bought in person.', 'in person'], ['The information desk collects reusable bags.', 'reusable bags'], ['Bags will be donated to the shelter.', 'shelter'], ['Parking is on Elm Street.', 'Elm Street'], ['Parking is available after ten.', 'after ten o’clock']] },
    { title: 'Section 3: Group Project on Coastal Erosion', context: 'Three students plan a university project about coastal erosion.', transcript: 'Tutor: Your group should focus on one beach rather than compare the entire coastline. Nina will analyse historical photographs, while Omar will use tide-gauge records. Priya has arranged an interview with the local harbour master. The final report needs a map, a short risk assessment and two recommendations for residents. Submit a draft on the fifteenth; the presentation will take place in the geography studio one week later.', facts: [['The group should focus on one beach.', 'one beach'], ['Nina will analyse historical photographs.', 'historical photographs'], ['Omar will use tide-gauge records.', 'tide-gauge records'], ['Priya arranged an interview with the harbour master.', 'harbour master'], ['The report needs a map.', 'map'], ['A risk assessment is required.', 'risk assessment'], ['The report must include two recommendations.', 'two recommendations'], ['The recommendations are for residents.', 'residents'], ['The draft is due on the fifteenth.', 'fifteenth'], ['The presentation is in the geography studio.', 'geography studio']] },
    { title: 'Section 4: The Psychology of Colour', context: 'A lecture considers how colour affects attention and behaviour.', transcript: 'Lecturer: Colour can influence attention, but its effects depend heavily on context and culture. In one experiment, a red warning label attracted faster glances than a grey label. However, participants remembered the information only when the label was accompanied by a clear explanation. Blue walls did not automatically improve concentration; the benefit appeared when lighting and temperature were comfortable. Designers should therefore avoid universal claims and test colour choices with the intended users.', facts: [['Colour effects depend on context.', 'context'], ['Culture also influences colour effects.', 'culture'], ['Red warning labels attracted faster glances.', 'red warning label'], ['Grey labels received slower attention.', 'grey label'], ['Memory improved when explanations were clear.', 'clear explanation'], ['Blue walls did not automatically improve concentration.', 'did not automatically improve'], ['Lighting affected the result.', 'lighting'], ['Temperature affected the result.', 'temperature'], ['Designers should avoid universal claims.', 'universal claims'], ['Colour choices should be tested with intended users.', 'intended users']] }
  ],
  writingTask1: { title: 'Task 1: Visitor Numbers at Three Museums (20 Minutes)', prompt: 'The line graph compares visitor numbers at three museums between 2012 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.', stimulusDescription: 'Museum A rose steadily from 120,000 to 240,000 visitors; Museum B fluctuated around 180,000; Museum C declined until 2018 before recovering to 160,000 in 2022.' },
  writingTask2: { title: 'Task 2: Online Education and Universities (40 Minutes)', prompt: 'Some people think online education will eventually replace face-to-face university teaching. To what extent do you agree or disagree? Write at least 250 words.' },
  speaking: { part1Topic: 'Weather and Seasons', part1: ['Which season do you enjoy most?', 'Does the weather affect your daily plans?', 'Have weather patterns changed in your area?'], part2Topic: 'A journey you remember', part2: 'Describe a journey that you remember well.', part2Bullets: ['where you went', 'how you travelled', 'what happened during the journey', 'and explain why you remember it'], part3Topic: 'Travel and the Environment', part3: ['How can tourism benefit local communities?', 'What problems can mass tourism create?', 'Should governments limit visitors to fragile natural areas?'] }
})

export const IELTS_EXAM_COLLECTIONS: FullIELTSExam[] = [
  firstAcademicExam,
  freshExam2,
  freshExam3
]
