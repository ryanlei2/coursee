/**
 * Type definitions for survey responses and course recommendations
 */

// Survey response data structure
export interface SurveyResponse {
  gradeQuestion: '9' | '10' | '11' | '12';
  classLevelQuestion: 'hard' | 'medium' | 'easy';
  creditQuestion: 'both' | 'pe' | 'health' | 'none';
  stemInterestQuestion: 'science' | 'technology' | 'engineer' | 'math';
  freshMathCheck?: 'genMath' | 'geometry' | 'algebra';
  sophMathCheck?: string;
  junMathCheck?: string;
  senMathCheck?: string;
}

// Course data structure from Firebase
export interface Course {
  courseName: string;
  grade: string;
  difficulty: 'easy' | 'intermediate' | 'recommended' | 'medium' | 'hard';
  category: 'math' | 'science' | 'la' | 'social' | 'engineer' | 'technology' | 'stem' | 'pe' | 'health';
  credits?: number;
  prerequisites?: string[];
}

// Course recommendations generated from survey
export interface CourseRecommendations {
  easyMathClasses: string[];
  mediumMathClasses: string[];
  hardMathClasses: string[];
  easyScienceClasses: string[];
  mediumScienceClasses: string[];
  hardScienceClasses: string[];
  easySTEMClasses: string[];
  mediumSTEMClasses: string[];
  hardSTEMClasses: string[];
  peClasses: string[];
  healthClasses: string[];
}

// User authentication data
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

// User feedback data structure
export interface UserFeedback {
  userUID: string;
  feedback: 'agree' | 'disagree';
  textFeedback?: string;
  recommendations: CourseRecommendations;
  timestamp: Date;
}

// Survey submission history
export interface SurveySubmission {
  id: string;
  userId: string;
  timestamp: Date;
  surveyData: SurveyResponse;
  recommendations: CourseRecommendations;
  label?: string;
}

// Student info for PDF generation
export interface StudentInfo {
  uid: string;
  email?: string;
  name?: string;
  grade?: string;
}

// Router query for results page
export interface ResultsQuery {
  data?: string;
}
