/**
 * Course Service - Handles all Firebase Realtime Database operations for courses
 */

import { ref, onValue, child, get } from 'firebase/database';
import { rtdb } from '../config/firebase';
import { Course } from '../types';

export class CourseService {
  private coursesRef = ref(rtdb, 'courses');

  /**
   * Fetch all courses from Firebase Realtime Database
   * @returns Promise with all courses organized by section
   */
  async fetchAllCourses(): Promise<Record<string, Course[]>> {
    return new Promise((resolve, reject) => {
      const courses: Record<string, Course[]> = {
        science: [],
        math: [],
        la: [],
        social: [],
        engineer: [],
        technology: [],
      };

      onValue(
        this.coursesRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            reject(new Error('No course data available'));
            return;
          }

          const sections = ['science', 'math', 'la', 'social', 'engineer', 'technology'];
          
          sections.forEach((section) => {
            const sectionRef = child(this.coursesRef, section);
            
            onValue(sectionRef, (sectionSnapshot) => {
              sectionSnapshot.forEach((courseSnapshot) => {
                const courseData = courseSnapshot.val();
                const courseName = courseSnapshot.key;

                if (courseName) {
                  courses[section].push({
                    courseName,
                    grade: courseData.grade || '',
                    difficulty: courseData.rigor || 'easy',
                    category: section as any,
                    credits: courseData.credits,
                    prerequisites: courseData.prerequisites || [],
                  });
                }
              });
            });
          });

          resolve(courses);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Fetch courses for a specific grade level
   */
  async fetchCoursesByGrade(grade: string): Promise<Record<string, Course[]>> {
    const allCourses = await this.fetchAllCourses();
    const filtered: Record<string, Course[]> = {};

    Object.keys(allCourses).forEach((section) => {
      filtered[section] = allCourses[section].filter((course) => {
        const grades = course.grade?.split(',').map(g => g.trim()) || [];
        return grades.includes(grade);
      });
    });

    return filtered;
  }

  /**
   * Fetch courses by section (science, math, etc.)
   */
  async fetchCoursesBySection(section: string): Promise<Course[]> {
    return new Promise((resolve, reject) => {
      const sectionRef = child(this.coursesRef, section);

      onValue(
        sectionRef,
        (snapshot) => {
          const courses: Course[] = [];

          snapshot.forEach((courseSnapshot) => {
            const courseData = courseSnapshot.val();
            const courseName = courseSnapshot.key;

            if (courseName) {
              courses.push({
                courseName,
                grade: courseData.grade || '',
                difficulty: courseData.rigor || 'easy',
                category: section as any,
                credits: courseData.credits,
                prerequisites: courseData.prerequisites || [],
              });
            }
          });

          resolve(courses);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

// Export singleton instance
export const courseService = new CourseService();
