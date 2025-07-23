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
      setError('Please enter symptom description first. | කරුණාකර මුලින්ම රෝග ලක්ෂණ විස්තරයක් ඇතුළත් කරන්න.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Check if text contains Sinhala characters
      const isSinhala = /[\u0D80-\u0DFF]/.test(text);
      const endpoint = isSinhala ? '/sinhala-text-predict' : '/text-predict';
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, { 
        input_text: text.trim() 
      });
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again. | රෝග ලක්ෂණ විශ්ලේෂණය අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න.');
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

  // Disease management suggestions
  const getDiseaseManagement = (result: string) => {
    const diseaseManagement: { [key: string]: any } = {
      'Blast': {
        sinhala: 'පතුරු රෝගය',
        prevention: [
          'ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න',
          'බීජ ප්‍රතිකාර කරන්න',
          'ක්ෂේත්‍රය පිරිසිදුව තබන්න',
          'නිසි ජල කළමනාකරණය'
        ],
        treatment: [
          'Tricyclazole 75% WP - 200-300g/ha',
          'Propiconazole 25% EC - 500ml/ha', 
          'Carbendazim 50% WP - 500g/ha',
          'දිලීර නාශක 7-10 දින අන්තරයෙන්'
        ],
        organic: [
          'නීම් තෙල් ඉස්කරන්න',
          'තඹ සල්ෆේට් 0.2% ද්‍රාවණය',
          'ජෛව ප්‍රතිරෝධක ඉස්කරන්න',
          'කොම්පෝස්ට් හා කළු මැටි භාවිතය'
        ]
      },
      'Bacterial Blight': {
        sinhala: 'බැක්ටීරියානු පත්‍ර දාහය',
        prevention: [
          'සනීපාරක්ෂක ක්‍රම අනුගමනය',
          'ආසාදිත ක්ෂේත්‍ර වලින් ජලය මගහරින්න',
          'නිසි පරතරයකින් රෝපණය',
          'කිසිදු තුවාලයක් නැති බීජ භාවිතය'
        ],
        treatment: [
          'Streptomycin 90% + Tetracycline 10% - 200g/ha',
          'Copper Oxychloride 50% WP - 2.5kg/ha',
          'Kasugamycin 3% SL - 1.5-2.0L/ha',
          'බැක්ටීරියා නාශක 10-12 දින අන්තරයෙන්'
        ],
        organic: [
          'තඹ සල්ෆේට් 0.2% + අඟුරු කුඩු',
          'සුදුළූණු සාරය ඉස්කරන්න',
          'නීම් සාරය + සබන්',
          'ක්ෂේත්‍රය වියළි තබන්න'
        ]
      },
      'Brown Spot': {
        sinhala: 'කළු ලප රෝගය',
        prevention: [
          'සීරුවේ සිට ප්‍රතිකාර ආරම්භ කරන්න',
          'සේන්ද්‍රීය පස් සමතුලිතව භාවිතය',
          'ක්ෂේත්‍රය පිරිසිදුව තබන්න',
          'නිසි වාතාශ්‍රය සපයන්න'
        ],
        treatment: [
          'Mancozeb 75% WP - 2kg/ha',
          'Propiconazole 25% EC - 500ml/ha',
          'Hexaconazole 5% SC - 2ml/L',
          'දිලීර නාශක 2 සති අන්තරයෙන්'
        ],
        organic: [
          'නීම් තෙල් 5ml/L ජලයට',
          'බේකින් සෝඩා 5g/L ජලයට',
          'අදරක් + කහ සාරය',
          'ජෛව පස් වැඩි ප්‍රමාණයෙන්'
        ]
      },
      'Tungro': {
        sinhala: 'ටුංග්‍රෝ රෝගය',
        prevention: [
          'ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න',
          'Green Leaf Hopper පාලනය',
          'ආසාදිත පැල් ඉවත් කරන්න',
          'නව ප්‍රදේශවල රෝපණයෙන් වළකින්න'
        ],
        treatment: [
          'Imidacloprid 17.8% SL - 125ml/ha',
          'Thiamethoxam 25% WG - 100g/ha',
          'Buprofezin 25% SC - 1L/ha',
          'ආසාදිත පැල් වහාම ඉවත් කරන්න'
        ],
        organic: [
          'නීම් තෙල් + සබන් ද්‍රාවණය',
          'කෘමි උගුල් භාවිතය',
          'ස්වභාවික සතුරන් ආරක්ෂා කරන්න',
          'මිශ්‍ර වගාව ක්‍රමය'
        ]
      },
      'Healthy': {
        sinhala: 'සෞඛ්‍ය සම්පන්න',
        prevention: [
          'සෞඛ්‍ය සම්පන්න තත්ත්වය පවත්වන්න',
          'නිතිපතා නිරීක්ෂණය කරන්න',
          'සමතුලිත පෝෂණය සපයන්න',
          'ක්ෂේත්‍රය පිරිසිදුව තබන්න'
        ],
        treatment: [
          'කිසිදු ප්‍රතිකාරයක් අවශ්‍ය නැත',
          'මාසික නිරීක්ෂණ පවත්වන්න',
          'ප්‍රතිකාරක ඉස්කරණ අත්හිටුවන්න',
          'සාමාන්‍ය කළමනාකරණ ක්‍රම අනුගමනය'
        ],
        organic: [
          'ජෛව පස් නිතිපතා',
          'ස්වභාවික ප්‍රතිකාරක ඉස්කරන්න',
          'මිශ්‍ර වගාව ක්‍රමය',
          'පාරිසරික සමතුලිතාවය රැකගන්න'
        ]
      }
    };

    // Find matching disease
    for (const [disease, management] of Object.entries(diseaseManagement)) {
      if (result.toLowerCase().includes(disease.toLowerCase()) || 
          result.includes(management.sinhala)) {
        return management;
      }
    }

    // Default management for unknown diseases
    return {
      sinhala: 'සාමාන්‍ය කළමනාකරණය',
      prevention: [
        'කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ගන්න',
        'ක්ෂේත්‍රය පිරිසිදුව තබන්න',
        'නිතිපතා නිරීක්ෂණය කරන්න',
        'සමතුලිත පෝෂණය සපයන්න'
      ],
      treatment: [
        'විශේෂඥ උපදෙස් අනුව ප්‍රතිකාර',
        'රසායනික විශ්ලේෂණයක් කරවන්න',
        'ප්‍රතිකාරක භාවිතයේදී ප්‍රවේශම් වන්න',
        'නිසි මාත්‍රාව හා කාලසීමාව අනුගමනය'
      ],
      organic: [
        'ස්වභාවික ප්‍රතිකාරක උත්සාහ කරන්න',
        'ජෛව පස් භාවිතා කරන්න',
        'කෘමි සතුරන් ස්වභාවිකව පාලනය',
        'පාරිසරික හිතකර ක්‍රම අනුගමනය'
      ]
    };
  };

  const symptomExamples = [
    "Yellowing leaves with brown circular spots",
    "Diamond-shaped lesions with gray centers", 
    "Brown spots with yellow halos on leaf surface",
    "Wilting and drying of leaf tips",
    "Dark brown streaks along leaf veins",
    "පත්‍ර කහ වී ඇති අතර දුම් පැහැති ලප",
    "කළු වෘත්තාකාර තුවාල පත්‍ර මත",
    "පත්‍ර අගට වියළීම සහ මැලවීම",
    "දුම් පැහැති අක්‍රමවත් ලප",
    "පත්‍ර නිම් ගස් වගේ කහ පැහැයි"
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
           <Col lg={12} xl={12}>
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Header className="bg-info text-white text-center py-4">
                <h2 className="mb-0">✍️ AI-Powered Symptom Analysis</h2>
                <h3 className="mb-0 mt-2">🔬 AI මගින් රෝග ලක්ෂණ විශ්ලේෂණය</h3>
                <p className="mb-0 mt-2">Describe leaf symptoms in English or Sinhala for intelligent disease detection</p>
                <p className="mb-0 mt-1 small">බුද්ධිමත් රෝග හඳුනාගැනීම සඳහා ඉංග්‍රීසියෙන් හෝ සිංහලෙන් පත් ලක්ෂණ විස්තර කරන්න</p>
              </Card.Header>
              <Card.Body className="p-5">
                <Row>
                  <Col md={8}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">📝 Symptom Description | රෝග ලක්ෂණ විස්තරය</h5>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Describe the symptoms you observe | ඔබ නිරීක්ෂණය කරන ලක්ෂණ විස්තර කරන්න</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          value={text}
                          placeholder="Describe what you see on the paddy leaves in detail... | වී පත්‍රවල ඔබ දකින දේ විස්තරාත්මකව ලියන්න..."
                          onChange={(e) => setText(e.target.value)}
                          className="form-control-lg"
                          style={{ fontSize: '1.1rem' }}
                        />
                        <Form.Text className="text-muted">
                          Be as specific as possible. Include colors, shapes, locations, and patterns. | හැකි තරම් නිශ්චිතව ලියන්න. වර්ණ, හැඩ, ස්ථාන සහ රටා ඇතුළත් කරන්න.
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
                              Analyzing Symptoms... | ලක්ෂණ විශ්ලේෂණය කරමින්...
                            </>
                          ) : (
                            <>🔍 Analyze Symptoms | ලක්ෂණ විශ්ලේෂණය කරන්න</>
                          )}
                        </Button>
                        
                        {(text || result) && (
                          <Button 
                            variant="outline-secondary" 
                            onClick={resetForm}
                            disabled={loading}
                          >
                            🔄 Clear All | සියල්ල මකන්න
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4}>
                    <div className="mb-4">
                      <h5 className="text-primary mb-3">💡 Example Symptoms | නිදර්ශන ලක්ෂණ</h5>
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

                      {/* Disease Management Section */}
                      {result && (
                        <Card className="mt-4 border-success">
                          <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">🌾 Disease Management | රෝග කළමනාකරණය</h5>
                          </Card.Header>
                          <Card.Body>
                            {(() => {
                              const management = getDiseaseManagement(result);
                              return (
                                <Row>
                                  <Col md={4}>
                                    <Card className="h-100 border-primary">
                                      <Card.Header className="bg-primary text-white py-2">
                                        <h6 className="mb-0">🛡️ Prevention | වැළැක්වීම</h6>
                                      </Card.Header>
                                      <Card.Body>
                                        <ul className="list-unstyled">
                                          {management.prevention.map((item: string, index: number) => (
                                            <li key={index} className="mb-2">
                                              <span className="text-primary">•</span> {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </Card.Body>
                                    </Card>
                                  </Col>
                                  
                                  <Col md={4}>
                                    <Card className="h-100 border-warning">
                                      <Card.Header className="bg-warning text-dark py-2">
                                        <h6 className="mb-0">💊 Chemical Treatment | රසායනික ප්‍රතිකාර</h6>
                                      </Card.Header>
                                      <Card.Body>
                                        <ul className="list-unstyled">
                                          {management.treatment.map((item: string, index: number) => (
                                            <li key={index} className="mb-2">
                                              <span className="text-warning">•</span> {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </Card.Body>
                                    </Card>
                                  </Col>
                                  
                                  <Col md={4}>
                                    <Card className="h-100 border-success">
                                      <Card.Header className="bg-success text-white py-2">
                                        <h6 className="mb-0">🌿 Organic Treatment | ජෛව ප්‍රතිකාර</h6>
                                      </Card.Header>
                                      <Card.Body>
                                        <ul className="list-unstyled">
                                          {management.organic.map((item: string, index: number) => (
                                            <li key={index} className="mb-2">
                                              <span className="text-success">•</span> {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </Card.Body>
                                    </Card>
                                  </Col>
                                </Row>
                              );
                            })()}
                            
                            {/* Important Notes */}
                            <Alert variant="info" className="mt-4 mb-0">
                              <div className="row">
                                <div className="col-md-6">
                                  <h6 className="text-info mb-2">⚠️ Important Notes | වැදගත් සටහන්:</h6>
                                  <ul className="mb-0 small">
                                    <li>කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න</li>
                                    <li>ප්‍රතිකාරක භාවිතයේදී ආරක්ෂක උපකරණ භාවිතා කරන්න</li>
                                    <li>නිසි මාත්‍රාව හා කාලසීමාව අනුගමනය කරන්න</li>
                                  </ul>
                                </div>
                                <div className="col-md-6">
                                  <h6 className="text-info mb-2">📞 Emergency Contact | හදිසි සම්බන්ධතා:</h6>
                                  <ul className="mb-0 small">
                                    <li>Agricultural Extension Officer - ප්‍රදේශීය කෘෂිකර්ම නිලධාරි</li>
                                    <li>Plant Protection Service - ශාක ආරක්ෂණ සේවය</li>
                                    <li>Rice Research Institute - වී පර්යේෂණ ආයතනය</li>
                                  </ul>
                                </div>
                              </div>
                            </Alert>
                          </Card.Body>
                        </Card>
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