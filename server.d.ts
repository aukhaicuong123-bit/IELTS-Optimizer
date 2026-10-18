export interface AICoachRequest {
    taskTitle: string;
    taskPrompt: string;
    taskType: 'academic_task1' | 'general_task1' | 'task2' | 'speaking' | 'reading' | 'listening';
    studentSubmission: string;
    mode: 'evaluate' | 'approach' | 'hint';
}
