import React, { useState } from 'react'
import { Container, Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import styles from '../styles/dashboard.module.css'
import SurveyHistory from './SurveyHistory'

const StudentDashboard = () => {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <Container className={styles.body} style={{
      marginBottom: '900px',
      marginTop: '200px'
    }}>
      <div>
        <Container className='display-3 my-5'>
          <i><b>First</b></i> time using Coursee or having trouble deciding on a path? Take our survey!<br></br>
          <Link href="/survey">
            <button className="surveyBtn" role="button">Survey</button>
          </Link>
        </Container>

        {/* Survey History Section */}
        <Container className="mt-5">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">📋 Your Survey History</h4>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'View History'}
              </Button>
            </Card.Header>
            {showHistory && (
              <Card.Body>
                <SurveyHistory />
              </Card.Body>
            )}
          </Card>
        </Container>
      </div>
    </Container>
  )
}

export default StudentDashboard
