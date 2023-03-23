import React, { useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { saveUserFeedback } from '../config/firebase';
import { useLocation } from 'react-router-dom';
import { useRouter } from 'next/router';
import { ArrayChanges } from 'survey-react';
import { arrayBuffer } from 'stream/consumers';

const Results = () => {
const router = useRouter()


  const data = router.query

  const dataObj2:any = router.query.data
  const dataObj = router.query.data ? JSON.parse(dataObj2) : {};  
  console.log(router.query.data);
  console.log(JSON.stringify(data));
  const array = JSON.stringify(data)
  //math social science la
    const easyClasses = [
    convertArrayToObject(dataObj.easyMathClasses),
    convertArrayToObject(dataObj.easySocialClasses),
    convertArrayToObject(dataObj.easyScienceClasses),
    convertArrayToObject(dataObj.easyLAClasses)
  ];
  const hardClasses = [
    convertArrayToObject(dataObj.hardMathClasses),
    convertArrayToObject(dataObj.hardSocialClasses),
    convertArrayToObject(dataObj.hardScienceClasses),
    convertArrayToObject(dataObj.hardLAClasses)
  ];
  const recommendedClasses = [
    convertArrayToObject(dataObj.recommendedMathClasses),
    convertArrayToObject(dataObj.recommendedSocialClasses),
    convertArrayToObject(dataObj.recommendedScienceClasses),
    convertArrayToObject(dataObj.recommendedLAClasses)
  ];
  const otherClasses = [
    convertArrayToObject(dataObj.recommendedClassesConsider),
    convertArrayToObject(dataObj.stemChoicesBasedOnRigor)
  ];
  
  let easyScience: string[] = dataObj.easyScienceClasses
  console.log(easyScience);
  let easyMath: string[] = dataObj.easyMathClasses
  let easySocial: string[] = dataObj.easySocialClasses
  let easyLA: string[] = dataObj.easyLAClasses

  let hardMath: string[] = dataObj.hardMathClasses
  let hardScience: string[] = dataObj.hardScienceClasses
  let hardSocial: string[] = dataObj.hardSocialClasses
  let hardLA: string[] = dataObj.hardLAClasses

  let recommendedMath: string[] = dataObj.recommendedMathClasses
  let recommendedScience: string[] = dataObj.recommendedScienceClasses
  let recommendedSocial: string[] = dataObj.recommendedSocialClasses
  let recommendedLA: string[] = dataObj.recommendedLAClasses

  let recommendedConsider: string[] = dataObj.recommendedClassesConsider
  let stemBasedOnRigor: string[] = dataObj.stemChoicesBasedOnRigor

  const result = [easyClasses, hardClasses, recommendedClasses, otherClasses];
  console.log(result);

  
  
  function convertArrayToObject(arr: any[]) {
    if (Array.isArray(arr)) {
      return arr.map(name => ({ name }));
    } else {
      return [{ name: arr }];
    }
  }
  
      
  

  const [feedback, setFeedback] = useState('');
  const [buttonClicked, setButtonClicked] = useState('');

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    setButtonClicked(button.name);
    console.log(buttonClicked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const feedbackData = [`${feedback} ${buttonClicked}`];
    saveUserFeedback(feedbackData);
    setFeedback('');
    setButtonClicked('');
    console.log(feedbackData);
  };

  return (
    <div>
      <div className='display-5' style={{ textAlign: 'center', marginTop: '15rem' }}>
        <Container>
          <Table striped bordered>
            <thead>
              <tr>
                <th></th>
                <th>Recommended</th>
                <th>Intermediate</th>
                <th>Easy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Math</td>
                <td>{recommendedMath.join(", ")}</td>
                <td>{hardMath.join(", ")}</td>
                <td>{}</td>
                {/* easyMath.join(", ") */}
              </tr>
              <tr>
                <td>Science</td>
                <td>{recommendedScience.join(", ")}</td>
                <td>{hardScience.join(", ")}</td>
                <td>{easyScience.join(", ")}</td>
              </tr>
              <tr>
                <td>Social</td>
                <td>{recommendedSocial.join(", ")}</td>
                <td>{hardSocial.join(", ")}</td>
                <td>{easySocial.join(", ")}</td>
              </tr>
              <tr>
                <td>LA</td>
                <td>{recommendedLA.join(", ")}</td>
                <td>{hardLA.join(", ")}</td>
                <td>{easyLA.join(", ")}</td>
              </tr>
              <tr>
                <td>STEM</td>
                <td>{stemBasedOnRigor.join(", ")}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Classes to Consider:</td>
                <td>{recommendedConsider.join(", ")}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button variant='success' size='lg' name='agree' onClick={handleButtonClick}>
            Agree
          </Button>
          <Button variant='danger' size='lg' name='disagree' onClick={handleButtonClick}>
            Disagree
          </Button>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h3>Feedback</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='feedbackForm'>
              <Form.Control as='textarea' rows={3} value={feedback} onChange={handleFeedbackChange}/>
              <Button variant='primary' type='submit' style={{ marginTop: '3rem', marginBottom: '100px' }}>
                Submit Feedback
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Results;