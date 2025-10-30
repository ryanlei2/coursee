/**
 * Survey History - Deprecated
 * This file has been replaced by services/surveyHistoryService.ts
 * 
 * For survey history functionality, use:
 * - services/surveyHistoryService.ts - Service layer for data operations
 * - components/SurveyHistory.tsx - UI component for displaying history
 */

export { 
  saveSurveySubmission, 
  getUserSurveyHistory, 
  getSurveySubmission,
  getLatestSurveySubmission 
} from '../services/surveyHistoryService';
