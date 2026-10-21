export type IELTSFourSkill = 'Reading' | 'Listening' | 'Writing' | 'Speaking'

export type SkillCurriculumMeta = {
  labelVi: string
  format: string
  duration: string
  scoring: string[]
  qualityNote: string
}

/** Shared exam facts and assessment language used by all four skill workspaces. */
export const IELTS_SKILL_CURRICULUM: Record<IELTSFourSkill, SkillCurriculumMeta> = {
  Reading: {
    labelVi: 'Đọc hiểu học thuật',
    format: '3 passages · 40 câu · 60 phút',
    duration: '60 phút',
    scoring: ['Đúng thông tin', 'Paraphrase', 'Suy luận có bằng chứng', 'Kiểm soát thời gian'],
    qualityNote: 'Câu trả lời chỉ được tính khi có câu hoặc ý trong passage hỗ trợ; không chọn theo cảm giác.'
  },
  Listening: {
    labelVi: 'Nghe hiểu',
    format: '4 sections · 40 câu · khoảng 30 phút',
    duration: '30 phút',
    scoring: ['Dự đoán dạng đáp án', 'Theo tín hiệu chuyển ý', 'Chính tả & số liệu', 'Phục hồi khi lỡ câu'],
    qualityNote: 'Nghe lần đầu như thi thật; transcript chỉ dùng sau khi trả lời để tìm nguyên nhân sai.'
  },
  Writing: {
    labelVi: 'Viết học thuật',
    format: 'Task 1 + Task 2 · 60 phút',
    duration: '60 phút',
    scoring: ['Task response/achievement', 'Coherence & cohesion', 'Lexical resource', 'Grammar range & accuracy'],
    qualityNote: 'Ý rõ và phát triển đúng đề quan trọng hơn việc nhồi từ vựng khó hoặc cấu trúc lạ.'
  },
  Speaking: {
    labelVi: 'Phỏng vấn nói',
    format: 'Part 1 + Part 2 + Part 3 · 11–14 phút',
    duration: '11–14 phút',
    scoring: ['Fluency & coherence', 'Lexical resource', 'Grammar', 'Pronunciation'],
    qualityNote: 'Câu trả lời cần tự nhiên, có phát triển ý và ví dụ; không học thuộc một bài mẫu cho mọi câu hỏi.'
  }
}
