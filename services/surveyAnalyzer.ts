/**
 * Survey Analyzer Service
 * Analyzes survey responses and generates course recommendations
 */

import { ref, onValue, child } from 'firebase/database';
import { rtdb } from '../config/firebase';
import { SurveyResponse, CourseRecommendations, Course } from '../types';
import {
  filterCourses,
  mapRigorToDifficulty,
  extractCourseNames,
} from '../utils/courseFilters';
import { isFreshman } from '../utils/validation';

export class SurveyAnalyzer {
  private coursesRef = ref(rtdb, 'courses');

  /**
   * Main analysis function - generates course recommendations from survey data
   */
  async analyze(surveyData: SurveyResponse): Promise<CourseRecommendations> {
    const {
      gradeQuestion: grade,
      classLevelQuestion: rigor,
      creditQuestion: credits,
      stemInterestQuestion: stemInterest,
      freshMathCheck,
    } = surveyData;

    // Initialize empty recommendation arrays
    const recommendations: CourseRecommendations = {
      easyMathClasses: [],
      mediumMathClasses: [],
      hardMathClasses: [],
      easyScienceClasses: [],
      mediumScienceClasses: [],
      hardScienceClasses: [],
      easySTEMClasses: [],
      mediumSTEMClasses: [],
      hardSTEMClasses: [],
      peClasses: [],
      healthClasses: [],
    };

    // Determine which STEM field the user is interested in
    const choseEngineering = stemInterest === 'engineer';
    const choseTechnology = stemInterest === 'technology';

    // Add credit recommendations
    recommendations.peClasses = this.getCreditRecommendations(credits, 'pe');
    recommendations.healthClasses = this.getCreditRecommendations(credits, 'health');

    // Special case for freshman Chemistry
    if (isFreshman(grade)) {
      recommendations.easyScienceClasses.push('Introduction to Chemistry');
      recommendations.mediumScienceClasses.push('Introduction to Chemistry');
      recommendations.hardScienceClasses.push('Introduction to Chemistry');
    }

    // Fetch and process courses from Firebase
    return new Promise((resolve, reject) => {
      const sections = ['science', 'math', 'la', 'social', 'engineer', 'technology'];

      onValue(
        this.coursesRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            reject(new Error('No course data available'));
            return;
          }

          sections.forEach((section) => {
            const sectionRef = child(this.coursesRef, section);

            onValue(sectionRef, (sectionSnapshot) => {
              sectionSnapshot.forEach((courseSnapshot) => {
                const courseData = courseSnapshot.val();
                const courseName = courseSnapshot.key || '';
                const courseGrades = courseData.grade?.split(',').map((g: string) => g.trim()) || [];
                const courseRigor = courseData.rigor;

                // Check if course is available for the user's grade
                if (!courseGrades.includes(grade)) {
                  return;
                }

                // Process based on section
                if (section === 'science') {
                  this.addScienceCourse(recommendations, courseName, courseRigor);
                } else if (section === 'math') {
                  this.addMathCourse(
                    recommendations,
                    courseName,
                    courseRigor,
                    grade,
                    freshMathCheck
                  );
                } else if (section === 'la') {
                  this.addLACourse(recommendations, courseName, courseRigor);
                } else if (section === 'social') {
                  this.addSocialCourse(recommendations, courseName, courseRigor);
                } else if (section === 'engineer' && choseEngineering) {
                  this.addSTEMCourse(recommendations, courseName, courseRigor, rigor);
                } else if (section === 'technology' && choseTechnology) {
                  this.addSTEMCourse(recommendations, courseName, courseRigor, rigor);
                }
              });
            });
          });

          // Return recommendations after processing
          setTimeout(() => resolve(recommendations), 100);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Add science course to appropriate difficulty array
   */
  private addScienceCourse(
    recommendations: CourseRecommendations,
    courseName: string,
    rigor: string
  ): void {
    if (rigor === 'easy') {
      recommendations.easyScienceClasses.push(courseName);
    } else if (rigor === 'intermediate') {
      recommendations.hardScienceClasses.push(courseName);
    } else if (rigor === 'recommended') {
      recommendations.mediumScienceClasses.push(courseName);
    }
  }

  /**
   * Add math course to appropriate difficulty array
   * Special handling for freshmen based on their current math level
   */
  private addMathCourse(
    recommendations: CourseRecommendations,
    courseName: string,
    rigor: string,
    grade: string,
    freshMathCheck?: string
  ): void {
    if (rigor === 'easy') {
      if (isFreshman(grade) && freshMathCheck) {
        // Special freshman math progression
        switch (freshMathCheck) {
          case 'genMath':
            recommendations.easyMathClasses.push('Algebra 1');
            recommendations.mediumMathClasses.push('Algebra 1');
            recommendations.hardMathClasses.push('Algebra 1');
            break;
          case 'geometry':
            recommendations.easyMathClasses.push('Algebra 2');
            recommendations.mediumMathClasses.push('Algebra 2 Honors');
            recommendations.hardMathClasses.push('Algebra 2 Honors');
            break;
          case 'algebra':
            recommendations.easyMathClasses.push('Geometry');
            recommendations.mediumMathClasses.push('Geometry Honors');
            recommendations.hardMathClasses.push('Geometry Honors');
            break;
        }
      } else {
        recommendations.easyMathClasses.push(courseName);
      }
    } else if (rigor === 'intermediate') {
      recommendations.hardMathClasses.push(courseName);
    } else if (rigor === 'recommended') {
      recommendations.mediumMathClasses.push(courseName);
    }
  }

  /**
   * Add Language Arts course
   */
  private addLACourse(
    recommendations: CourseRecommendations,
    courseName: string,
    rigor: string
  ): void {
    // LA courses are stored in STEM arrays for now (based on existing code)
    if (rigor === 'easy') {
      recommendations.easySTEMClasses.push(courseName);
    } else if (rigor === 'intermediate') {
      recommendations.hardSTEMClasses.push(courseName);
    } else if (rigor === 'recommended') {
      recommendations.mediumSTEMClasses.push(courseName);
    }
  }

  /**
   * Add Social Studies course
   */
  private addSocialCourse(
    recommendations: CourseRecommendations,
    courseName: string,
    rigor: string
  ): void {
    // Social courses are stored in STEM arrays for now (based on existing code)
    if (rigor === 'easy') {
      recommendations.easySTEMClasses.push(courseName);
    } else if (rigor === 'intermediate') {
      recommendations.hardSTEMClasses.push(courseName);
    } else if (rigor === 'recommended') {
      recommendations.mediumSTEMClasses.push(courseName);
    }
  }

  /**
   * Add STEM course based on user's rigor preference
   */
  private addSTEMCourse(
    recommendations: CourseRecommendations,
    courseName: string,
    courseRigor: string,
    userRigor: string
  ): void {
    // Match user's rigor preference with course rigor
    if (userRigor === 'easy' && courseRigor === 'easy') {
      recommendations.easySTEMClasses.push(courseName);
    } else if (userRigor === 'medium' && courseRigor === 'intermediate') {
      recommendations.mediumSTEMClasses.push(courseName);
    } else if (userRigor === 'hard' && courseRigor === 'recommended') {
      recommendations.hardSTEMClasses.push(courseName);
    }
  }

  /**
   * Get PE/Health credit recommendations
   */
  private getCreditRecommendations(creditStatus: string, type: 'pe' | 'health'): string[] {
    const recommendations: string[] = [];

    if (creditStatus === 'none') {
      recommendations.push(type === 'pe' ? 'PE' : 'Health');
    } else if (creditStatus === 'pe' && type === 'health') {
      recommendations.push('Health');
    } else if (creditStatus === 'health' && type === 'pe') {
      recommendations.push('PE');
    }

    return recommendations;
  }
}

// Export singleton instance
export const surveyAnalyzer = new SurveyAnalyzer();
