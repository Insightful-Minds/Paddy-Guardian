import { useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Alert, Row, Col, Spinner, Badge } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';

const TextDiseasePredictor = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter symptom description first.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/text-predict', { 
        input_text: text.trim() 
      });
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setText('');
    setResult('');
    setError('');
  };

  const symptomExamples = [
    "Yellowing leaves with brown circular spots",
    "Diamond-shaped lesions with gray centers",
    "Brown spots with yellow halos on leaf surface",
    "Wilting and drying of leaf tips",
    "Dark brown streaks along leaf veins"
  ];

  const handleExampleClick = (example: string) => {
    setText(example);
    setResult('');
    setError('');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={10}>
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Header className="bg-info text-white text-center py-4">
                <h2 className="mb-0">✍️ AI-Powered Symptom Analysis</h2>
                <p className="mb-0 mt-2">Describe leaf symptoms for intelligent disease detection</p>
              </Card.Header>
              <Card.Body className="p-5">
                <Row>
                  <Col md={8}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">📝 Symptom Description</h5>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Describe the symptoms you observe</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          value={text}
                          placeholder="Describe what you see on the paddy leaves in detail..."
                          onChange={(e) => setText(e.target.value)}
                          className="form-control-lg"
                          style={{ fontSize: '1.1rem' }}
                        />
                        <Form.Text className="text-muted">
                          Be as specific as possible. Include colors, shapes, locations, and patterns.
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="d-grid gap-2 mb-3">
                        <Button 
                          variant="info" 
                          size="lg"
                          onClick={handleSubmit}
                          disabled={!text.trim() || loading}
                          className="py-3"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Analyzing Symptoms...
                            </>
                          ) : (
                            <>🔍 Analyze Symptoms</>
                          )}
                        </Button>
                        
                        {(text || result) && (
                          <Button 
                            variant="outline-secondary" 
                            onClick={resetForm}
                            disabled={loading}
                          >
                            🔄 Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">💡 Example Symptoms</h5>
                      <div className="d-flex flex-column gap-2">
                        {symptomExamples.map((example, index) => (
                          <Badge
                            key={index}
                            bg="light"
                            text="dark"
                            className="p-2 text-start cursor-pointer"
                            style={{ 
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              lineHeight: '1.4',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleExampleClick(example)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#e9ecef';
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                      <small className="text-muted mt-2 d-block">
                        � Click on any example to use it as a template
                      </small>
                    </div>
                  </Col>
                </Row>

                {/* Character Count */}
                <Row className="mb-3">
                  <Col>
                    <div className="text-end">
                      <small className={`${text.length > 20 ? 'text-success' : 'text-muted'}`}>
                        {text.length} characters (minimum 20 recommended)
                      </small>
                    </div>
                  </Col>
                </Row>

                {/* Results Section */}
                {(result || error) && (
                  <Row className="mt-4">
                    <Col>
                      {result && (
                        <Alert variant="success" className="text-center py-4">
                          <h4 className="mb-3">🎯 Analysis Results</h4>
                          <div className="bg-white rounded p-4 border">
                            <h5 className="text-info mb-2">Disease Prediction:</h5>
                            <p className="h4 text-dark mb-2">{result}</p>
                            <div className="mt-3">
                              <small className="text-muted">
                                📊 Analysis based on symptom patterns in our AI database
                              </small>
                            </div>
                          </div>
                        </Alert>
                      )}
                      
                      {error && (
                        <Alert variant="danger" className="text-center">
                          <strong>⚠️ Error:</strong> {error}
                        </Alert>
                      )}
                    </Col>
                  </Row>
                )}

                {/* Instructions Section */}
                <Row className="mt-5">
                  <Col>
                    <Card className="border-warning">
                      <Card.Body>
                        <h5 className="text-warning mb-3">📋 Tips for Accurate Analysis</h5>
                        <Row>
                          <Col md={6}>
                            <h6 className="text-primary">🔍 What to Include:</h6>
                            <ul className="list-unstyled mb-3">
                              <li className="mb-2">✅ Leaf color changes</li>
                              <li className="mb-2">✅ Spot shapes and sizes</li>
                              <li className="mb-2">✅ Pattern locations</li>
                              <li className="mb-2">✅ Texture changes</li>
                            </ul>
                          </Col>
                          <Col md={6}>
                            <h6 className="text-success">📝 Example Descriptions:</h6>
                            <ul className="list-unstyled mb-3">
                              <li className="mb-2">🟡 "Yellow with brown edges"</li>
                              <li className="mb-2">🟤 "Circular dark spots"</li>
                              <li className="mb-2">💎 "Diamond-shaped lesions"</li>
                              <li className="mb-2">🌊 "Watery appearance"</li>
                            </ul>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TextDiseasePredictor