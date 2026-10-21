import type { TopicId } from './topicData'

export type SkillModelContent = {
  writingTask2?: { title: string; text: string; notes: string[] }
  speakingPart2?: { title: string; text: string; notes: string[] }
}

/** Short, annotated models: learners compare structure and language after producing their own answer. */
export const SKILL_MODEL_CONTENT: Partial<Record<TopicId, SkillModelContent>> = {
  education: {
    writingTask2: {
      title: 'Đoạn mẫu: cân bằng lợi ích công và chi phí cá nhân',
      text: 'Public funding can widen access to higher education because students are not forced to reject a degree solely for financial reasons. This benefits society as well as individuals: graduates may contribute specialist skills, research and tax revenue over many years. Nevertheless, making every course entirely free would place a substantial burden on taxpayers, including people who do not attend university. A more balanced approach would combine public funding with means-tested contributions, while protecting essential grants for disadvantaged students. This would preserve education as a public good without pretending that unlimited resources are available.',
      notes: ['Topic sentence nêu trực tiếp lợi ích của quan điểm đầu tiên.', 'Ví dụ được giải thích bằng cơ chế xã hội, không chỉ liệt kê.', 'Kết luận đoạn có nhượng bộ và giải pháp cân bằng.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a memorable teacher',
      text: 'The teacher I remember most clearly was my high-school science teacher, Ms Lan. I used to think science was mainly about memorising formulas, but she changed that by asking us to explain everyday problems. For example, she asked our class why a crowded room felt hotter, and we designed a small experiment rather than simply reading the answer. I learned to question evidence and to explain an idea in simple language. What made her influence lasting was her patience: she corrected weak answers without making students feel embarrassed. I still use that habit whenever I have to learn something difficult.',
      notes: ['Dùng past simple cho câu chuyện và present simple cho ảnh hưởng hiện tại.', 'Mỗi bullet của cue card được phát triển bằng một chi tiết cụ thể.', 'Câu kết nối trải nghiệm cũ với năng lực hiện tại.']
    }
  },
  environment: {
    writingTask2: {
      title: 'Đoạn mẫu: trách nhiệm cá nhân và chính sách',
      text: 'Individual choices matter because repeated actions create demand for less wasteful products. Recycling, reducing unnecessary travel and choosing durable goods can also make environmental responsibility visible in daily life. However, personal effort has a limited effect when infrastructure and prices encourage the opposite behaviour. A household cannot choose an efficient bus service that does not exist, and consumers cannot inspect every stage of a global supply chain. Governments should therefore set standards and invest in alternatives, while citizens use those alternatives responsibly. The most credible solution is coordinated change rather than blaming one group.',
      notes: ['Dùng concession để tránh lập luận một chiều.', 'Ví dụ cụ thể làm rõ “limited effect”.', 'Câu cuối tổng hợp hai phía thành lập trường riêng.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: an environmental initiative',
      text: 'One initiative I would introduce in my town is a neighbourhood tree-and-shade programme. The council would plant suitable trees along routes used by students and older residents, and local groups would help look after them during the first two years. I chose this idea because it would provide several benefits at once: cooler pavements, cleaner air and more pleasant public spaces. It would not solve climate change by itself, of course, but it would be a visible and practical improvement. The project would work best if the council published water-use data and invited residents to suggest locations.',
      notes: ['Dùng would để mô tả đề xuất giả định.', 'Có câu nhượng bộ “not solve... by itself” giúp câu trả lời cân bằng.', 'Kết thúc bằng điều kiện triển khai cụ thể.']
    }
  },
  technology: {
    writingTask2: {
      title: 'Đoạn mẫu: đánh giá công nghệ theo điều kiện sử dụng',
      text: 'Digital devices can support learning when their purpose is clear. A student may use a simulation to visualise a scientific process or an accessibility tool to read material that would otherwise be difficult to access. The benefit disappears, however, when constant notifications fragment attention and replace sustained practice. For this reason, the relevant question is not whether devices are good or bad in themselves, but whether their use produces a measurable learning gain. Schools should teach students to choose appropriate tools, set boundaries and evaluate the quality of information they encounter.',
      notes: ['Không khái quát “technology is always beneficial”.', 'Dùng điều kiện when/when để phân tích nguyên nhân.', 'Câu hỏi đánh giá được chuyển thành tiêu chí measurable learning gain.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a useful app',
      text: 'A useful app I rely on is a calendar and task manager on my phone. I discovered it when I was preparing for several exams at the same time. I use it to divide a large assignment into smaller deadlines, and I set reminders for review rather than only for the final submission. The most useful feature is the weekly view because it shows whether I have planned unrealistically. It has not made me more disciplined automatically, but it has made my workload visible. As a result, I can start earlier and feel less overwhelmed before an exam.',
      notes: ['Trả lời theo timeline: discovered → use → useful feature → impact.', 'Có ví dụ chức năng cụ thể thay vì chỉ nói app “convenient”.', 'Câu cuối nêu kết quả cá nhân rõ ràng.']
    }
  },
  health: {
    writingTask2: {
      title: 'Đoạn mẫu: cá nhân và chính sách y tế',
      text: 'Individuals should take responsibility for habits within their control, such as sleep, diet and physical activity. Yet this responsibility is shaped by circumstances: a person working two jobs may have less time to cook, and a low-income neighbourhood may offer few safe places to exercise. Public policy can change those conditions through clear food labelling, preventive services and accessible transport or parks. Such measures should not remove personal choice, but they can make healthier choices realistic for more people. Prevention is therefore most effective when personal effort is supported by a healthier environment.',
      notes: ['Phân biệt responsibility với blame.', 'Ví dụ về hoàn cảnh làm lập luận bớt tuyệt đối.', 'Paraphrase “healthy choices” để tránh lặp.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a habit that improved your health',
      text: 'A habit that improved my health was walking for thirty minutes after dinner. I started it during a period when I spent most of the day sitting and often worked late into the evening. At first, the change seemed too small to matter, but walking helped me clear my head and sleep more consistently. I also noticed that I was less likely to snack while working. The habit was effective because it was simple and attached to something I already did, rather than depending on a sudden burst of motivation. I still miss a day occasionally, but I return to it without feeling that I have failed.',
      notes: ['Dùng contrast at first/but để kể sự thay đổi.', 'Giải thích vì sao habit sustainable, không chỉ mô tả habit.', 'Kết thúc tự nhiên bằng một limitation và cách xử lý.']
    }
  },
  work: {
    writingTask2: {
      title: 'Đoạn mẫu: năng suất và phúc lợi',
      text: 'Flexible working can improve productivity when employees are judged by clear outcomes rather than by the number of hours they appear online. Workers may avoid long commutes and arrange demanding tasks around periods of concentration. The arrangement is not automatically successful, though. New employees can miss informal guidance, and unclear expectations may encourage people to remain available late into the evening. Employers should combine flexibility with written objectives, regular mentoring and protected communication-free periods. This model recognises that efficiency and wellbeing are related rather than competing goals.',
      notes: ['So sánh lợi ích và điều kiện thành công trong cùng một đoạn.', 'Dùng rather than để tạo câu học thuật tự nhiên.', 'Giải pháp gắn trực tiếp với vấn đề đã nêu.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a job you would like to do',
      text: 'A job I would like to do in the future is user-experience research. It involves talking to people, observing how they use a service and helping designers make it easier to understand. I became interested in it after noticing that a technically impressive app could still be frustrating if its instructions were unclear. The job appeals to me because it combines communication, analysis and practical problem-solving. I would probably need further training in research methods, but I like the idea of producing changes that make everyday tasks less difficult for a wide range of users.',
      notes: ['Định nghĩa nghề bằng nhiệm vụ cụ thể.', 'Lý do chọn nghề được nối với một trải nghiệm, không phải câu chung chung.', 'Dùng would/probably để thể hiện dự định chưa chắc chắn.']
    }
  },
  cities: {
    writingTask2: {
      title: 'Đoạn mẫu: giao thông và chất lượng sống',
      text: 'Investment in public transport can improve a city in ways that extend beyond shorter journeys. Reliable buses and trains allow people without cars to reach education and employment, while fewer private vehicles can reduce congestion and local pollution. Nevertheless, building a network is not enough if services are infrequent, unsafe or inaccessible to people with disabilities. Authorities should therefore measure reliability and door-to-door access, not merely the number of kilometres of track constructed. A transport policy succeeds when residents can realistically choose it for everyday trips.',
      notes: ['Phát triển từ lợi ích trực tiếp sang social access.', 'Dùng not merely... but implicit contrast để nêu tiêu chí đo lường.', 'Kết luận trả lời rõ khi nào policy thành công.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a public place',
      text: 'A public place I find particularly useful is the small library near my apartment. It is not a famous building, but it provides a quiet study room, reliable internet and free workshops for local residents. I usually go there when I need to concentrate or when my home is too noisy. What I value most is that the place serves different age groups: children attend reading sessions while adults use the computers or borrow materials. It has become useful not simply because of its books, but because it gives people a shared space to learn without having to pay.',
      notes: ['Dùng not famous... but để tạo contrast tự nhiên.', 'Mô tả nơi chốn bằng 3 chức năng và 1 ví dụ người dùng.', 'Câu cuối nâng câu trả lời từ cá nhân lên ý nghĩa cộng đồng.']
    }
  },
  culture: {
    writingTask2: {
      title: 'Đoạn mẫu: bảo tồn truyền thống có chọn lọc',
      text: 'Cultural traditions deserve support when they help communities maintain a sense of belonging and pass on meaningful skills. Public funding can keep festivals, crafts and local archives accessible to people who could not otherwise afford them. Preservation should not mean freezing culture in its old form, however. Younger participants may adapt a performance, language or ceremony to contemporary life, and this adaptation can keep it relevant. Governments should fund participation and education rather than dictate a single “authentic” version. A living tradition is one that people continue to use, question and reshape.',
      notes: ['Tránh định nghĩa culture chỉ là quá khứ.', 'Có nhượng bộ “should not mean” để lập luận hai chiều.', 'Kết câu bằng định nghĩa mở rộng, dễ nhớ nhưng không sáo rỗng.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a tradition in your family',
      text: 'A tradition in my family is preparing a large meal together at the beginning of the Lunar New Year. Different relatives take responsibility for different dishes, so the activity is less about cooking perfectly than about spending time together. I first learned it as a child by watching older family members, and now I help younger cousins. The tradition has changed slightly because we use modern kitchen equipment and sometimes adapt the menu, but its purpose is the same. I value it because it turns an important holiday into a shared memory rather than a routine celebration.',
      notes: ['Dùng present simple cho tradition và past simple cho trải nghiệm học từ nhỏ.', 'Giải thích ý nghĩa thay vì chỉ mô tả món ăn.', 'Có sự thay đổi nhưng vẫn giữ bản chất, tạo câu trả lời cân bằng.']
    }
  },
  travel: {
    writingTask2: {
      title: 'Đoạn mẫu: du lịch và cộng đồng địa phương',
      text: 'Tourism can create jobs and expose visitors to local history, but the benefits are not distributed automatically. When large operators import supplies and send profits elsewhere, residents may face crowded streets without receiving a fair share of the income. A better model would support locally owned accommodation, limit visitor numbers at fragile sites and require clear contributions to conservation. These measures might reduce the speed of expansion, yet they could make tourism more resilient by protecting the places and communities on which the industry depends.',
      notes: ['Nêu lợi ích trước rồi chỉ ra điều kiện khiến lợi ích không công bằng.', 'Giải pháp gắn với từng vấn đề: sở hữu địa phương, giới hạn số khách, bảo tồn.', 'Câu cuối đánh giá trade-off thay vì khẳng định tuyệt đối.']
    },
    speakingPart2: {
      title: 'Bản nói mẫu: a memorable journey',
      text: 'A memorable journey I took was an overnight train to a coastal town with two close friends. We chose the train because it was cheaper than flying and allowed us to see the landscape gradually. The journey was not completely comfortable: the cabin was noisy and we arrived tired, but we spent the evening talking and watching the scenery change from city lights to farmland. I remember it because the travel itself became part of the holiday. It also made me realise that a slower option can be worthwhile when the experience matters as much as reaching the destination.',
      notes: ['Dùng because để giải thích lựa chọn, sau đó although để thêm nuance.', 'Mô tả một khoảnh khắc cụ thể thay vì kể toàn bộ lịch trình.', 'Kết luận rút ra nhận xét cá nhân, phù hợp Part 2.']
    }
  }
}
