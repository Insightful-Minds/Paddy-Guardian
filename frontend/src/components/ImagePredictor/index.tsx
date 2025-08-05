import { useState } from 'react'
import axios from 'axios';
import { Container, Card, Button, Form, Alert, Row, Col, Spinner, Image } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';
import { API_ENDPOINTS } from '../../config/api';

const ImagePredictor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [validationAnswers, setValidationAnswers] = useState({
    q1: '', // පත්‍රයේ පැහැය
    q2: '', // පත්‍රයේ ලප තිබේද
    q21: '', // ලප වල පැහැය
    q3: '', // තුවාල හැඩය
    q4: '', // වියළීම
    q5: '', // මැලවීම
    q6: ''  // වර්ධනය අඩුවීම
  });
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Rule-based disease prediction function
  const predictDiseaseFromAnswers = (answers: any) => {
    // Based on the dataset patterns, create rule-based logic
    const { q1, q2, q21, q3, q4, q5, q6 } = answers;
    
    // Bacterial Blight rules
    if (q1 === 'කහ' && q2 === 'ඔව්' && q21 === 'දුඹුරු' && q4 === 'ඔව්' && q5 === 'ඔව්') {
      return 'Bacterial Blight';
    }
    
    // Blast rules
    if (q2 === 'ඔව්' && q21 === 'අළු' && q3 === 'ඕවලාකාර' && q4 === 'ඔව්') {
      return 'Blast';
    }
    
    // Brown Spot rules
    if (q1 === 'දුඹුරු' && q2 === 'ඔව්' && q21 === 'දුඹුරු' && q3 === 'ඕවලාකාර') {
      return 'Brown Spot';
    }
    
    // Tungro rules
    if (q1 === 'කහ' && q5 === 'ඔව්' && (q6 === 'ඔව්' || q6 === 'නැහැ')) {
      return 'Tungro';
    }
    
    // Healthy rules
    if (q1 === 'කොළ' && q2 === 'නැහැ' && q4 === 'නැහැ' && q5 === 'නැහැ' && q6 === 'නැහැ') {
      return 'Healthy';
    }
    
    return 'Unknown';
  };

  // Helper function to get disease name in Sinhala
  const getDiseaseNameSinhala = (disease: string) => {
    const diseaseTranslations: { [key: string]: string } = {
      'Blast': 'කොල පාලුව',
      'Bacterial Blight': 'බැක්ටීරියානු පත්‍ර දාහය',
      'Brown Spot': 'කළු ලප රෝගය',
      'Tungro': 'ටුංග්‍රෝ රෝගය',
      'Healthy': 'සෞඛ්‍ය සම්පන්න',
      'Cannot identify disease': 'රෝගයක් හඳුනාගත නොහැක',
      'Unknown Disease': 'නොදන්නා රෝගයක්',
      'Unknown': 'නොදන්නා'
    };

    // Check for exact match first
    if (diseaseTranslations[disease]) {
      return diseaseTranslations[disease];
    }

    // Check for partial matches
    for (const [englishName, sinhalaName] of Object.entries(diseaseTranslations)) {
      if (disease.toLowerCase().includes(englishName.toLowerCase())) {
        return sinhalaName;
      }
    }

    return 'නොදන්නා රෝගයක්'; // Default fallback
  };

  // Helper function to get confidence level color and text
  const getConfidenceInfo = (confidence: number) => {
    if (confidence >= 90) {
      return { color: 'success', text: 'Very High', emoji: '🟢' };
    } else if (confidence >= 80) {
      return { color: 'primary', text: 'High', emoji: '🔵' };
    } else if (confidence > 70) {
      return { color: 'warning', text: 'Medium', emoji: '🟡' };
    } else {
      return { color: 'danger', text: 'Low', emoji: '🔴' };
    }
  };

  // Disease management suggestions for ImagePredictor
  const getDiseaseManagementImage = (disease: string) => {
    const diseaseManagement: { [key: string]: any } = {
      'Blast': {
        sinhala: 'කොල පාලුව',
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
          'ආසාදිත ક්ෂේත්‍ර වලින් ජලය මගහරින්න',
          'නිසි පරතරයකින් රෝපණය',
          'පිරිසිදු බීජ භාවිතය'
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
    for (const [diseaseKey, management] of Object.entries(diseaseManagement)) {
      if (disease.toLowerCase().includes(diseaseKey.toLowerCase()) || 
          disease.includes(management.sinhala)) {
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

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult(null); // Reset to null
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

      const response = await axios.post(API_ENDPOINTS.IMAGE_PREDICT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Prediction response:', response.data);
      
      // Handle the response format - now using structured JSON response
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.confidence !== undefined && response.data.disease) {
        // New structured response format with confidence, disease, and message fields
        const confidence = response.data.confidence;
        const disease = response.data.disease;
        const message = response.data.message;
        
        console.log('Disease detected:', disease);
        console.log('Confidence level:', confidence);
        
        // If confidence is less than 40%, don't show disease prediction
        if (confidence < 40) {
          console.log('Low confidence detected:', confidence);
          const parsedResult = {
            disease: "Cannot identify disease", // Don't show actual disease
            confidence: confidence,
            message: "Cannot identify a disease. Please upload separate image. | රෝගයක් හඳුනාගත නොහැක. කරුණාකර වෙනත් ඡායාරූපයක් උඩුගත කරන්න.",
            lowConfidence: true // Flag to indicate low confidence
          };
          console.log('Low confidence result:', parsedResult);
          setResult(parsedResult);
          setShowValidation(false);
        } else {
          const parsedResult = {
            disease: disease, // Disease name from response
            confidence: confidence, // Confidence as number from response
            message: message, // Message from response
            originalDisease: disease // Keep original disease for validation comparison
          };
          console.log('Parsed result:', parsedResult);
          setResult(parsedResult);
          
          // Show validation questions if confidence is below 70%
          if (confidence < 70) {
            setShowValidation(true);
          } else {
            setShowValidation(false);
          }
        }
      } else if (response.data.result) {
        // Fallback for old string format (backward compatibility)
        const resultString = response.data.result;
        console.log('Using fallback parsing for result string:', resultString);
        
        // Extract disease name and confidence from the string format
        const diseaseMatch = resultString.match(/: (.+?) \((\d+\.?\d*)%\)/);
        if (diseaseMatch) {
          const confidence = parseFloat(diseaseMatch[2]);
          const disease = diseaseMatch[1];
          
          if (confidence < 40) {
            setResult({
              disease: "Cannot identify disease",
              confidence: confidence,
              message: "Cannot identify a disease. Please upload separate image. | රෝගයක් හඳුනාගත නොහැක. කරුණාකර වෙනත් ඡායාරූපයක් උඩුගත කරන්න.",
              lowConfidence: true
            });
            setShowValidation(false);
          } else {
            setResult({
              disease: disease,
              confidence: confidence,
              message: resultString,
              originalDisease: disease
            });
            setShowValidation(confidence < 70);
          }
        } else {
          setResult({
            disease: "Unknown",
            confidence: 0,
            message: resultString
          });
        }
      } else {
        setResult(response.data);
      }
    } catch (err) {
      setError('Failed to analyze the image. Please try again. | රූපය විශ්ලේෂණය කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null); // Reset to null
    setImagePreview(null);
    setError('');
    setShowValidation(false);
    setValidationAnswers({
      q1: '',
      q2: '',
      q21: '',
      q3: '',
      q4: '',
      q5: '',
      q6: ''
    });
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
                        <Alert variant={result.lowConfidence ? "warning" : "success"} className="text-center py-4">
                          <h4 className="mb-3">🎯 Analysis Results | විශ්ලේෂණ ප්‍රතිඵල</h4>
                          <div className="bg-white rounded p-4 border">
                            {result.lowConfidence ? (
                              <>
                                <h5 className="text-warning mb-3">⚠️ Low Confidence Detection | අඩු විශ්වාස හඳුනාගැනීම</h5>
                                <p className="h5 text-muted mb-3">{result.message}</p>
                                <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                                  <h6 className="text-warning mb-2">📋 Suggestions | යෝජනා:</h6>
                                  <ul className="text-start mb-0">
                                    <li>Upload a clearer image with better lighting | වඩා හොඳ ආලෝකයක් සහිත පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න</li>
                                    <li>Focus on the disease symptoms | රෝග ලක්ෂණ කෙරෙහි අවධානය යොමු කරන්න</li>
                                    <li>Ensure the leaf fills most of the image | පත්‍රය ඡායාරූපයේ වැඩි කොටසක් පුරවන්න</li>
                                    <li>Try a different angle or closer shot | වෙනත් කෝණයකින් හෝ ළඟින් ගන්න</li>
                                  </ul>
                                </div>
                              </>
                            ) : (
                              <>
                                <h5 className="text-success mb-3">Disease Prediction | රෝග අනාවැකිය:</h5>
                                <div className="mb-3">
                                  <p className="h3 text-dark mb-1">{result.disease || 'Unknown Disease'}</p>
                                  <p className="h5 text-muted mb-3">{getDiseaseNameSinhala(result.disease || 'Unknown Disease')}</p>
                                </div>
                              </>
                            )}
                            
                            {/* Confidence Display - only show if confidence exists and not low confidence */}
                            {result.confidence !== undefined && result.confidence > 0 && !result.lowConfidence && (
                              <div className="mb-3">
                                <h6 className="text-primary mb-2">Confidence Level | විශ්වාස මට්ටම:</h6>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                  <span className={`badge bg-${getConfidenceInfo(result.confidence).color} fs-6 me-3`}>
                                    {getConfidenceInfo(result.confidence).emoji} {result.confidence}%
                                  </span>
                                  <span className={`text-${getConfidenceInfo(result.confidence).color} fw-bold`}>
                                    {getConfidenceInfo(result.confidence).text} Confidence
                                  </span>
                                </div>
                                
                                {/* Confidence Progress Bar */}
                                <div className="progress mb-3" style={{ height: '25px' }}>
                                  <div 
                                    className={`progress-bar bg-${getConfidenceInfo(result.confidence).color}`}
                                    role="progressbar" 
                                    style={{ width: `${result.confidence}%` }}
                                    aria-valuenow={result.confidence} 
                                    aria-valuemin={0} 
                                    aria-valuemax={100}
                                  >
                                    {result.confidence}%
                                  </div>
                                </div>
                                
                                {/* Confidence Interpretation in Sinhala */}
                                <div className="text-muted small">
                                  {result.confidence >= 90 && "ඉතා ඉහළ විශ්වාසය - ප්‍රතිඵලය ඉතා විශ්වාසදායකයි"}
                                  {result.confidence >= 80 && result.confidence < 90 && "ඉහළ විශ්වාසය - ප්‍රතිඵලය විශ්වාසදායකයි"}
                                  {result.confidence > 70 && result.confidence < 75 && "මධ්‍යම විශ්වාසය - අමතර තහවුරුකිරීම සුදුසුයි"}
                                  {result.confidence < 60 && "අඩු විශ්වාසය - වෙනත් ඡායාරූපයක් උත්සාහ කරන්න"}
                                </div>
                              </div>
                            )}
                            
                            <p className="text-muted mt-3 small">
                              Based on AI analysis of the uploaded image | උඩුගත කරන ලද රූපයේ AI විශ්ලේෂණය මත පදනම්ව
                            </p>
                          </div>
                        </Alert>
                      )}

                      {/* Disease Management Section - Show when confidence > 70% */}
                      {result && result.confidence > 70 && (
                        <Card className="mt-4 border-success">
                          <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">🌾 Disease Management | රෝග කළමනාකරණය</h5>
                            <small>High confidence prediction - Management recommendations | ඉහළ විශ්වාස අනාවැකිය - කළමනාකරණ යෝජනා</small>
                          </Card.Header>
                          <Card.Body>
                            {(() => {
                              const management = getDiseaseManagementImage(result.disease);
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
                                    <li>Agricultural Extension Officer</li>
                                    <li>Plant Protection Service - 1920</li>
                                    <li>Rice Research Institute - 037-2229009</li>
                                  </ul>
                                </div>
                              </div>
                            </Alert>
                          </Card.Body>
                        </Card>
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

                {/* Validation Questions - Show when confidence is between 40-70% and not low confidence */}
                {showValidation && result && result.confidence >= 40 && result.confidence < 70 && !result.lowConfidence && (
                  <Row className="mt-4">
                    <Col>
                      <Card className="border-warning">
                        <Card.Header className="bg-warning text-dark">
                          <h5 className="mb-0">🔍 අමතර තහවුරුකිරීම | Additional Validation</h5>
                          <p className="mb-0 small">විශ්වාස මට්ටම අඩු නිසා කරුණාකර මෙම ප්‍රශ්න වලට පිළිතුරු දෙන්න</p>
                        </Card.Header>
                        <Card.Body className="p-4">
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">1. පත්‍රයේ පැහැය කුමක්ද?</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q1}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q1: e.target.value})}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="දුඹුරු">දුඹුරු</option>
                                  <option value="කොළ">කොළ</option>
                                  <option value="කහ">කහ</option>
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">2. පත්‍රයේ ලප තිබේද?</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q2}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q2: e.target.value})}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="ඔව්">ඔව්</option>
                                  <option value="නැහැ">නැහැ</option>
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">2.1. ලප වල පැහැය කුමක්ද?</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q21}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q21: e.target.value})}
                                  disabled={validationAnswers.q2 !== 'ඔව්'}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="දුඹුරු">දුඹුරු</option>
                                  <option value="අළු">අළු</option>
                                  <option value="සුදු">සුදු</option>
                                  <option value="නැත">නැත</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">3. පත්‍රවල තුවාල හැඩය</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q3}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q3: e.target.value})}
                                   disabled={validationAnswers.q2 !== 'ඔව්'}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="ඉරි">ඉරි</option>
                                  <option value="ඕවලාකාර">ඕවලාකාර</option>
                                  <option value="අක්‍රමවත්">අක්‍රමවත්</option>
                                  <option value="නැත">නැත</option>
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">4. පත්‍රය වියළීමක් පෙන්වයිද?</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q4}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q4: e.target.value})}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="ඔව්">ඔව්</option>
                                  <option value="නැහැ">නැහැ</option>
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">5. පත්‍රය මැලවීමක් පෙන්වයිද?</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q5}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q5: e.target.value})}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="ඔව්">ඔව්</option>
                                  <option value="නැහැ">නැහැ</option>
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">6. පත්‍රය වර්ධනය අඩු වීමක් පෙන්වයිද?</Form.Label>
                                <Form.Select 
                                  value={validationAnswers.q6}
                                  onChange={(e) => setValidationAnswers({...validationAnswers, q6: e.target.value})}
                                >
                                  <option value="">තෝරන්න...</option>
                                  <option value="ඔව්">ඔව්</option>
                                  <option value="නැහැ">නැහැ</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <div className="text-center mt-4">
                            <Button 
                              variant="warning" 
                              size="lg"
                              onClick={async () => {
                                setIsValidating(true);
                                
                                // Get rule-based prediction
                                const rulePrediction = predictDiseaseFromAnswers(validationAnswers);
                                console.log('Rule-based prediction:', rulePrediction);
                                console.log('AI prediction:', result.disease);
                                
                                // Compare predictions - use originalDisease if available for validation
                                const aiDisease = (result.originalDisease || result.disease).toLowerCase();
                                const ruleDisease = rulePrediction.toLowerCase();
                                
                                let validationMessage = '';
                                let isMatch = false;
                                
                                if (ruleDisease === aiDisease || 
                                    (aiDisease.includes('brown spot') && ruleDisease.includes('brown spot')) ||
                                    (aiDisease.includes('blast') && ruleDisease.includes('blast')) ||
                                    (aiDisease.includes('bacterial') && ruleDisease.includes('bacterial')) ||
                                    (aiDisease.includes('tungro') && ruleDisease.includes('tungro')) ||
                                    (aiDisease.includes('healthy') && ruleDisease.includes('healthy'))) {
                                  
                                  isMatch = true;
                                  validationMessage = `✅ තහවුරු කරන ලදි! | Confirmed!\n\nAI ප්‍රතිඵලය: ${result.originalDisease || result.disease}\nනීති පදනම් ප්‍රතිඵලය: ${rulePrediction}\n\nදෙකම එකම රෝගය පෙන්වයි. ප්‍රතිඵලය විශ්වාසදායකයි.`;
                                } else {
                                  validationMessage = `❌ නොගැලපේ | No Match!\n\nAI ප්‍රතිඵලය: ${result.originalDisease || result.disease}\nනීති පදනම් ප්‍රතිඵලය: ${rulePrediction}\n\nප්‍රතිඵල නොගැලපේ. කරුණාකර වෙනත් පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න.`;
                                }
                                
                                setValidationResult({
                                  aiPrediction: result.originalDisease || result.disease,
                                  rulePrediction: rulePrediction,
                                  isMatch: isMatch,
                                  message: validationMessage,
                                  answers: validationAnswers
                                });
                                
                                setIsValidating(false);
                               
                                
                                if (isMatch) {
                                  setShowValidation(false);
                                }
                              }}
                              disabled={(() => {
                                // Check if all required questions are answered
                                const requiredAnswers = [validationAnswers.q1, validationAnswers.q4, validationAnswers.q5, validationAnswers.q6];
                                const hasRequiredAnswers = requiredAnswers.every(answer => answer !== '');
                                
                                // Check if q2 is answered
                                const hasQ2Answer = validationAnswers.q2 !== '';
                                
                                // If q2 is "ඔව්", then q21 and q3 are also required
                                if (validationAnswers.q2 === 'ඔව්') {
                                  const hasSpotAnswers = validationAnswers.q21 !== '' && validationAnswers.q3 !== '';
                                  return !hasRequiredAnswers || !hasQ2Answer || !hasSpotAnswers || isValidating;
                                }
                                
                                // If q2 is "නැහැ", q21 and q3 are not required
                                return !hasRequiredAnswers || !hasQ2Answer || isValidating;
                              })()}
                            >
                              {isValidating ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  විශ්ලේෂණය කරමින්...
                                </>
                              ) : (
                                '✅ ප්‍රශ්නවලට පිළිතුරු ලබාදී තහවුරු කරන්න'
                              )}
                            </Button>
                            <div className="mt-2">
                              <small className="text-muted">
                                {validationAnswers.q2 === 'නැහැ' 
                                  ? 'ප්‍රධාන ප්‍රශ්න වලට පිළිතුරු දීමෙන් පසු බොත්තම සක්‍රීය වේ (2.1 සහ 3 අවශ්‍ය නැත)'
                                  : validationAnswers.q2 === 'ඔව්'
                                    ? 'සියලු ප්‍රශ්නවලට පිළිතුරු දීමෙන් පසු බොත්තම සක්‍රීය වේ'
                                    : 'සියලු ප්‍රශ්නවලට පිළිතුරු දීමෙන් පසු බොත්තම සක්‍රීය වේ'
                                }
                              </small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* Validation Results */}
                {validationResult && (
                  <Row className="mt-4">
                    <Col>
                      <Card className="border-primary">
                        <Card.Header className={`text-white ${validationResult.isMatch ? 'bg-success' : 'bg-warning'}`}>
                          <h5 className="mb-0">
                            {validationResult.isMatch ? '✅ සත්‍යාපන ප්‍රතිඵලය | Validation Result' : '⚠️ සත්‍යාපන ප්‍රතිඵලය | Validation Result'}
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="row">
                            <div className="col-md-6">
                              <h6>🤖 AI ප්‍රතිඵලය | AI Prediction:</h6>
                              <p className="text-primary fw-bold">{validationResult.aiPrediction}</p>
                            </div>
                            <div className="col-md-6">
                              <h6>📋 නීති පදනම් ප්‍රතිඵලය | Rule-based Prediction:</h6>
                              <p className="text-info fw-bold">{validationResult.rulePrediction}</p>
                            </div>
                          </div>
                          
                          <Alert variant={validationResult.isMatch ? 'success' : 'warning'} className="mt-3">
                            <div style={{ whiteSpace: 'pre-line' }}>
                              {validationResult.message}
                            </div>
                          </Alert>
                          
                          {!validationResult.isMatch && (
                            <div className="text-center mt-3">
                              <Button 
                                variant="primary" 
                                onClick={() => {
                                  setResult(null);
                                  setValidationResult(null);
                                  setShowValidation(false);
                                  setValidationAnswers({
                                    q1: '',
                                    q2: '',
                                    q21: '',
                                    q3: '',
                                    q4: '',
                                    q5: '',
                                    q6: ''
                                  });
                                }}
                              >
                                🔄 නව ඡායාරූපයක් උඩුගත කරන්න | Upload New Image
                              </Button>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
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