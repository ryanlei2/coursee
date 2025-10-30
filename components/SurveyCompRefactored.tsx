/**
 * Survey Component - Refactored Version
 * Handles course recommendation survey using clean, maintainable architecture
 */

import React, { useEffect, useState } from 'react';
import { StylesManager, Survey } from 'survey-react';
import 'survey-core/defaultV2.min.css';
import { useRouter } from 'next/router';
import { saveSurveyData } from '../config/firebase';
import { surveyAnalyzer } from '../services/surveyAnalyzer';
import { validateSurveyData } from '../utils/validation';
import { SurveyResponse, CourseRecommendations } from '../types';
import { surveyJSON } from './SurveyJSON';

const SurveyCompRefactored = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Apply survey theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      StylesManager.applyTheme('defaultV2');
    }
  }, []);

  /**
   * Handle survey completion
   */
  const handleSurveyComplete = async (survey: { data: Record<string, any> }) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Transform survey data into typed structure
      const surveyData = transformSurveyData(survey.data);

      // Validate survey data
      if (!validateSurveyData(surveyData)) {
        throw new Error('Invalid survey data. Please complete all required fields.');
      }

      // Convert to array format for Firebase storage
      const dataArray = Object.entries(survey.data).map(([key, value]) => ({
        question: key,
        answer: value,
      }));

      // Save survey data to Firestore
      await saveSurveyData(dataArray);

      // Analyze survey and generate recommendations
      const recommendations = await surveyAnalyzer.analyze(surveyData);

      // Handle empty recommendations (fallback logic)
      const finalRecommendations = handleEmptyRecommendations(recommendations);

      // Navigate to results page with recommendations
      setTimeout(() => {
        router.push({
          pathname: '/results',
          query: {
            data: JSON.stringify({
              easyMathClasses: finalRecommendations.easyMathClasses,
              easyScienceClasses: finalRecommendations.easyScienceClasses,
              easyLAClasses: finalRecommendations.easySTEMClasses, // LA stored in STEM
              easySocialClasses: finalRecommendations.easySTEMClasses,
              
              recommendedMathClasses: finalRecommendations.mediumMathClasses,
              recommendedScienceClasses: finalRecommendations.mediumScienceClasses,
              recommendedLAClasses: finalRecommendations.mediumSTEMClasses,
              recommendedSocialClasses: finalRecommendations.mediumSTEMClasses,
              
              hardMathClasses: finalRecommendations.hardMathClasses,
              hardScienceClasses: finalRecommendations.hardScienceClasses,
              hardLAClasses: finalRecommendations.hardSTEMClasses,
              hardSocialClasses: finalRecommendations.hardSTEMClasses,
              
              recommendedClassesConsider: [
                ...finalRecommendations.peClasses,
                ...finalRecommendations.healthClasses,
              ],
              stemChoicesBasedOnRigor: finalRecommendations.mediumSTEMClasses,
            }),
          },
        });
      }, 2000); // Give time for Firebase operations to complete
    } catch (err) {
      console.error('Survey analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze survey');
      setIsAnalyzing(false);
    }
  };

  /**
   * Transform raw survey data into typed SurveyResponse
   */
  const transformSurveyData = (data: Record<string, any>): SurveyResponse => {
    return {
      gradeQuestion: data.gradeQuestion,
      classLevelQuestion: data.classLevelQuestion,
      creditQuestion: data.creditQuestion,
      stemInterestQuestion: data.stemInterestQuestion,
      freshMathCheck: data.freshMathCheck,
      sophMathCheck: data.sophMathCheck,
      junMathCheck: data.junMathCheck,
      senMathCheck: data.senMathCheck,
    };
  };

  /**
   * Handle empty recommendation arrays by filling with fallback data
   * If recommended classes are empty, use hard classes as fallback
   */
  const handleEmptyRecommendations = (
    recommendations: CourseRecommendations
  ): CourseRecommendations => {
    const updated = { ...recommendations };

    // Math fallback
    if (updated.mediumMathClasses.length === 0 && updated.hardMathClasses.length > 0) {
      updated.mediumMathClasses.push(...updated.hardMathClasses);
    }

    // Science fallback
    if (updated.mediumScienceClasses.length === 0 && updated.hardScienceClasses.length > 0) {
      updated.mediumScienceClasses.push(...updated.hardScienceClasses);
    }

    // STEM fallback
    if (updated.mediumSTEMClasses.length === 0 && updated.hardSTEMClasses.length > 0) {
      updated.mediumSTEMClasses.push(...updated.hardSTEMClasses);
    }

    return updated;
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {isAnalyzing ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h3>Analyzing your responses...</h3>
          <p>Generating your personalized course recommendations</p>
          <div style={{ margin: '20px auto', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <Survey json={surveyJSON} onComplete={handleSurveyComplete} />
      )}
    </div>
  );
};

export default SurveyCompRefactored;
