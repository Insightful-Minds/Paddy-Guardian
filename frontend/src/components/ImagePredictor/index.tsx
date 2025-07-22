import { useState } from 'react'
import axios from 'axios';
import { Container, Card, Button, Form, Alert, Row, Col, Spinner, Image } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';

const ImagePredictor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult('');
    setError('');
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/image-predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult('');
    setImagePreview(null);
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
              <Card.Header className="bg-success text-white text-center py-4">
                <h2 className="mb-0">📷 AI-Powered Image Disease Detection</h2>
                <p className="mb-0 mt-2">Upload a clear photo of a paddy leaf for instant analysis</p>
              </Card.Header>
              <Card.Body className="p-5">
                <Row>
                  <Col md={6}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">📁 Select Image</h5>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="fw-semibold">Choose a rice leaf image</Form.Label>
                        <Form.Control 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-control-lg"
                        />
                        <Form.Text className="text-muted">
                          Supported formats: JPG, PNG, JPEG (Max 10MB)
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="d-grid gap-2 mb-3">
                        <Button 
                          variant="success" 
                          size="lg"
                          onClick={handleUpload}
                          disabled={!file || loading}
                          className="py-3"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Analyzing Image...
                            </>
                          ) : (
                            <>🔍 Analyze Disease</>
                          )}
                        </Button>
                        
                        {(file || result) && (
                          <Button 
                            variant="outline-secondary" 
                            onClick={resetForm}
                            disabled={loading}
                          >
                            🔄 Reset
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">🖼️ Image Preview</h5>
                      <div 
                        className="border rounded-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          height: '300px', 
                          backgroundColor: '#f8f9fa',
                          borderStyle: 'dashed !important'
                        }}
                      >
                        {imagePreview ? (
                          <Image 
                            src={imagePreview} 
                            alt="Preview" 
                            fluid 
                            rounded
                            style={{ maxHeight: '280px', maxWidth: '100%' }}
                          />
                        ) : (
                          <div className="text-center text-muted">
                            <div style={{ fontSize: '4rem' }}>📷</div>
                            <p>Image preview will appear here</p>
                          </div>
                        )}
                      </div>
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
                          <div className="bg-white rounded p-3 border">
                            <h5 className="text-success mb-2">Disease Prediction:</h5>
                            <p className="h4 text-dark mb-0">{result}</p>
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
                    <Card className="border-info">
                      <Card.Body>
                        <h5 className="text-info mb-3">📋 Instructions for Best Results</h5>
                        <Row>
                          <Col md={6}>
                            <ul className="list-unstyled">
                              <li className="mb-2">✅ Use clear, well-lit photos</li>
                              <li className="mb-2">✅ Focus on the leaf surface</li>
                              <li className="mb-2">✅ Avoid blurry or dark images</li>
                            </ul>
                          </Col>
                          <Col md={6}>
                            <ul className="list-unstyled">
                              <li className="mb-2">✅ Show visible symptoms clearly</li>
                              <li className="mb-2">✅ Single leaf preferred</li>
                              <li className="mb-2">✅ Remove background distractions</li>
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

export default ImagePredictor;