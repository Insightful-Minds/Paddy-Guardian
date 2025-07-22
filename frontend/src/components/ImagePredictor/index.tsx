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
      setError('Please select an image file first. | කරුණාකර මුලින්ම රූප ගොනුවක් තෝරන්න.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('Uploading file:', file);

      const response = await axios.post('http://localhost:5000/image-predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to analyze the image. Please try again. | රූපය විශ්ලේෂණය කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.');
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
           <Col lg={12} xl={12}>
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Header className="bg-success text-white text-center py-4">
                <h2 className="mb-0">📷 AI-Powered Image Disease Detection</h2>
                <h3 className="mb-0 mt-2">🔬 AI මගින් රූප රෝග හඳුනාගැනීම</h3>
                <p className="mb-0 mt-2">Upload a clear photo of a paddy leaf for instant analysis</p>
                <p className="mb-0 mt-1 small">වී පත්‍රයේ පැහැදිලි ඡායාරූපයක් උඩුගත කර ක්ෂණික විශ්ලේෂණයක් ලබා ගන්න</p>
              </Card.Header>
              <Card.Body className="p-5">
                <Row>
                  <Col md={6}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">📁 Select Image | රූපය තෝරන්න</h5>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="fw-semibold">Choose a rice leaf image | වී පත්‍රයේ රූපයක් තෝරන්න</Form.Label>
                        <Form.Control 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-control-lg"
                        />
                        <Form.Text className="text-muted">
                          Supported formats: JPG, PNG, JPEG (Max 10MB)
                          <br />
                          <span className="small">සහාය දක්වන ආකෘති: JPG, PNG, JPEG (උපරිම 10MB)</span>
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
                              Analyzing Image... | රූපය විශ්ලේෂණය කරමින්...
                            </>
                          ) : (
                            <>🔍 Analyze Disease | රෝගය හඳුනාගන්න</>
                          )}
                        </Button>
                        
                        {(file || result) && (
                          <Button 
                            variant="outline-secondary" 
                            onClick={resetForm}
                            disabled={loading}
                          >
                            🔄 Reset | නැවත සකසන්න
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">🖼️ Image Preview | රූප පෙරදසුන</h5>
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
                            <p className="small">රූප පෙරදසුන මෙහි දිස්වේ</p>
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
                          <h4 className="mb-3">🎯 Analysis Results | විශ්ලේෂණ ප්‍රතිඵල</h4>
                          <div className="bg-white rounded p-3 border">
                            <h5 className="text-success mb-2">Disease Prediction | රෝග අනාවැකිය:</h5>
                            <p className="h4 text-dark mb-0">{result}</p>
                            <p className="text-muted mt-2 small">
                              Based on AI analysis of the uploaded image | උඩුගත කරන ලද රූපයේ AI විශ්ලේෂණය මත පදනම්ව
                            </p>
                          </div>
                        </Alert>
                      )}
                      
                      {error && (
                        <Alert variant="danger" className="text-center">
                          <strong>⚠️ Error | දෝෂය:</strong> {error}
                          <br />
                          <span className="small">කරුණාකර නැවත උත්සාහ කරන්න | Please try again</span>
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
                        <h5 className="text-info mb-3">📋 Instructions for Best Results | හොඳම ප්‍රතිඵල සඳහා උපදෙස්</h5>
                        <Row>
                          <Col md={6}>
                            <h6 className="text-primary mb-2">📷 Photography Tips | ඡායාරූප ගැනීමේ උපදෙස්</h6>
                            <ul className="list-unstyled">
                              <li className="mb-2">✅ Use clear, well-lit photos | පැහැදිලි, හොඳ ආලෝකයක් ඇති ඡායාරූප භාවිතා කරන්න</li>
                              <li className="mb-2">✅ Focus on the leaf surface | පත්‍ර මතුපිට කෙරෙහි අවධානය යොමු කරන්න</li>
                              <li className="mb-2">✅ Avoid blurry or dark images | බොඳ හෝ අඳුරු ඡායාරූප මග හරින්න</li>
                            </ul>
                          </Col>
                          <Col md={6}>
                            <h6 className="text-primary mb-2">🎯 Quality Guidelines | ගුණත්ව මාර්ගෝපදේශ</h6>
                            <ul className="list-unstyled">
                              <li className="mb-2">✅ Show visible symptoms clearly | දෘශ්‍ය ලක්ෂණ පැහැදිලිව පෙන්වන්න</li>
                              <li className="mb-2">✅ Single leaf preferred | තනි පත්‍රයක් වඩා හොඳයි</li>
                              <li className="mb-2">✅ Remove background distractions | පසුබිම් බාධක ඉවත් කරන්න</li>
                            </ul>
                          </Col>
                        </Row>
                        <div className="mt-3 p-3 bg-light rounded">
                          <h6 className="text-warning mb-2">💡 Pro Tips | වෘත්තීය උපදෙස්:</h6>
                          <p className="mb-1">• Take photos during daylight hours (8 AM - 4 PM) | දිවා කාලයේ (පෙ.ව. 8 - ප.ව. 4) ඡායාරූප ගන්න</p>
                          <p className="mb-1">• Hold camera steady and close to leaf | කැමරාව ස්ථිරව තබා පත්‍රයට ළඟින් ගන්න</p>
                          <p className="mb-0">• Ensure symptoms are visible and in focus | ලක්ෂණ පෙනෙන සහ නාභිගත වන ලෙස තිබීම සහතික කරන්න</p>
                        </div>
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