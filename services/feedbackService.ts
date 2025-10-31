/**
 * Feedback Service
 * Manages feedback data retrieval and analytics
 */

import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserFeedback } from '../types';

const FEEDBACK_COLLECTION = 'userFeedback';

/**
 * Get all feedback submissions
 */
export async function getAllFeedback(): Promise<UserFeedback[]> {
  try {
    const feedbackRef = collection(db, FEEDBACK_COLLECTION);
    const q = query(feedbackRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userUID: data.userUID,
        feedback: data.feedback,
        textFeedback: data.textFeedback,
        recommendations: data.recommendations,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate() 
          : new Date(data.timestamp || Date.now()),
      } as UserFeedback;
    });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
}

/**
 * Get feedback by user ID
 */
export async function getFeedbackByUser(userId: string): Promise<UserFeedback[]> {
  try {
    const feedbackRef = collection(db, FEEDBACK_COLLECTION);
    const q = query(
      feedbackRef,
      where('userUID', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userUID: data.userUID,
        feedback: data.feedback,
        textFeedback: data.textFeedback,
        recommendations: data.recommendations,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate() 
          : new Date(data.timestamp || Date.now()),
      } as UserFeedback;
    });
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    throw new Error('Failed to fetch user feedback');
  }
}

/**
 * Get feedback statistics
 */
export interface FeedbackStats {
  totalFeedback: number;
  agreeCount: number;
  disagreeCount: number;
  agreePercentage: number;
  disagreePercentage: number;
  withTextFeedback: number;
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
  try {
    const allFeedback = await getAllFeedback();
    const agreeCount = allFeedback.filter(f => f.feedback === 'agree').length;
    const disagreeCount = allFeedback.filter(f => f.feedback === 'disagree').length;
    const total = allFeedback.length;
    
    return {
      totalFeedback: total,
      agreeCount,
      disagreeCount,
      agreePercentage: total > 0 ? Math.round((agreeCount / total) * 100) : 0,
      disagreePercentage: total > 0 ? Math.round((disagreeCount / total) * 100) : 0,
      withTextFeedback: allFeedback.filter(f => f.textFeedback && f.textFeedback.trim().length > 0).length,
    };
  } catch (error) {
    console.error('Error calculating feedback stats:', error);
    throw new Error('Failed to calculate feedback statistics');
  }
}

/**
 * Export feedback to CSV format
 */
export function exportFeedbackToCSV(feedback: UserFeedback[]): string {
  const headers = ['User ID', 'Feedback', 'Text Feedback', 'Timestamp'];
  const rows = feedback.map(f => [
    f.userUID,
    f.feedback,
    f.textFeedback || 'N/A',
    f.timestamp.toLocaleString(),
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Download feedback as CSV file
 */
export function downloadFeedbackCSV(feedback: UserFeedback[], filename: string = 'feedback-export.csv'): void {
  const csvContent = exportFeedbackToCSV(feedback);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
