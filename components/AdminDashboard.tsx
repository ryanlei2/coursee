import { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button, ListGroup, Container, Tabs, Tab } from 'react-bootstrap';
import FeedbackAnalytics from './FeedbackAnalytics';

// This code defines an interface FeedbackData that represents the structure of each feedback item in the array. It also uses the as keyword to cast the data returned from Firebase to the FeedbackData interface to prevent type errors.
interface FeedbackData {
  id: string;
  data: {
    data: string[];
    date: string;
    userId: string;
    userEmail: string;
  };
}

function AdminDashboard() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('analytics');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'userFeedback'), (snapshot) => {
      const feedbackData: FeedbackData[] = [];
      snapshot.forEach((doc) => {
        feedbackData.push({ id: doc.id, data: doc.data() } as FeedbackData);
      });
      setFeedbackData(feedbackData);
    });

    return () => unsubscribe();
  }, []);
  
  //handle the deletetion of data
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'userFeedback', id));
      setFeedbackData(prevState => prevState.filter(feedback => feedback.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }
  // In the return statement, it maps over the feedbackData array and renders a list item for each feedback item. The key prop is set to the id of each item. The feedbackItem.data object is then accessed to display the relevant information in the UI.
  return (
    <Container
      style={{
        fontSize:'2rem',
        marginLeft:'90px',
        marginTop:'50px',
        maxWidth: '1400px'
      }}
    >
      <h1 className='display-1'
        style={{
          fontWeight:'bolder'
        }}
      >Admin Dashboard</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'analytics')}
        className="mb-3 mt-4"
      >
        <Tab eventKey="analytics" title="Feedback Analytics">
          <FeedbackAnalytics />
        </Tab>
        
        <Tab eventKey="legacy" title="Legacy Feedback View">
          <h3 className='display-2'
            style={{
              marginTop:'30px',
              marginBottom:'30px'
            }}
          >User Feedback</h3>
          <ul>
            {feedbackData.map((feedbackItem) => (
              <li
                key={feedbackItem.id}
                style={{
                  border: '4px solid gray',
                  boxShadow: '10px 10px 8px #888888',
                  padding: '10px',
                  listStyleType: 'none',
                  marginBottom: '40px'
                }}
              >
                <p>Email: {feedbackItem.data.userEmail}</p>
                <p>UserID: {feedbackItem.data.userId}</p>
                <p>Date: {feedbackItem.data.date}</p>
                <ul>
                  {feedbackItem.data.data.map((item: string, index: number) => (
                    <li key={`${feedbackItem.id}-${index}`}>{item}</li>
                  ))}
                </ul>
                <Button onClick={() => handleDelete(feedbackItem.id)}>Delete</Button>
                <br></br><br></br>
              </li>
            ))}
          </ul>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;
