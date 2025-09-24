import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { StylesManager, Survey } from 'survey-react';
import "survey-core/defaultV2.min.css"; //newer
import 'firebase/database';
import * as firebase from 'firebase/app';
import { coursesRef, rtdb, userResultsRef, userSelectionRef, saveSurveyData } from '../config/firebase';
import { child, get, onValue, push, ref, set } from 'firebase/database';
import { getDatabase } from "firebase/database";
import { useRouter } from 'next/router'
import { Link } from 'react-router-dom';

//paste in te survey from surveyJS
const surveyJSON = 
{
"title": "Career Survey",
"description": "Give us some general knowledge on the career you want to choose.",
"logoPosition": "right",
"completedHtml": "<h3>Great, thank you for completing the survey! You'll soon see your results.</h3>\n",
"pages": [
  {
  "name": "SchoolQuestions",
  "elements": [
    {
    "type": "radiogroup",
    "name": "gradeQuestion",
    "title": "Which highschool level are you?",
    "isRequired": true,
    "choices": [
      {
      "value": "9",
      "text": "Freshman (9th)"
      },
      {
      "value": "10",
      "text": "Sophomore (10th)"
      },
      {
      "value": "11",
      "text": "Junior (11th)"
      },
      {
      "value": "12",
      "text": "Senior (12th)"
      }
    ]
    },
    {
    "type": "radiogroup",
    "name": "classLevelQuestion",
    "title": "How hard do you want your classes to be?",
    "isRequired": true,
    "choices": [
      {
      "value": "hard",
      "text": "Challenging (AP/Honors)"
      },
      {
      "value": "medium",
      "text": "Intermediate (Honors)"
      },
      {
      "value": "easy",
      "text": "Basic (:P)"
      }
    ]
    },
    {
    "type": "radiogroup",
    "name": "creditQuestion",
    "title": "Have you completed your PE and/or Health Credits (complete these ASAP)",
    "isRequired": true,
    "choices": [
      {
      "value": "both",
      "text": "Yes, both"
      },
      {
      "value": "pe",
      "text": "Only PE"
      },
      {
      "value": "health",
      "text": "Only Health"
      },
      {
      "value": "none",
      "text": "Neither"
      }
    ]
    },
    {
    "type": "radiogroup",
    "name": "stemInterestQuestion",
    "title": "Which subject interests you the most?",
    "isRequired": true,
    "choices": [
      {
      "value": "science",
      "text": "Science"
      },
      {
      "value": "technology",
      "text": "Technology"
      },
      {
      "value": "engineer",
      "text": "Engineering"
      },
      {
      "value": "math",
      "text": "Mathematics"
      }
    ]
    }
  ],
  "title": "School Questions",
  "description": "We need to know your background first."
  },
  {
  "name": "CoreCredits",
  "elements": [
    {
    "type": "radiogroup",
    "name": "freshMathCheck",
    "visibleIf": "{gradeQuestion} = 9",
    "title": "As a freshman, check which math you took previously in middle school.",
    "isRequired": true,
    "choices": [
      {
      "value": "genMath",
      "text": "General Math 3"
      },
      {
      "value": "geometry",
      "text": "Geometry"
      },
      {
      "value": "algebra",
      "text": "Algebra 1"
      }
    ]
    }
  ],
  "title": "Core Credits",
  "description": "We use these questions to determine whether we should assign you a core class or give more room for a career class."
  },
  {
  "name": "page3",
  "elements": [
    {
    "type": "expression",
    "name": "Final Remarks",
    "title": "Final Remarks",
    "description": "That was easy! Now, before we finish the survey, we want to just give you some points of advice before you proceed to your results.\n\nBecause these are so general, we want to give you a good starting point for picking out your own classes. You can tweak what we have shown you, or just stick with the classes if they look good enough for you. The point is, we want you to get bearings set up before you trip over yourself on the perfect classes."
    }
  ],
  "title": "You Did it!"
  }
],
"widthMode": "static"
}

function SurveyComp() {
  const router = useRouter()

  let easyMathClasses: string[] = []
  let easyScienceClasses: string[] = []
  let easySocialClasses: string[] = []
  let easyLAClasses: string[] = []

  let recommendedMathClasses: string[] = []
  let recommendedScienceClasses: string[] = []
  let recommendedSocialClasses: string[] = []
  let recommendedLAClasses: string[] = []

  let hardMathClasses: string[] = []
  let hardScienceClasses: string[] = []
  let hardSocialClasses: string[] = []
  let hardLAClasses: string[] = []

  let recommendedClassesConsider: string[] = []
  let stemChoicesBasedOnRigor: string[] = []

  useEffect(() => {
    if (typeof window !== 'undefined') {
      StylesManager.applyTheme("defaultV2");
    }
  }, []);
  const [results, setResults] = useState(null);


  const handleSurveyComplete = (survey: {
    //checks if survey is complete
    onComplete: any; 
    data: Record<string, any>;
  }) => {
    console.log(survey.data)
    //create array to hold data
    const dataArray = Object.entries(survey.data).map(([key, value]) => ({
      question: key,
      answer: value
    }));
    console.log(dataArray);
    analyzeSurveyData(dataArray)
    saveSurveyData(dataArray); // Save survey data to Firestore

    setTimeout(() => {
      router.push({
        pathname: '/results',
        query: {
          data: JSON.stringify({easyMathClasses,easySocialClasses,easyScienceClasses,easyLAClasses,recommendedMathClasses,recommendedScienceClasses,recommendedSocialClasses,recommendedLAClasses,hardMathClasses,hardScienceClasses,hardSocialClasses,hardLAClasses,recommendedClassesConsider,stemChoicesBasedOnRigor,
          }),
        },
      })
    }, 5000);
    
  };
    
  //look at data and select courses
    function analyzeSurveyData(dataArray: any[]) {

    let rigor: any;
    let grade: any;
    let remainderClasses: any;
    let choseEngineering = false
    let choseTechnology = false
    

    dataArray.forEach((value, index) => {
      console.log(`Answer ${index + 1}:`);
      if (Array.isArray(value.answer)) {
        value.answer.forEach((choice: any, i: number) => {
          //Choice ${i + 1}
          console.log(`: ${choice}`); //get answer as choice if array answer
        });
      } else {
        console.log(`${value.answer}`); //get answer as value.answer if singular value
        //freshmen math
        //move this into the below logic of iteration

        if (index === 1) {
          rigor = value.answer
          console.log('rigor is ' + rigor);
          
        }
        //soph+ math
        if (index === 0) {
          grade = value.answer
        }
        if (index === 3) {
          if (value.answer === 'engineer') {
            choseEngineering = true
            console.log('user chose engineering');
          } else if (value.answer === 'technology') {
            choseTechnology = true
            console.log('user chose technology');
          }
        }
        if (index === 2) {
          remainderClasses = value.answer;
        }
        //grab all courses with that grade and shoot them into the right arrays with their rigor
      }
    });
//ive now added a collection in firestore titled userresults, which shows the grade (grade(s) if taken multiple times thorughout the years) of the user, with the easy, recommended, and hard classes in a document (all attached to same user id
    
const coursesRef = ref(rtdb, 'courses');

onValue(coursesRef, (snapshot) => {
  const sections = ['science', 'math', 'la', 'social', 'engineer', 'technology'];
  if (grade == 9) {
      easyScienceClasses.push("Introduction to Chemistry");
      hardScienceClasses.push("Introduction to Chemistry");
      recommendedScienceClasses.push("Introduction to Chemistry");
  }
  if (remainderClasses === 'none') {
    recommendedClassesConsider.push('pe');
    recommendedClassesConsider.push('health');
  } else if (remainderClasses === 'pe') {
    recommendedClassesConsider.push('health');
  } else if (remainderClasses === 'health'){
    recommendedClassesConsider.push('PE');
  }
  
  sections.forEach((section) => {
    const sectionRef = child(coursesRef, section);
    onValue(sectionRef, (sectionSnapshot) => {
      sectionSnapshot.forEach((courseSnapshot) => {
        const course = courseSnapshot.val();
        const grades = course.grade?.split(",") ?? [];
        
        
        if (grades.includes(String(grade))) {
          console.log(`Found course with grade ${grade}: ${courseSnapshot.key}`);
          //lowerlevel of course (property)
          const gradeRef = child(courseSnapshot.ref, "grade");
          const rigorRef = child(courseSnapshot.ref, "rigor");
          //not part of property, more like brand
          const courseName= courseSnapshot.key;
          const courseSection = sectionSnapshot.key;
          let courseRigor;
          let courseGrade;
          console.log(choseTechnology && courseSection === 'technology');
          console.log(choseEngineering && courseSection === 'engineer');
          
          onValue(gradeRef, (gradeSnapshot) => {
            courseGrade = gradeSnapshot.val();
            //console.log(`Course grade(s): ${courseGrade}`);
          });
          onValue(rigorRef, (rigorSnapshot) => {
            courseRigor = rigorSnapshot.val();
            //console.log(`Course rigor: ${courseRigor}`);
          });
          //console.log(courseName);
          //console.log(courseSection);
          if (courseSection === 'science') {
            if (courseRigor === 'easy') {
              easyScienceClasses.push(courseName + "");
              //see if freshmen then put in stuff
            } else if (courseRigor === 'intermediate') {
              hardScienceClasses.push(courseName + "");
            } else if (courseRigor === 'recommended') {
              recommendedScienceClasses.push(courseName + "");
            }
          } else if (courseSection == 'math') {
            if (courseRigor === 'easy') {
              if (grade != 9) {
                console.log(grade);
                easyMathClasses.push(courseName + "");
              } else if (grade == 9) {
                console.log('9th grader');
                dataArray.forEach((value, index) => {
                  if (index == 4 && value.answer == 'genMath') {
                    console.log('genmath chosen');
                      easyMathClasses.push('Algebra 1')
                      recommendedMathClasses.push('Algebra 1')
                      hardMathClasses.push('Algebra 1')
                  } else if (value.answer == 'geometry') {
                    console.log('geometry chosen');
                      easyMathClasses.push('Algebra 2')
                      recommendedMathClasses.push('Algebra 2 Honors')
                      hardMathClasses.push('Algebra 2 Honors')
                  } else if (value.answer == 'algebra') {
                    console.log('algebra chosen');
                      easyMathClasses.push('Geometry')
                      recommendedMathClasses.push('Geometry Honors')
                      hardMathClasses.push('Geometry Honors')
                  }
                });
              }
            } else if (courseRigor === 'intermediate') {
              hardMathClasses.push(courseName + "");
            } else if (courseRigor === 'recommended') {
              recommendedMathClasses.push(courseName + "");
            }
          } else if (courseSection === 'la') {
            if (courseRigor === 'easy') {
              easyLAClasses.push(courseName + "");
            } else if (courseRigor === 'intermediate') {
              hardLAClasses.push(courseName + "");
            } else if (courseRigor === 'recommended') {
              recommendedLAClasses.push(courseName + "");
            }
          } else if (courseSection === 'social') {
            if (courseRigor === 'easy') {
              easySocialClasses.push(courseName + "");
            } else if (courseRigor === 'intermediate') {
              hardSocialClasses.push(courseName + "");
            } else if (courseRigor === 'recommended') {
              recommendedSocialClasses.push(courseName + "");
            }
          } else if (courseSection === 'engineer') {
            console.log('user wanted engineering, rigor chosen is ' + rigor + ' and current course rigor is ' + courseRigor);
            
            if (choseEngineering) {
              if (rigor === 'easy' && courseRigor === 'easy') {
                stemChoicesBasedOnRigor.push(courseName + "");
              } else if (rigor === 'medium' && courseRigor === 'intermediate') {
                stemChoicesBasedOnRigor.push(courseName + "");
              } else if (rigor === 'hard' && courseRigor === 'recommended') {
                stemChoicesBasedOnRigor.push(courseName + "");
              } else {
                console.log('couldnt find anything');
              }
            }
          } else if (courseSection === 'technology') {
            console.log('user wanted technology, rigor chosen is ' + rigor + ' and current course rigor is ' + courseRigor);

            if (choseTechnology) {
              console.log('user chose tech');
              
              if (rigor === 'easy' && courseRigor === 'easy') {
                stemChoicesBasedOnRigor.push(courseName + "");
              } else if (rigor === 'medium' && courseRigor === 'intermediate') {
                stemChoicesBasedOnRigor.push(courseName + "");
              } else if (rigor === 'hard' && courseRigor === 'recommended') {
                stemChoicesBasedOnRigor.push(courseName + "");
              } else {
                console.log('couldnt find anything, courses in here are not yet available');
              }
            }
          }
        } else {
          console.log(`Could not find any courses with grade ${grade}`);
        }
      });
    });
  });
});


      //if array emtpy, fill with prev array (manually)
      /*
    let easyMathClasses: string[] = []
    let easyScienceClasses: string[] = []
    let easySocialClasses: string[] = []
    let easyLAClasses: string[] = []

    let recommendedMathClasses: string[] = []
    let recommendedScienceClasses: string[] = []
    let recommendedSocialClasses: string[] = []
    let recommendedLAClasses: string[] = []

    let hardMathClasses: string[] = []
    let hardScienceClasses: string[] = []
    let hardSocialClasses: string[] = []
    let hardLAClasses: string[] = []
      */


      console.log('rigor:' + rigor);
      console.log('grade' + grade);
      
      console.log("easy courses");
      console.log(easyMathClasses);
      console.log(easyScienceClasses);
      console.log(easySocialClasses);
      console.log(easyLAClasses);

      console.log("hard courses");
      console.log(hardMathClasses);
      console.log(hardScienceClasses);
      console.log(hardSocialClasses);
      console.log(hardLAClasses);

      console.log("recommended courses");
      console.log(recommendedMathClasses);
      console.log(recommendedScienceClasses);
      console.log(recommendedSocialClasses);
      console.log(recommendedLAClasses);

      console.log("stem classes");
      console.log(stemChoicesBasedOnRigor);

      console.log('rest of the classes to consider');
      console.log(recommendedClassesConsider);
      
            //populate hard courses with easy
      if (hardMathClasses.length == 0) {
        console.log('hard math empty');
        hardMathClasses.push(...easyMathClasses);
      }
      if (hardScienceClasses.length == 0) {
        console.log('hard science empty' + hardScienceClasses);
        hardScienceClasses.push(...easyScienceClasses);
      }
      if (hardSocialClasses.length == 0) {
        console.log('hard social empty' + hardSocialClasses);
        hardSocialClasses.push(...easySocialClasses);
      }
      if (hardLAClasses.length == 0) {
        console.log('hard LA empty' + hardLAClasses);
        hardLAClasses.push(...easyLAClasses);
      }
      //populate recommended courses with hard
      setTimeout(() => { //LOL IT WAS LAGGING
      if (recommendedMathClasses.length == 0) {
        console.log('recomennded math empty' + recommendedMathClasses);
        recommendedMathClasses.push(...hardMathClasses);
      }
      if (recommendedScienceClasses.length == 0) {
        console.log('recomennded science empty' + recommendedScienceClasses);
        recommendedScienceClasses.push(...hardScienceClasses);
      }
      if (recommendedSocialClasses.length == 0) {
        console.log('recomennded social empty' + recommendedSocialClasses);
        recommendedSocialClasses.push(...hardSocialClasses);
      }
      if (recommendedLAClasses.length == 0) {
        console.log('recomennded la empty' + recommendedLAClasses + ',' + hardLAClasses);
        recommendedLAClasses.push(...hardLAClasses);
      }
        }, 5000);
      
      // now add these array results to the collection userResults
      //add it to a new document in it, and have a group called easyCourses, which contains the fields math, science

      //finally have them grabbed by results page and fuicking displayed FUCK
      
      
  }

  function getNextCourse(rigor: string, courseName: string) {
    //loop through database till find course, then look one level deeper to the rnexteasy, etc
    if (rigor === 'easy') {
      //take courses next easiest course and put it on datatable
    }
  }
  return (
    <div>
      {results ? (
        <div>Survey results: {JSON.stringify(results)}</div>
      ) : (
        <div>
          <Survey
          json={surveyJSON}
          onComplete={handleSurveyComplete}
          /> 
        </div> 
      )}
    </div>
    
  );
}
//gg
export default SurveyComp;
