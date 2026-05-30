// Shared enums used across the app

export const PRIORITY = {
  HIGH:   'High',
  MEDIUM: 'Medium',
  LOW:    'Low',
};

export const PRIORITY_LIST = [PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW];

export const STATUS = {
  PENDING:    'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED:  'Completed',
};

export const STATUS_LIST = [STATUS.PENDING, STATUS.IN_PROGRESS, STATUS.COMPLETED];

export const SESSION_TYPE = {
  REVISION:    'Revision',
  PRACTICE:    'Practice',
  NEW_CONTENT: 'New Content',
  EXAM_PREP:   'Exam Prep',
};

export const SESSION_TYPE_LIST = Object.values(SESSION_TYPE);

export const GRADE_POINTS = {
  'A+': 4.0,
  'A':  4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B':  3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C':  2.0,
  'C-': 1.7,
  'D':  1.0,
  'F':  0.0,
};

export const GRADE_LIST = Object.keys(GRADE_POINTS);
