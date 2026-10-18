import type { QuestionBankItem } from './questionBankTypes'

/**
 * Seed Question Bank for IELTS Optimizer (Phase 1).
 *
 * Contains 1–2 original representative items per IELTS skill (Reading, Listening, Writing, Speaking).
 * Every item adheres strictly to the Question Bank schema version 1 and has status 'approved'.
 */
export const SEED_QUESTION_BANK_ITEMS: QuestionBankItem[] = [
  // =========================================================================
  // READING ITEM 1 (Academic Reading Passage 1 - Intermediate)
  // =========================================================================
  {
    id: 'reading-qb-001',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Reading',
    taskType: 'academic_reading',
    topic: 'Environment & Urban Planning',
    difficulty: 'intermediate',
    title: 'The Architecture of Urban Vertical Farming',
    instructions: 'Read the passage carefully and answer the following questions based on the text.',
    objectives: ['reading:detail', 'reading:inference'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      organization: 'IELTS Optimizer Project',
      license: 'CC-BY-4.0',
      provenanceType: 'original',
      sourceReference: 'Original curriculum asset for IELTS Academic Reading preparation'
    },
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
    reviewedBy: 'Academic Content Lead',
    reviewNotes: 'Verified passage word count, grounded verbatim evidence quotes, and objective mapping.',
    payload: {
      passageTitle: 'The Architecture of Urban Vertical Farming',
      passageText:
        'Vertical farming represents a revolutionary departure from conventional open-field agriculture by cultivating plant life in vertically stacked layers inside controlled environment structures. By utilizing closed-loop irrigation systems, vertical farms can recirculate water through mineral nutrient solutions, consuming up to ninety-five percent less water than traditional soil-based farming techniques. In addition, urban vertical farms eliminate agricultural runoff, which often contaminates surrounding watersheds with pesticides and surplus nitrates. However, the operational viability of these facilities remains heavily contingent on artificial LED lighting arrays, resulting in significant electrical energy consumption that can undermine their overall environmental footprint if powered by fossil fuel grids.',
      passageWordCount: 104,
      readingPassageNumber: 1,
      questions: [
        {
          id: 'reading-qb-001-q1',
          type: 'multiple-choice',
          prompt: 'According to the passage, what is a primary ecological benefit of closed-loop irrigation in vertical farms?',
          options: [
            'consuming up to ninety-five percent less water than traditional soil-based farming techniques',
            'Completely replacing the requirement for artificial LED lighting',
            'Relying exclusively on natural seasonal rainfall',
            'Increasing soil erosion in neighboring suburban plots'
          ],
          answerKey: 'consuming up to ninety-five percent less water than traditional soil-based farming techniques',
          explanation: 'The passage explicitly notes that vertical farms recirculate water, consuming up to ninety-five percent less water than traditional soil-based farming techniques.',
          evidenceQuote: 'consuming up to ninety-five percent less water than traditional soil-based farming techniques',
          objective: 'reading:detail',
          equivalenceGroup: 'eq-reading-vertical-water'
        },
        {
          id: 'reading-qb-001-q2',
          type: 'true-false-not-given',
          prompt: 'The environmental sustainability of vertical farms can be compromised if they rely on electricity produced from fossil fuels.',
          answerKey: 'TRUE',
          explanation: 'The author notes that heavy reliance on artificial LED lighting causes high electrical consumption that undermines environmental benefits when powered by fossil fuel grids.',
          evidenceQuote: 'resulting in significant electrical energy consumption that can undermine their overall environmental footprint if powered by fossil fuel grids',
          objective: 'reading:inference',
          equivalenceGroup: 'eq-reading-vertical-energy'
        }
      ]
    }
  },

  // =========================================================================
  // READING ITEM 2 (Academic Reading Passage 2 - Advanced)
  // =========================================================================
  {
    id: 'reading-qb-002',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Reading',
    taskType: 'academic_reading',
    topic: 'Marine Biology & Oceanography',
    difficulty: 'advanced',
    title: 'Bioluminescence in Deep-Sea Marine Organisms',
    instructions: 'Read the passage and answer the accompanying comprehension questions.',
    objectives: ['reading:detail', 'reading:inference'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      organization: 'IELTS Optimizer Project',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-02T09:00:00Z',
    payload: {
      passageTitle: 'Bioluminescence in Deep-Sea Marine Organisms',
      passageText:
        "Bioluminescence—the production and emission of light by living organisms—is ubiquitous across the bathypelagic zone of the world's oceans. In the deep sea where sunlight fails to penetrate, creatures such as the anglerfish and lanternfish rely on specialized biochemical reactions involving the pigment luciferin and the catalytic enzyme luciferase to synthesize cold light. Rather than serving purely decorative functions, these photophores are deployed for critical evolutionary imperatives: startling prospective predators with sudden flashes, blending into faint downwelling ambient light through counterillumination, and luring unwary prey directly toward the predator's jaw.",
      passageWordCount: 88,
      readingPassageNumber: 2,
      questions: [
        {
          id: 'reading-qb-002-q1',
          type: 'multiple-choice',
          prompt: 'Which chemical components are synthesized by deep-sea organisms to produce cold light?',
          options: [
            'involving the pigment luciferin and the catalytic enzyme luciferase',
            'Surplus nitrates and industrial pesticides',
            'Chlorophyll pigments and sunlight photons',
            'Calcium carbonate and silica deposits'
          ],
          answerKey: 'involving the pigment luciferin and the catalytic enzyme luciferase',
          explanation: 'The text states that specialized biochemical reactions involve the pigment luciferin and the catalytic enzyme luciferase to synthesize cold light.',
          evidenceQuote: 'involving the pigment luciferin and the catalytic enzyme luciferase to synthesize cold light',
          objective: 'reading:detail',
          equivalenceGroup: 'eq-reading-biochem-light'
        },
        {
          id: 'reading-qb-002-q2',
          type: 'true-false-not-given',
          prompt: 'Deep-sea marine organisms use their light emissions exclusively to attract food.',
          answerKey: 'FALSE',
          explanation: 'The passage lists multiple functions including startling predators and counterillumination camouflage, proving the emissions are not exclusively for attracting prey.',
          evidenceQuote: 'startling prospective predators with sudden flashes, blending into faint downwelling ambient light through counterillumination, and luring unwary prey',
          objective: 'reading:inference',
          equivalenceGroup: 'eq-reading-biochem-adaptation'
        }
      ]
    }
  },

  // =========================================================================
  // LISTENING ITEM 1 (Section 1 Conversation - Intermediate)
  // =========================================================================
  {
    id: 'listening-qb-001',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Listening',
    taskType: 'section1_conversation',
    topic: 'University Facilities',
    difficulty: 'intermediate',
    title: 'University Library Orientation Desk',
    instructions: 'Listen to the conversation transcript and answer the questions that follow.',
    objectives: ['listening:detail'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-03T10:00:00Z',
    updatedAt: '2026-03-03T10:00:00Z',
    payload: {
      audioPrompt: 'Campus library staff explaining circulation policies to an incoming student.',
      transcript:
        'Welcome to the St. Jude University Library orientation desk. Undergraduate students are permitted to borrow up to ten standard monographs for a duration of fourteen consecutive days. In contrast, postgraduate researchers have an expanded quota of twenty-five volumes for thirty days. Overdue materials will incur a modest fine of fifty pence per working day. The reference archives on the third floor are strictly reserved for silent study, and books from that section cannot be checked out under any circumstances.',
      isSyntheticSpeech: true,
      audioSection: 1,
      questions: [
        {
          id: 'listening-qb-001-q1',
          type: 'multiple-choice',
          prompt: 'What is the maximum number of standard monographs an undergraduate student can borrow?',
          options: [
            'borrow up to ten standard monographs',
            'Twenty-five volumes',
            'Fourteen books',
            'Unlimited volumes'
          ],
          answerKey: 'borrow up to ten standard monographs',
          explanation: 'The staff member states that undergraduate students are permitted to borrow up to ten standard monographs.',
          evidenceQuote: 'borrow up to ten standard monographs for a duration of fourteen consecutive days',
          objective: 'listening:detail',
          equivalenceGroup: 'eq-listening-library-rules'
        },
        {
          id: 'listening-qb-001-q2',
          type: 'multiple-choice',
          prompt: 'What is the penalty charged for overdue library items?',
          options: [
            'fine of fifty pence per working day',
            'One pound per calendar day',
            'Immediate cancellation of borrowing privileges',
            'Five pounds per overdue volume'
          ],
          answerKey: 'fine of fifty pence per working day',
          explanation: 'The audio indicates that overdue materials will incur a fine of fifty pence per working day.',
          evidenceQuote: 'Overdue materials will incur a modest fine of fifty pence per working day',
          objective: 'listening:detail',
          equivalenceGroup: 'eq-listening-library-penalties'
        }
      ]
    }
  },

  // =========================================================================
  // LISTENING ITEM 2 (Section 4 Academic Lecture - Advanced)
  // =========================================================================
  {
    id: 'listening-qb-002',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Listening',
    taskType: 'section4_lecture',
    topic: 'Anthropology & Navigation',
    difficulty: 'advanced',
    title: 'Traditional Polynesian Ocean Wayfinding',
    instructions: 'Listen to the lecture excerpt and answer the accompanying comprehension question.',
    objectives: ['listening:main-idea'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-04T11:00:00Z',
    updatedAt: '2026-03-04T11:00:00Z',
    payload: {
      audioPrompt: 'Excerpt from an anthropology lecture on open ocean Pacific navigation without instruments.',
      transcript:
        'Early Polynesian navigators crossed thousands of kilometers across open ocean without magnetic compasses or sextants. Instead, they relied upon an intricate system known as wayfinding, which synthesized observations of zenith stars, ocean swells, and sea-bird flight patterns. By identifying the specific point on the horizon where known stars rose and set, navigators could maintain a reliable bearing throughout the nocturnal journey.',
      isSyntheticSpeech: true,
      audioSection: 4,
      questions: [
        {
          id: 'listening-qb-002-q1',
          type: 'multiple-choice',
          prompt: 'Which natural environmental cues were synthesized by traditional navigators?',
          options: [
            'observations of zenith stars, ocean swells, and sea-bird flight patterns',
            'Satellite telemetry and magnetic compass readings',
            'Undersea fiber cables and echo sounding',
            'Mechanical clockwork chronometers'
          ],
          answerKey: 'observations of zenith stars, ocean swells, and sea-bird flight patterns',
          explanation: 'The lecturer notes that navigators synthesized observations of zenith stars, ocean swells, and sea-bird flight patterns.',
          evidenceQuote: 'synthesized observations of zenith stars, ocean swells, and sea-bird flight patterns',
          objective: 'listening:main-idea',
          equivalenceGroup: 'eq-listening-pacific-navigation'
        }
      ]
    }
  },

  // =========================================================================
  // WRITING ITEM 1 (Academic Task 1 - Process Diagram)
  // =========================================================================
  {
    id: 'writing-qb-001',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Writing',
    taskType: 'academic_task1',
    topic: 'Engineering & Water Treatment',
    difficulty: 'intermediate',
    title: 'Academic Task 1: Municipal Water Reclamation Process',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    objectives: ['writing:task-achievement', 'writing:coherence-cohesion'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-05T12:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
    payload: {
      prompt:
        'The diagram illustrates the sequential stages of a municipal wastewater reclamation and purification plant. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      taskType: 'academic_task1',
      minimumWordCount: 150,
      stimulusType: 'diagram',
      stimulusDescription:
        'Six-stage linear process: 1. Coarse screening filter; 2. Primary sedimentation tank for heavy sludge; 3. Aerated bioreactor chamber; 4. Secondary clarifier; 5. Ultraviolet disinfection chamber; 6. Distribution into municipal reservoir.',
      guidance: 'Group the stages logically into mechanical separation, biological purification, and final sterilization.',
      rubric: {
        taskAchievementOrResponseCriteria:
          'Presents a comprehensive overview highlighting major treatment phases; accurately describes each stage without omissions or speculative external data.',
        coherenceAndCohesionCriteria:
          'Utilizes appropriate logical sequencers (initially, subsequently, following biological aeration, finally); well-paragraphed structure with clear thematic progression.',
        lexicalResourceCriteria:
          'Accurately applies domain-appropriate vocabulary (effluent, filtration, sedimentation, disinfection, purification) with correct spelling.',
        grammaticalRangeAndAccuracyCriteria:
          'Consistently produces correct passive voice constructions (is channeled, is treated, are filtered) with complex clause combinations.'
      },
      approachHints: [
        'Write a clear two-sentence overview stating the starting input and the final purified outcome.',
        'Use passive verbs consistently to describe industrial transformations.',
        'Ensure transition words connect each chronological step smoothly.'
      ]
    }
  },

  // =========================================================================
  // WRITING ITEM 2 (Task 2 Essay - Advanced)
  // =========================================================================
  {
    id: 'writing-qb-002',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Writing',
    taskType: 'task2',
    topic: 'Employment & Society',
    difficulty: 'advanced',
    title: 'Writing Task 2: Remote Work and Urban Decentralization',
    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',
    objectives: ['writing:task-response', 'writing:argument-development'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-06T13:00:00Z',
    updatedAt: '2026-03-06T13:00:00Z',
    payload: {
      prompt:
        'In many nations, an increasing proportion of employees are working remotely from home rather than commuting to metropolitan offices. Do the advantages of this trend outweigh the disadvantages for individuals and urban communities? Give reasons for your answer and include relevant examples from your knowledge or experience. Write at least 250 words.',
      taskType: 'task2',
      minimumWordCount: 250,
      stimulusType: 'essay_prompt',
      guidance: 'Examine both individual worker benefits and urban community economic repercussions before stating a clear evaluative conclusion.',
      rubric: {
        taskAchievementOrResponseCriteria:
          'Directly addresses all facets of the prompt with a clear, sustained position; thoroughly justifies whether advantages outweigh disadvantages with nuanced reasoning.',
        coherenceAndCohesionCriteria:
          'Logical paragraph organization around distinct central ideas; sophisticated sentence transitions and precise referential cohesion.',
        lexicalResourceCriteria:
          'Demonstrates a broad lexical repertoire (telecommuting, urban decentralization, transit congestion, socioeconomic vitality) with natural collocations.',
        grammaticalRangeAndAccuracyCriteria:
          'Uses a wide variety of complex sentence structures (concessive clauses, conditional sentences, inversion) with high syntactic accuracy.'
      },
      approachHints: [
        'State your clear stance in the introduction regarding whether benefits outweigh drawbacks.',
        'Devote one body paragraph to personal productivity and reduced commuting stress.',
        'Devote a second body paragraph to urban commercial impacts and social isolation concerns.',
        'Summarize with a balanced conclusion reinforcing your primary thesis.'
      ]
    }
  },

  // =========================================================================
  // SPEAKING ITEM 1 (Part 1 - Intermediate)
  // =========================================================================
  {
    id: 'speaking-qb-001',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Speaking',
    taskType: 'part1',
    topic: 'Daily Life & Modern Technology',
    difficulty: 'intermediate',
    title: 'Speaking Part 1: Smart Devices and Daily Routines',
    instructions: 'Answer the examiner questions regarding your daily schedule and technology use.',
    objectives: ['speaking:fluency', 'speaking:lexical-range'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-07T14:00:00Z',
    updatedAt: '2026-03-07T14:00:00Z',
    payload: {
      part: 'part1',
      topic: 'Smart Devices and Daily Routines',
      mainPrompt: "Let's discuss how you integrate modern electronic devices into your regular day-to-day schedule.",
      followUpQuestions: [
        'What electronic device do you find most indispensable throughout your day?',
        'How has the way you organize your study or work schedule changed compared to a few years ago?',
        'Do you believe people spend excessive amounts of time interacting with digital screens nowadays?'
      ],
      targetSubskills: ['personal-experience-recount', 'habitual-routine-verbs', 'opinion-justification'],
      limitationsNotice:
        'Notice: Automated evaluation analyzes text transcription for vocabulary diversity, sentence complexity, and topical relevance. Acoustic pronunciation, intonation, and connected speech require human examiner evaluation.'
    }
  },

  // =========================================================================
  // SPEAKING ITEM 2 (Part 2 & Part 3 - Advanced)
  // =========================================================================
  {
    id: 'speaking-qb-002',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Speaking',
    taskType: 'part2',
    topic: 'Environment & Civic Action',
    difficulty: 'advanced',
    title: 'Speaking Part 2 & 3: Community Environmental Initiative',
    instructions: 'You have 1 minute to prepare your notes, then speak for up to 2 minutes on the cue card.',
    objectives: ['speaking:extended-discourse', 'speaking:discourse-cohesion'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-08T15:00:00Z',
    updatedAt: '2026-03-08T15:00:00Z',
    payload: {
      part: 'part2',
      topic: 'Community Environmental Initiative',
      mainPrompt: 'Describe an environmental project or initiative in your locality that you consider beneficial.',
      cueCardBullets: [
        'What the initiative was and who initiated it',
        'What specific ecological or local challenge it targeted',
        'How members of your community engaged or contributed',
        'And explain why you evaluate this initiative as impactful or positive'
      ],
      preparationTimeSeconds: 60,
      speakingTimeSeconds: 120,
      followUpQuestions: [
        'Do you believe environmental conservation should be primarily funded by governments or community grassroots groups?',
        'How can academic institutions best inculcate sustainable habits in children?'
      ],
      targetSubskills: ['structured-long-turn', 'narrative-tenses', 'evaluative-adjectives', 'abstract-argumentation'],
      limitationsNotice:
        'Notice: Automated scoring of candidate speech transcription measures vocabulary range, syntactic complexity, and cohesive markers. Acoustic pronunciation features cannot be verified from textual transcripts alone.'
    }
  },

  // =========================================================================
  // READING ITEM 3 (Academic Reading Passage 3 - Advanced)
  // =========================================================================
  {
    id: 'reading-qb-003',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Reading',
    taskType: 'academic_reading',
    topic: 'Renewable Energy & Thermodynamics',
    difficulty: 'advanced',
    title: 'Ocean Thermal Energy Conversion and Baseload Clean Power',
    instructions: 'Read the text carefully and answer the questions that follow.',
    objectives: ['reading:detail', 'reading:inference'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-09T08:00:00Z',
    updatedAt: '2026-03-09T08:00:00Z',
    payload: {
      passageTitle: 'Ocean Thermal Energy Conversion and Baseload Clean Power',
      passageText:
        'Ocean Thermal Energy Conversion, commonly abbreviated as OTEC, harnesses the natural thermodynamic gradient between solar-warmed surface seawater and ice-cold water pumped from depths exceeding one thousand meters. In a closed-cycle OTEC facility, warm surface water evaporates a low-boiling-point working fluid, such as ammonia, generating pressurized vapor to drive a standard turbine generator. Subsequently, deep ocean currents provide the chilled fluid needed to condense the vapor back into liquid form. Unlike intermittent solar and wind installations, tropical oceans absorb vast quantities of solar irradiance continuously, allowing OTEC installations to supply steady, round-the-clock baseload electrical power. Nevertheless, the substantial capital expenditure required for long-distance cold-water piping and the corrosive nature of marine saline environments have historically constrained commercial-scale adoption.',
      passageWordCount: 122,
      readingPassageNumber: 3,
      questions: [
        {
          id: 'reading-qb-003-q1',
          type: 'multiple-choice',
          prompt: 'What characteristic allows OTEC plants to provide baseload electricity, unlike wind and solar?',
          options: [
            'allowing OTEC installations to supply steady, round-the-clock baseload electrical power',
            'Their complete reliance on deep underground geothermal reservoirs',
            'The total absence of corrosive marine salts in tropical latitudes',
            'Their significantly lower initial capital expenditure compared to wind turbines'
          ],
          answerKey: 'allowing OTEC installations to supply steady, round-the-clock baseload electrical power',
          explanation: 'The passage highlights that tropical oceans absorb solar irradiance continuously, allowing OTEC installations to supply steady, round-the-clock baseload power.',
          evidenceQuote: 'allowing OTEC installations to supply steady, round-the-clock baseload electrical power',
          objective: 'reading:detail',
          equivalenceGroup: 'eq-reading-otec-power'
        },
        {
          id: 'reading-qb-003-q2',
          type: 'true-false-not-given',
          prompt: 'Commercial implementation of OTEC has been hindered by expensive piping infrastructure and salt corrosion.',
          answerKey: 'TRUE',
          explanation: 'The passage concludes that substantial capital expenditure for cold-water piping and marine corrosion have historically constrained commercial adoption.',
          evidenceQuote: 'substantial capital expenditure required for long-distance cold-water piping and the corrosive nature of marine saline environments have historically constrained commercial-scale adoption',
          objective: 'reading:inference',
          equivalenceGroup: 'eq-reading-otec-challenges'
        }
      ]
    }
  },

  // =========================================================================
  // READING ITEM 4 (Academic Reading - Expert / Band 8.0-9.0)
  // =========================================================================
  {
    id: 'reading-qb-004',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Reading',
    taskType: 'academic_reading',
    topic: 'Neuroscience & Language Acquisition',
    difficulty: 'expert',
    title: 'Cognitive Architecture and Executive Function in Bilingualism',
    instructions: 'Read the academic article excerpt and answer the questions.',
    objectives: ['reading:inference', 'reading:detail'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
    payload: {
      passageTitle: 'Cognitive Architecture and Executive Function in Bilingualism',
      passageText:
        'For decades, early pedagogical dogma posited that multilingual exposure in formative childhood impeded linguistic developmental milestones. Contemporary neuroimaging techniques, however, have decisively repudiated this conjecture. Functional magnetic resonance imaging demonstrates that both linguistic linguistic systems remain perpetually active in the bilingual brain, even when communication is restricted to a monolingual setting. As a consequence, the prefrontal cortex must continuously recruit executive control mechanisms—specifically inhibitory control, task switching, and cognitive flexibility—to suppress intrusive interference from the non-target language. This chronic neurological engagement confers structural advantages, manifesting as increased gray matter density in the anterior cingulate cortex and demonstrably postponing the clinical onset of neurodegenerative symptoms in late adulthood.',
      passageWordCount: 114,
      readingPassageNumber: 3,
      questions: [
        {
          id: 'reading-qb-004-q1',
          type: 'multiple-choice',
          prompt: 'Why is the prefrontal cortex constantly engaged in a bilingual individual during conversation?',
          options: [
            'to suppress intrusive interference from the non-target language',
            'Because one language is completely deactivated when speaking the other',
            'To compensate for slower overall childhood linguistic development',
            'Because bilinguals lack standard executive control mechanisms'
          ],
          answerKey: 'to suppress intrusive interference from the non-target language',
          explanation: 'The text explains that executive control mechanisms are continually recruited to suppress intrusive interference from the non-target language.',
          evidenceQuote: 'to suppress intrusive interference from the non-target language',
          objective: 'reading:detail',
          equivalenceGroup: 'eq-reading-bilingual-neuro'
        },
        {
          id: 'reading-qb-004-q2',
          type: 'true-false-not-given',
          prompt: 'Modern neuroimaging confirms earlier assumptions that bilingualism delays childhood mental milestones.',
          answerKey: 'FALSE',
          explanation: 'The text states that contemporary neuroimaging has decisively repudiated the earlier dogma that multilingual exposure impeded development.',
          evidenceQuote: 'Contemporary neuroimaging techniques, however, have decisively repudiated this conjecture',
          objective: 'reading:inference',
          equivalenceGroup: 'eq-reading-bilingual-myths'
        }
      ]
    }
  },

  // =========================================================================
  // LISTENING ITEM 3 (Section 1 Conversation - Foundation)
  // =========================================================================
  {
    id: 'listening-qb-003',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Listening',
    taskType: 'section1_conversation',
    topic: 'Student Accommodation',
    difficulty: 'foundation',
    title: 'Student Hall Accommodation and Rental Lease Inquiry',
    instructions: 'Listen to the inquiry between an international student and accommodation housing manager.',
    objectives: ['listening:detail'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-11T10:00:00Z',
    updatedAt: '2026-03-11T10:00:00Z',
    payload: {
      audioPrompt: 'International student inquiring about university dorm contract dates and refundable security deposits.',
      transcript:
        'Good morning, Welcome to the University Housing office. Our standard academic year residential contract runs for forty-two weeks, beginning on the fifteenth of September. The weekly rental fee includes high-speed wireless internet, heating, and water utilities. However, electrical usage in individual studio kitchens is metered separately. All incoming residents must pay a refundable security deposit of two hundred and fifty pounds prior to receiving dormitory room keys. If the inspection confirms zero damage upon checkout, this deposit is returned within fourteen business days.',
      isSyntheticSpeech: true,
      audioSection: 1,
      questions: [
        {
          id: 'listening-qb-003-q1',
          type: 'multiple-choice',
          prompt: 'What is the amount of the refundable security deposit required from incoming students?',
          options: [
            'refundable security deposit of two hundred and fifty pounds',
            'One hundred pounds',
            'Forty-two pounds',
            'Five hundred pounds'
          ],
          answerKey: 'refundable security deposit of two hundred and fifty pounds',
          explanation: 'The manager states that all incoming residents must pay a refundable security deposit of two hundred and fifty pounds.',
          evidenceQuote: 'refundable security deposit of two hundred and fifty pounds prior to receiving dormitory room keys',
          objective: 'listening:detail',
          equivalenceGroup: 'eq-listening-housing-deposit'
        },
        {
          id: 'listening-qb-003-q2',
          type: 'multiple-choice',
          prompt: 'Which utility service is billed separately from the weekly rental fee?',
          options: [
            'electrical usage in individual studio kitchens is metered separately',
            'High-speed wireless internet connection',
            'Central hot water supply',
            'Winter building heating'
          ],
          answerKey: 'electrical usage in individual studio kitchens is metered separately',
          explanation: 'The manager explicitly notes that electrical usage in individual studio kitchens is metered separately.',
          evidenceQuote: 'electrical usage in individual studio kitchens is metered separately',
          objective: 'listening:detail',
          equivalenceGroup: 'eq-listening-housing-utilities'
        }
      ]
    }
  },

  // =========================================================================
  // LISTENING ITEM 4 (Section 3 Academic Discussion - Advanced)
  // =========================================================================
  {
    id: 'listening-qb-004',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Listening',
    taskType: 'section3_discussion',
    topic: 'Conservation Biology',
    difficulty: 'advanced',
    title: 'Wildlife Corridors and Habitat Fragmentation Study',
    instructions: 'Listen to the tutorial discussion between an ecology tutor and two postgraduate researchers.',
    objectives: ['listening:detail', 'listening:synthesis'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-12T11:00:00Z',
    updatedAt: '2026-03-12T11:00:00Z',
    payload: {
      audioPrompt: 'Discussion regarding spatial ecological connectivity and canopy bridges over transportation infrastructure.',
      transcript:
        'When highway networks bisect dense rainforest reserves, the resulting habitat fragmentation isolates arboreal animal populations into vulnerable genetic enclaves. Our research team evaluated vegetative wildlife overpasses and rope canopy bridges across Northern Queensland. Over an eighteen-month monitoring period, motion-sensor camera traps verified that canopy bridges dramatically reduced mammalian road mortalities by seventy-three percent. Crucially, the bridges facilitated inter-patch gene flow among ringtail possums, counteracting inbreeding depression in previously severed forest fragments.',
      isSyntheticSpeech: true,
      audioSection: 3,
      questions: [
        {
          id: 'listening-qb-004-q1',
          type: 'multiple-choice',
          prompt: 'By what percentage did canopy bridges decrease mammal road deaths during the monitoring study?',
          options: [
            'reduced mammalian road mortalities by seventy-three percent',
            'Eighteen percent',
            'Forty-two percent',
            'Ninety-five percent'
          ],
          answerKey: 'reduced mammalian road mortalities by seventy-three percent',
          explanation: 'The researcher notes that camera traps verified canopy bridges reduced mammalian road mortalities by seventy-three percent.',
          evidenceQuote: 'reduced mammalian road mortalities by seventy-three percent',
          objective: 'listening:detail',
          equivalenceGroup: 'eq-listening-corridors-stats'
        }
      ]
    }
  },

  // =========================================================================
  // WRITING ITEM 3 (Academic Task 1 - Bar Chart / Comparative)
  // =========================================================================
  {
    id: 'writing-qb-003',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Writing',
    taskType: 'academic_task1',
    topic: 'Global Energy Transition',
    difficulty: 'advanced',
    title: 'Academic Task 1: Renewable Electricity Generation by Source',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    objectives: ['writing:task-achievement', 'writing:lexical-range'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-13T12:00:00Z',
    updatedAt: '2026-03-13T12:00:00Z',
    payload: {
      prompt:
        'The bar chart compares renewable electricity generation across four major sectors (hydropower, wind, solar photovoltaic, and biomass) in three countries between 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      taskType: 'academic_task1',
      minimumWordCount: 150,
      stimulusType: 'chart',
      stimulusDescription:
        'Comparative bar chart: Country A led in hydropower in 2015 (180 TWh) but experienced exponential solar growth to 220 TWh by 2025. Country B expanded offshore wind from 40 TWh to 190 TWh. Country C maintained consistent biomass reliance (80 TWh) with modest solar investments.',
      guidance: 'Provide a clear overview comparing the overall surge in solar and wind versus the stagnation in traditional biomass.',
      rubric: {
        taskAchievementOrResponseCriteria:
          'Identifies primary trends and comparative differences across sectors and countries; supports key observations with precise statistical data without mechanical repetition.',
        coherenceAndCohesionCriteria:
          'Groups comparative data systematically into logical paragraphs (e.g., leaders in solar/wind vs baseline hydropower); uses advanced comparison linkers (whereas, in sharp contrast, overtook, mirrored).',
        lexicalResourceCriteria:
          'Applies varied vocabulary for trends and comparisons (exponential surge, plateaued, outstripped, substantial expansion) with accurate precision.',
        grammaticalRangeAndAccuracyCriteria:
          'Employs varied complex syntactic forms including comparative structures, passive voice, and participial clauses with high grammatical correctness.'
      },
      approachHints: [
        'Highlight the dramatic transition from hydro to solar and wind as your overarching overview.',
        'Contrast the rapid expansion in Country A and B with the modest trajectory in Country C.',
        'Avoid listing every single numerical figure; focus on significant milestones and shifts.'
      ]
    }
  },

  // =========================================================================
  // WRITING ITEM 4 (General Training Task 1 - Formal Letter)
  // =========================================================================
  {
    id: 'writing-qb-004',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Writing',
    taskType: 'general_task1',
    topic: 'Consumer Rights & Travel',
    difficulty: 'intermediate',
    title: 'General Training Task 1: Formal Letter of Complaint to an Airline',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    objectives: ['writing:task-achievement', 'writing:tone-register'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-14T13:00:00Z',
    updatedAt: '2026-03-14T13:00:00Z',
    payload: {
      prompt:
        'You recently experienced severe flight delays and mishandled luggage on an international flight with Pacific Air. Write a formal letter of complaint to the Customer Relations Director. In your letter: (1) provide details of your journey and booking reference, (2) explain the problems and distress caused by the delay and lost luggage, and (3) specify the compensation or remedial action you expect. Write at least 150 words.',
      taskType: 'general_task1',
      minimumWordCount: 150,
      stimulusType: 'letter_prompt',
      guidance: 'Maintain a consistently polite yet firm formal register throughout the letter.',
      rubric: {
        taskAchievementOrResponseCriteria:
          'Covers all three prompt bullet points in depth with realistic details (flight number, duration of delay, contents of luggage, specific claim amount).',
        coherenceAndCohesionCriteria:
          'Follows formal letter conventions (formal salutation, structured paragraphs matching prompt points, formal sign-off); clean logical paragraph sequencing.',
        lexicalResourceCriteria:
          'Demonstrates formal business and legal correspondence vocabulary (mishandled baggage, monetary restitution, inconvenience incurred, statutory entitlement) without informal colloquialisms.',
        grammaticalRangeAndAccuracyCriteria:
          'Accurate use of formal complex sentence structures, conditional forms (should you fail to respond, I would expect), and past modal verbs.'
      },
      approachHints: [
        'Open with a formal salutation: Dear Sir or Madam, followed by a direct statement of purpose.',
        'Address each bullet point in its own dedicated paragraph.',
        'Conclude with a clear deadline for response and a formal sign-off (Yours faithfully).'
      ]
    }
  },

  // =========================================================================
  // SPEAKING ITEM 3 (Part 1 - Foundation / Intermediate)
  // =========================================================================
  {
    id: 'speaking-qb-003',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Speaking',
    taskType: 'part1',
    topic: 'Transportation & Commuting',
    difficulty: 'foundation',
    title: 'Speaking Part 1: Public Transportation and Commuting',
    instructions: 'Answer the examiner questions regarding public transit systems in your area.',
    objectives: ['speaking:fluency', 'speaking:lexical-range'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-03-15T14:00:00Z',
    payload: {
      part: 'part1',
      topic: 'Public Transportation and Commuting',
      mainPrompt: "Let's talk about the transportation options you utilize to travel around your hometown.",
      followUpQuestions: [
        'How do you usually travel to work or school every day?',
        'Do you think public transportation in your city is affordable for ordinary citizens?',
        'What improvements would you introduce to the bus or metro system in your area?'
      ],
      targetSubskills: ['daily-commute-vocabulary', 'comparative-preferences', 'suggestion-structures'],
      limitationsNotice:
        'Notice: Automated assessment analyzes textual transcripts for lexical richness, grammar accuracy, and response completeness. Pronunciation scoring requires human or acoustic model assessment.'
    }
  },

  // =========================================================================
  // SPEAKING ITEM 4 (Part 2 & Part 3 - Expert)
  // =========================================================================
  {
    id: 'speaking-qb-004',
    schemaVersion: 1,
    contentVersion: 1,
    skill: 'Speaking',
    taskType: 'part2',
    topic: 'Personal Challenges & Ethical Decisions',
    difficulty: 'expert',
    title: 'Speaking Part 2 & 3: A Difficult Decision You Made',
    instructions: 'You have 1 minute to prepare notes, then speak for up to 2 minutes on the cue card.',
    objectives: ['speaking:extended-discourse', 'speaking:discourse-cohesion'],
    status: 'approved',
    source: {
      author: 'IELTS Optimizer Editorial Team',
      license: 'CC-BY-4.0',
      provenanceType: 'original'
    },
    createdAt: '2026-03-16T15:00:00Z',
    updatedAt: '2026-03-16T15:00:00Z',
    payload: {
      part: 'part2',
      topic: 'A Difficult Decision You Made',
      mainPrompt: 'Describe a significant and challenging decision that you had to make in your life.',
      cueCardBullets: [
        'What the decision was and when you had to make it',
        'What alternative choices or paths were available to you',
        'Why this decision was particularly challenging or stressful',
        'And explain how you evaluate the long-term consequences of that decision'
      ],
      preparationTimeSeconds: 60,
      speakingTimeSeconds: 120,
      followUpQuestions: [
        'Why do young people sometimes struggle with career choices more than previous generations?',
        'To what extent should individuals rely on intuition versus analytical reasoning when resolving dilemmas?'
      ],
      targetSubskills: ['hypothetical-conditionals', 'deliberation-markers', 'evaluative-adjectives', 'philosophical-abstraction'],
      limitationsNotice:
        'Notice: Text evaluation measures lexical sophistication, cohesion markers, and argument structure. Phonological features such as connected speech and intonation cannot be measured from transcripts alone.'
    }
  }
]
