export type FourSkill = 'Reading' | 'Listening' | 'Writing' | 'Speaking'

export type LearningGuide = {
  skill: FourSkill
  promise: string
  examReality: string
  stages: { title: string; minutes: string; action: string; evidence: string }[]
  selfCheck: string[]
  nextStep: string
}

/** Practical, repeatable routines that turn a question set into a learning session. */
export const SKILL_LEARNING_GUIDES: Record<FourSkill, LearningGuide> = {
  Reading: {
    skill: 'Reading',
    promise: 'Mỗi bài đọc phải tạo ra một kỹ năng có thể đo được, không chỉ là một điểm số.',
    examReality: 'IELTS Reading kiểm tra khả năng tìm và kiểm chứng thông tin dưới áp lực thời gian; không cần hiểu từng từ.',
    stages: [
      { title: '1. Dự đoán', minutes: '2 phút', action: 'Đọc tiêu đề, câu hỏi và gạch chân từ khóa. Dự đoán paraphrase có thể xuất hiện trong bài.', evidence: 'Bạn có danh sách từ khóa và dạng thông tin cần tìm.' },
      { title: '2. Đọc có mục tiêu', minutes: '8–12 phút', action: 'Skim đoạn đầu/cuối, sau đó scan theo từ khóa. Chỉ chọn đáp án khi tìm được câu bằng chứng.', evidence: 'Mỗi câu sai hoặc đúng đều chỉ ra được đoạn hỗ trợ.' },
      { title: '3. Mổ xẻ lỗi', minutes: '5 phút', action: 'Phân loại lỗi: không tìm thấy, hiểu sai paraphrase, suy luận quá mức hay vội vàng.', evidence: 'Viết một quy tắc tránh lỗi cho lần làm tiếp theo.' }
    ],
    selfCheck: ['Tôi có phân biệt False và Not Given bằng bằng chứng rõ ràng không?', 'Tôi có đọc lại câu chứa đáp án thay vì đoán theo cảm giác không?', 'Tôi có ghi lại ít nhất 3 paraphrase mới không?'],
    nextStep: 'Nếu dưới 70%, làm lại cùng dạng câu hỏi ở một passage khác; nếu từ 70% trở lên, giảm thời gian 2 phút ở lần tiếp theo.'
  },
  Listening: {
    skill: 'Listening',
    promise: 'Bạn sẽ biết mình không nghe được vì tốc độ, từ vựng, nối âm hay mất tập trung.',
    examReality: 'Trong phòng thi, audio chỉ phát một lần; kỹ năng cốt lõi là dự đoán, ghi nhận tín hiệu và phục hồi sau khi bỏ lỡ một chi tiết.',
    stages: [
      { title: '1. Dự đoán trước khi nghe', minutes: '1 phút', action: 'Đọc câu hỏi, đoán loại đáp án (số, tên, địa điểm, động từ) và gạch chân từ báo hiệu.', evidence: 'Bạn viết được loại từ/định dạng đáp án trước khi bấm Play.' },
      { title: '2. Nghe lần 1', minutes: '3–5 phút', action: 'Nghe như thi thật, không dừng. Ghi từ khóa ngắn; nếu lỡ một câu, bỏ qua và theo kịp câu sau.', evidence: 'Bạn hoàn thành bài mà không phụ thuộc transcript.' },
      { title: '3. Nghe chẩn đoán', minutes: '5 phút', action: 'Mở transcript sau khi nộp, đánh dấu câu nghe sai, rồi nghe lại đúng 1–2 câu quanh bằng chứng.', evidence: 'Bạn ghi rõ lỗi là từ mới, nối âm, distractor hay mất tập trung.' }
    ],
    selfCheck: ['Tôi có đọc trước câu hỏi và đoán loại đáp án không?', 'Tôi có nhận ra từ chuyển ý như however, actually, finally không?', 'Tôi có nghe lại bằng chứng thay vì chỉ xem đáp án không?'],
    nextStep: 'Nếu đúng dưới 60%, nghe lại ở tốc độ 0.9x với transcript; nếu đạt 80%+, nghe ở tốc độ 1.15x và che transcript.'
  },
  Writing: {
    skill: 'Writing',
    promise: 'Mỗi bài viết kết thúc bằng một vòng sửa có tiêu chí, thay vì chỉ lưu một bản nháp.',
    examReality: 'IELTS Writing chấm Task Response/Achievement, Coherence, Lexical Resource và Grammar; từ vựng khó không cứu được bài thiếu trả lời đề.',
    stages: [
      { title: '1. Lập kế hoạch', minutes: '5 phút', action: 'Khoanh từ khóa đề, xác định dạng bài, viết thesis/overview và 2 ý chính có giải thích.', evidence: 'Dàn ý trả lời trực tiếp từng phần của đề, không có ý lạc đề.' },
      { title: '2. Viết có cấu trúc', minutes: '25–30 phút', action: 'Mỗi body paragraph dùng PEEL: Point → Explain → Example → Link. Ưu tiên câu rõ và so sánh chính xác.', evidence: 'Mỗi đoạn có câu chủ đề, phát triển ý và ví dụ/chi tiết.' },
      { title: '3. Sửa theo 4 tiêu chí', minutes: '5 phút', action: 'Kiểm tra số từ, liên kết, collocation, subject–verb agreement, articles và lỗi lặp từ.', evidence: 'Bạn sửa được ít nhất 3 lỗi cụ thể và ghi lý do sửa.' }
    ],
    selfCheck: ['Bài có trả lời đủ mọi phần của đề không?', 'Task 1 có overview và so sánh nổi bật, không giải thích nguyên nhân không?', 'Task 2 có thesis rõ, đoạn văn phát triển và kết luận nhất quán không?'],
    nextStep: 'Lưu bản đầu, sửa một vòng, rồi viết lại introduction hoặc body paragraph yếu nhất mà không nhìn bản cũ.'
  },
  Speaking: {
    skill: 'Speaking',
    promise: 'Bạn sẽ luyện được câu trả lời tự nhiên, có phát triển ý và có bản ghi để tự nghe lại.',
    examReality: 'Giám khảo đánh giá Fluency, Lexical Resource, Grammar và Pronunciation; nói dài không đồng nghĩa với nói tốt nếu ý bị lặp hoặc ngập ngừng.',
    stages: [
      { title: '1. Tạo ý nhanh', minutes: '1 phút', action: 'Part 1 dùng Answer + Reason + Example. Part 2 ghi 4 từ khóa theo cue card. Part 3 nêu quan điểm và đối chiếu.', evidence: 'Bạn có thể bắt đầu câu trả lời trong 3 giây, không viết cả bài.' },
      { title: '2. Nói đủ thời lượng', minutes: '2–4 phút', action: 'Ghi âm một lần liên tục. Dùng cụm nối tự nhiên, tự sửa nhẹ nhưng không dừng lại để dịch từng câu.', evidence: 'Part 2 nói gần 2 phút; Part 3 phát triển được 4–6 câu mỗi ý.' },
      { title: '3. Nghe và sửa', minutes: '3 phút', action: 'Nghe lại, đánh dấu một lỗi phát âm, một lỗi ngữ pháp và một chỗ lặp từ; ghi âm lại đoạn 30 giây.', evidence: 'Có bản ghi lần 2 và một mục tiêu nhỏ cho lần nói sau.' }
    ],
    selfCheck: ['Tôi có trả lời trực tiếp rồi mới giải thích không?', 'Tôi có dùng ví dụ cá nhân hoặc cụ thể thay vì câu chung chung không?', 'Tôi có nghe lại phát âm đuôi -s/-ed, trọng âm và từ lặp không?'],
    nextStep: 'Giữ lại bản ghi đầu và bản ghi sửa; so sánh độ trôi chảy, số lần ngập ngừng và độ đa dạng từ vựng.'
  }
}
