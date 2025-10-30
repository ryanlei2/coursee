/**
 * Survey History Component
 * Displays a list of past survey submissions with details
 */

import React, { useState, useEffect } from 'react';
import { Card, Dropdown, Alert, Spinner, Badge, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserSurveyHistory } from '../services/surveyHistoryService';
import { SurveySubmission } from '../types';

interface SurveyHistoryProps {
  onSelectSurvey?: (submission: SurveySubmission) => void;
}

const SurveyHistory: React.FC<SurveyHistoryProps> = ({ onSelectSurvey }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSurveyHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadSurveyHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const history = await getUserSurveyHistory(user.uid);
      setSubmissions(history);
      
      // Auto-select the most recent submission
      if (history.length > 0 && !selectedSubmission) {
        setSelectedSubmission(history[0]);
        onSelectSurvey?.(history[0]);
      }
    } catch (err) {
      console.error('Failed to load survey history:', err);
      setError('Failed to load survey history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission: SurveySubmission) => {
    setSelectedSubmission(submission);
    onSelectSurvey?.(submission);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGradeLabel = (grade: string) => {
    const gradeMap: Record<string, string> = {
      '9': 'Freshman',
      '10': 'Sophomore',
      '11': 'Junior',
      '12': 'Senior',
    };
    return gradeMap[grade] || grade;
  };

  const getRigorLabel = (rigor: string) => {
    const rigorMap: Record<string, string> = {
      'hard': 'Advanced',
      'medium': 'Standard',
      'easy': 'Foundation',
    };
    return rigorMap[rigor] || rigor;
  };

  const countRecommendations = (submission: SurveySubmission): number => {
    const recs = submission.recommendations;
    return Object.values(recs).reduce((total, arr) => total + arr.length, 0);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border">
          <span className="visually-hidden">Loading survey history...</span>
        </Spinner>
        <p className="mt-3">Loading your survey history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (submissions.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Survey History</Alert.Heading>
        <p>
          You haven&apos;t completed any surveys yet. Take your first survey to get personalized course recommendations!
        </p>
      </Alert>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>📚 Survey History</h3>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="survey-history-dropdown">
                {selectedSubmission?.label || 'Select a Survey'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {submissions.map((submission) => (
                  <Dropdown.Item
                    key={submission.id}
                    active={selectedSubmission?.id === submission.id}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    {submission.label} - {formatDate(submission.timestamp)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {selectedSubmission && (
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">{selectedSubmission.label}</h5>
                <small>{formatDate(selectedSubmission.timestamp)}</small>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Survey Details</h6>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Grade Level:</strong>{' '}
                        <Badge bg="info">{getGradeLabel(selectedSubmission.surveyData.gradeQuestion)}</Badge>
                      </li>
                      <li>
                        <strong>Preferred Rigor:</strong>{' '}
                        <Badge bg="secondary">{getRigorLabel(selectedSubmission.surveyData.classLevelQuestion)}</Badge>
                      </li>
                      <li>
                        <strong>Credit Interest:</strong>{' '}
                        <Badge bg="success">{selectedSubmission.surveyData.creditQuestion.toUpperCase()}</Badge>
                      </li>
                      <li>
                        <strong>STEM Interest:</strong>{' '}
                        <Badge bg="warning" text="dark">
                          {selectedSubmission.surveyData.stemInterestQuestion}
                        </Badge>
                      </li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Course Recommendations</h6>
                    <p className="text-muted">
                      Total courses recommended: <strong>{countRecommendations(selectedSubmission)}</strong>
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedSubmission.recommendations.mediumMathClasses.length > 0 && (
                        <Badge bg="primary">Math: {selectedSubmission.recommendations.mediumMathClasses.length}</Badge>
                      )}
                      {selectedSubmission.recommendations.mediumScienceClasses.length > 0 && (
                        <Badge bg="success">Science: {selectedSubmission.recommendations.mediumScienceClasses.length}</Badge>
                      )}
                      {selectedSubmission.recommendations.mediumSTEMClasses.length > 0 && (
                        <Badge bg="info">STEM: {selectedSubmission.recommendations.mediumSTEMClasses.length}</Badge>
                      )}
                      {selectedSubmission.recommendations.peClasses.length > 0 && (
                        <Badge bg="warning" text="dark">PE: {selectedSubmission.recommendations.peClasses.length}</Badge>
                      )}
                      {selectedSubmission.recommendations.healthClasses.length > 0 && (
                        <Badge bg="danger">Health: {selectedSubmission.recommendations.healthClasses.length}</Badge>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="mt-4">
                  <h6>Recommended Courses</h6>
                  {selectedSubmission.recommendations.mediumMathClasses.length > 0 && (
                    <div className="mb-2">
                      <strong>Math:</strong>
                      <ul>
                        {selectedSubmission.recommendations.mediumMathClasses.slice(0, 3).map((course) => (
                          <li key={course}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedSubmission.recommendations.mediumScienceClasses.length > 0 && (
                    <div className="mb-2">
                      <strong>Science:</strong>
                      <ul>
                        {selectedSubmission.recommendations.mediumScienceClasses.slice(0, 3).map((course) => (
                          <li key={course}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="text-muted">
                <small>Survey ID: {selectedSubmission.id}</small>
              </Card.Footer>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SurveyHistory;
