/**
 * Survey History Service
 * Manages saving and retrieving survey submissions from Firestore
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { SurveySubmission, SurveyResponse, CourseRecommendations } from '../types';

const SURVEY_HISTORY_COLLECTION = 'surveyHistory';

/**
 * Save a survey submission to Firestore
 */
export async function saveSurveySubmission(
  userId: string,
  surveyData: SurveyResponse,
  recommendations: CourseRecommendations,
  label?: string
): Promise<string> {
  try {
    const submissionRef = collection(db, SURVEY_HISTORY_COLLECTION);
    
    const docRef = await addDoc(submissionRef, {
      userId,
      surveyData,
      recommendations,
      label: label || `Survey ${new Date().toLocaleDateString()}`,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving survey submission:', error);
    throw new Error('Failed to save survey submission');
  }
}

/**
 * Get all survey submissions for a user
 */
export async function getUserSurveyHistory(userId: string): Promise<SurveySubmission[]> {
  try {
    const submissionsRef = collection(db, SURVEY_HISTORY_COLLECTION);
    const q = query(
      submissionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        surveyData: data.surveyData,
        recommendations: data.recommendations,
        label: data.label,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate() 
          : new Date(data.createdAt || Date.now()),
      } as SurveySubmission;
    });
  } catch (error) {
    console.error('Error fetching survey history:', error);
    throw new Error('Failed to fetch survey history');
  }
}

/**
 * Get a specific survey submission by ID
 */
export async function getSurveySubmission(submissionId: string): Promise<SurveySubmission | null> {
  try {
    const docRef = doc(db, SURVEY_HISTORY_COLLECTION, submissionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      surveyData: data.surveyData,
      recommendations: data.recommendations,
      label: data.label,
      timestamp: data.timestamp instanceof Timestamp 
        ? data.timestamp.toDate() 
        : new Date(data.createdAt || Date.now()),
    } as SurveySubmission;
  } catch (error) {
    console.error('Error fetching survey submission:', error);
    throw new Error('Failed to fetch survey submission');
  }
}

/**
 * Get the most recent survey submission for a user
 */
export async function getLatestSurveySubmission(userId: string): Promise<SurveySubmission | null> {
  try {
    const submissions = await getUserSurveyHistory(userId);
    return submissions.length > 0 ? submissions[0] : null;
  } catch (error) {
    console.error('Error fetching latest submission:', error);
    return null;
  }
}
