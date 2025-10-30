/**
 * Feedback Analytics Component
 * Displays feedback statistics and detailed feedback list for admins
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
  Form,
  ProgressBar,
} from 'react-bootstrap';
import {
  getAllFeedback,
  getFeedbackStats,
  downloadFeedbackCSV,
  FeedbackStats,
} from '../services/feedbackService';
import { UserFeedback } from '../types';

const FeedbackAnalytics: React.FC = () => {
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<UserFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'agree' | 'disagree'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeedbackData();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, filterType, searchQuery]);

  const loadFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [feedbackData, statsData] = await Promise.all([
        getAllFeedback(),
        getFeedbackStats(),
      ]);
      
      setFeedback(feedbackData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load feedback data:', err);
      setError('Failed to load feedback data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedback];

    // Apply feedback type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(f => f.feedback === filterType);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.userUID.toLowerCase().includes(query) ||
        (f.textFeedback && f.textFeedback.toLowerCase().includes(query))
      );
    }

    setFilteredFeedback(filtered);
  };

  const handleExportCSV = () => {
    const dataToExport = filteredFeedback.length > 0 ? filteredFeedback : feedback;
    const filename = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFeedbackCSV(dataToExport, filename);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border">
          <span className="visually-hidden">Loading feedback data...</span>
        </Spinner>
        <p className="mt-3">Loading feedback analytics...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Feedback Analytics</h2>

      {/* Statistics Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-primary">{stats.totalFeedback}</h3>
                <Card.Text className="text-muted">Total Feedback</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-success">{stats.agreeCount}</h3>
                <Card.Text className="text-muted">Agree ({stats.agreePercentage}%)</Card.Text>
                <ProgressBar now={stats.agreePercentage} variant="success" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-danger">{stats.disagreeCount}</h3>
                <Card.Text className="text-muted">Disagree ({stats.disagreePercentage}%)</Card.Text>
                <ProgressBar now={stats.disagreePercentage} variant="danger" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-info">{stats.withTextFeedback}</h3>
                <Card.Text className="text-muted">With Comments</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters and Export */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Type</Form.Label>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'agree' | 'disagree')}
                >
                  <option value="all">All Feedback</option>
                  <option value="agree">Agree Only</option>
                  <option value="disagree">Disagree Only</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by User ID or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="text-end">
              <Form.Label className="d-block">&nbsp;</Form.Label>
              <Button variant="primary" onClick={handleExportCSV}>
                Export to CSV ({filteredFeedback.length || feedback.length} rows)
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Feedback Table */}
      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">
            Feedback Details ({filteredFeedback.length} of {feedback.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No feedback matches your filters.</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Feedback</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <code>{item.userUID.substring(0, 8)}...</code>
                    </td>
                    <td>
                      <Badge bg={item.feedback === 'agree' ? 'success' : 'danger'}>
                        {item.feedback === 'agree' ? 'Agree' : 'Disagree'}
                      </Badge>
                    </td>
                    <td>
                      {item.textFeedback ? (
                        <span className="text-muted">{item.textFeedback}</span>
                      ) : (
                        <em className="text-muted">No comment</em>
                      )}
                    </td>
                    <td className="text-muted">{formatDate(item.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeedbackAnalytics;
