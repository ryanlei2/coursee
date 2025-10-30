/**
 * Survey JSON Configuration
 * Defines the structure and questions for the course recommendation survey
 */

export const surveyJSON = {
  title: 'Career Survey',
  description: 'Give us some general knowledge on the career you want to choose.',
  logoPosition: 'right',
  completedHtml:
    '<h3>Great, thank you for completing the survey! You\'ll soon see your results.</h3>\n',
  widthMode: 'static',
  pages: [
    {
      name: 'SchoolQuestions',
      title: 'School Questions',
      description: 'We need to know your background first.',
      elements: [
        {
          type: 'radiogroup',
          name: 'gradeQuestion',
          title: 'Which highschool level are you?',
          isRequired: true,
          choices: [
            { value: '9', text: 'Freshman (9th)' },
            { value: '10', text: 'Sophomore (10th)' },
            { value: '11', text: 'Junior (11th)' },
            { value: '12', text: 'Senior (12th)' },
          ],
        },
        {
          type: 'radiogroup',
          name: 'classLevelQuestion',
          title: 'How hard do you want your classes to be?',
          isRequired: true,
          choices: [
            { value: 'hard', text: 'Challenging (AP/Honors)' },
            { value: 'medium', text: 'Intermediate (Honors)' },
            { value: 'easy', text: 'Basic (:P)' },
          ],
        },
        {
          type: 'radiogroup',
          name: 'creditQuestion',
          title: 'Have you completed your PE and/or Health Credits (complete these ASAP)',
          isRequired: true,
          choices: [
            { value: 'both', text: 'Yes, both' },
            { value: 'pe', text: 'Only PE' },
            { value: 'health', text: 'Only Health' },
            { value: 'none', text: 'Neither' },
          ],
        },
        {
          type: 'radiogroup',
          name: 'stemInterestQuestion',
          title: 'Which subject interests you the most?',
          isRequired: true,
          choices: [
            { value: 'science', text: 'Science' },
            { value: 'technology', text: 'Technology' },
            { value: 'engineer', text: 'Engineering' },
            { value: 'math', text: 'Mathematics' },
          ],
        },
      ],
    },
    {
      name: 'CoreCredits',
      title: 'Core Credits',
      description:
        'We use these questions to determine whether we should assign you a core class or give more room for a career class.',
      elements: [
        {
          type: 'radiogroup',
          name: 'freshMathCheck',
          visibleIf: '{gradeQuestion} = 9',
          title: 'As a freshman, check which math you took previously in middle school.',
          isRequired: true,
          choices: [
            { value: 'genMath', text: 'General Math 3' },
            { value: 'geometry', text: 'Geometry' },
            { value: 'algebra', text: 'Algebra 1' },
          ],
        },
      ],
    },
    {
      name: 'page3',
      title: 'You Did it!',
      elements: [
        {
          type: 'expression',
          name: 'Final Remarks',
          title: 'Final Remarks',
          description:
            'That was easy! Now, before we finish the survey, we want to just give you some points of advice before you proceed to your results.\n\nBecause these are so general, we want to give you a good starting point for picking out your own classes. You can tweak what we have shown you, or just stick with the classes if they look good enough for you. The point is, we want you to get bearings set up before you trip over yourself on the perfect classes.',
        },
      ],
    },
  ],
};
