import { apiRequest } from '../http';
import { MOCK_ACTIVE_QUIZ } from '../../mocks/mockData';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export async function createQuiz(courseId, data) {
  if (useMocks) {
    return {
      quizId: Date.now(),
      courseId: Number(courseId),
      title: data.title,
      timeLimit: data.timeLimit,
      maxMarks: data.maxMarks,
      questions: data.questions || [],
    };
  }
  return apiRequest(`/courses/${courseId}/quizzes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listCourseQuizzes(courseId) {
  if (useMocks) {
    return [
      {
        quizId: 201,
        courseId: Number(courseId),
        title: MOCK_ACTIVE_QUIZ.title,
        timeLimit: MOCK_ACTIVE_QUIZ.timeLimitMinutes,
        maxMarks: 20,
        questionCount: MOCK_ACTIVE_QUIZ.totalQuestions,
        hasAttempted: false,
        score: null,
      },
    ];
  }
  return apiRequest(`/courses/${courseId}/quizzes`);
}

export async function getQuiz(quizId) {
  if (useMocks) {
    return {
      quizId: Number(quizId),
      courseId: 1,
      title: MOCK_ACTIVE_QUIZ.title,
      timeLimit: MOCK_ACTIVE_QUIZ.timeLimitMinutes,
      maxMarks: 20,
      questions: MOCK_ACTIVE_QUIZ.questions.map((q) => ({
        questionId: Number(q.id.replace(/\D/g, '')) || 1,
        questionText: q.text,
        marks: 2,
        options: q.options.map((opt) => ({
          optionId: Number(opt.id.replace(/\D/g, '')) || 1,
          optionText: opt.text,
          isCorrect: false, // Student view doesn't leak correct options
        })),
      })),
    };
  }
  return apiRequest(`/quizzes/${quizId}`);
}

export async function deleteQuiz(quizId) {
  if (useMocks) {
    return null;
  }
  return apiRequest(`/quizzes/${quizId}`, {
    method: 'DELETE',
  });
}

export async function startQuizAttempt(quizId) {
  if (useMocks) {
    return {
      attemptId: Date.now(),
      quizId: Number(quizId),
      studentId: 1,
      startedAt: new Date().toISOString(),
      submittedAt: null,
      score: null,
      status: 'IN_PROGRESS',
    };
  }
  return apiRequest(`/quizzes/${quizId}/attempts/start`, {
    method: 'POST',
  });
}

export async function submitQuizAttempt(quizId, data) {
  if (useMocks) {
    return {
      attemptId: Date.now(),
      quizId: Number(quizId),
      studentId: 1,
      startedAt: new Date(Date.now() - 600000).toISOString(),
      submittedAt: new Date().toISOString(),
      score: 18,
      status: 'SUBMITTED',
    };
  }
  return apiRequest(`/quizzes/${quizId}/attempts/submit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyQuizAttempt(quizId) {
  if (useMocks) {
    return {
      attemptId: 301,
      quizId: Number(quizId),
      studentId: 1,
      startedAt: '2026-10-18T10:00:00',
      submittedAt: '2026-10-18T10:22:00',
      score: 18,
      status: 'SUBMITTED',
    };
  }
  return apiRequest(`/quizzes/${quizId}/attempts/me`);
}

export async function listQuizAttempts(quizId) {
  if (useMocks) {
    return [
      {
        attemptId: 301,
        quizId: Number(quizId),
        studentId: 1,
        studentName: 'Rahul Sharma',
        startedAt: '2026-10-18T10:00:00',
        submittedAt: '2026-10-18T10:22:00',
        score: 18,
        status: 'SUBMITTED',
      },
    ];
  }
  return apiRequest(`/quizzes/${quizId}/attempts`);
}
