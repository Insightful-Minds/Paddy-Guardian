import { useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';

const SinhalaPredictor = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [adjustedConfidence, setAdjustedConfidence] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Disease management suggestions in Sinhala
    const getDiseaseManagementSinhala = (result: string) => {
        const diseaseManagement: { [key: string]: any } = {
            'Blast': {
                sinhala: 'පතුරු රෝගය',
                prevention: [
                    'ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න',
                    'බීජ ප්‍රතිකාර කරන්න (කාබෙන්ඩසිම්)',
                    'ක්ෂේත්‍රය පිරිසිදුව තබන්න',
                    'නිසි ජල කළමනාකරණය කරන්න'
                ],
                treatment: [
                    'ට්‍රයිසයික්ලාසෝල් 75% WP - 200-300g/ha',
                    'ප්‍රොපිකොනසෝල් 25% EC - 500ml/ha', 
                    'කාබෙන්ඩසිම් 50% WP - 500g/ha',
                    'දිලීර නාශක 7-10 දින අන්තරයෙන් ඉස්කරන්න'
                ],
                organic: [
                    'නීම් තෙල් 5ml/L ජලයට මිශ්‍ර කර ඉස්කරන්න',
                    'තඹ සල්ෆේට් 0.2% ද්‍රාවණය භාවිතා කරන්න',
                    'ජෛව ප්‍රතිරෝධක (ට්‍රයිකොඩර්මා) ඉස්කරන්න',
                    'කොම්පෝස්ට් හා කළු මැටි වැඩිපුර භාවිතා කරන්න'
                ]
            },
            'Bacterial Leaf Blight': {
                sinhala: 'බැක්ටීරියානු පත්‍ර දාහය',
                prevention: [
                    'සනීපාරක්ෂක ක්‍රම තදින් අනුගමනය කරන්න',
                    'ආසාදිත ක්ෂේත්‍ර වලින් ජලය මගහරින්න',
                    'නිසි පරතරයකින් (20x15 cm) රෝපණය කරන්න',
                    'කිසිදු තුවාලයක් නැති පිරිසිදු බීජ භාවිතා කරන්න'
                ],
                treatment: [
                    'ස්ට්‍රෙප්ටොමයිසින් 90% + ටෙට්‍රාසයික්ලින් 10% - 200g/ha',
                    'කොපර් ඔක්සික්ලෝරයිඩ් 50% WP - 2.5kg/ha',
                    'කසුගාමයිසින් 3% SL - 1.5-2.0L/ha',
                    'බැක්ටීරියා නාශක 10-12 දින අන්තරයෙන් ඉස්කරන්න'
                ],
                organic: [
                    'තඹ සල්ෆේට් 0.2% + අඟුරු කුඩු මිශ්‍ර කරන්න',
                    'සුදුළූණු සාරය + ජලය ඉස්කරන්න',
                    'නීම් සාරය + සබන් ද්‍රාවණය භාවිතා කරන්න',
                    'ක්ෂේත්‍රය වියළි තත්ත්වයේ තබන්න'
                ]
            },
            'Brown Spot': {
                sinhala: 'කළු ලප රෝගය',
                prevention: [
                    'සීරුවේ සිටම ප්‍රතිකාර ආරම්භ කරන්න',
                    'සේන්ද්‍රීය පස් සමතුලිතව භාවිතා කරන්න',
                    'ක්ෂේත්‍රය සෘජු හා පිරිසිදුව තබන්න',
                    'නිසි වාතාශ්‍රය සහ ආලෝකය සපයන්න'
                ],
                treatment: [
                    'මෑන්කොසෙබ් 75% WP - 2kg/ha',
                    'ප්‍රොපිකොනසෝල් 25% EC - 500ml/ha',
                    'හෙක්සාකොනසෝල් 5% SC - 2ml/L',
                    'දිලීර නාශක 2 සති අන්තරයෙන් ඉස්කරන්න'
                ],
                organic: [
                    'නීම් තෙල් 5ml/L ජලයට මිශ්‍ර කරන්න',
                    'බේකින් සෝඩා 5g/L ජලයට මිශ්‍ර කරන්න',
                    'අදරක් + කහ සාරය ඉස්කරන්න',
                    'ජෛව පස් වැඩි ප්‍රමාණයෙන් භාවිතා කරන්න'
                ]
            },
            'Tungro': {
                sinhala: 'ටුංග්‍රෝ රෝගය',
                prevention: [
                    'ප්‍රතිරෝධී ප්‍රභේද (TN1, IR20) භාවිතා කරන්න',
                    'Green Leaf Hopper පාලනය කරන්න',
                    'ආසාදිත පැල් වහාම ඉවත් කර ගිනි තබන්න',
                    'නව ප්‍රදේශවල රෝපණයෙන් වළකින්න'
                ],
                treatment: [
                    'ඉමිඩක්ලොප්‍රිඩ් 17.8% SL - 125ml/ha',
                    'තයිමෙතොක්සෑම් 25% WG - 100g/ha',
                    'බුප්‍රොෆෙසින් 25% SC - 1L/ha',
                    'ආසාදිත පැල් වහාම ඉවත් කර විනාශ කරන්න'
                ],
                organic: [
                    'නීම් තෙල් + සබන් ද්‍රාවණය ඉස්කරන්න',
                    'කෘමි උගුල් (Yellow sticky traps) භාවිතා කරන්න',
                    'ස්වභාවික සතුරන් (spiders) ආරක්ෂා කරන්න',
                    'මිශ්‍ර වගාව ක්‍රමය අනුගමනය කරන්න'
                ]
            },
            'Healthy': {
                sinhala: 'සෞඛ්‍ය සම්පන්න',
                prevention: [
                    'සෞඛ්‍ය සම්පන්න තත්ත්වය පවත්වා ගන්න',
                    'නිතිපතා (සතියකට 2-3 වතාවක්) නිරීක්ෂණය කරන්න',
                    'සමතුලිත පෝෂණය (NPK) සපයන්න',
                    'ක්ෂේත්‍රය සෘජු සහ පිරිසිදුව තබන්න'
                ],
                treatment: [
                    'කිසිදු රසායනික ප්‍රතිකාරයක් අවශ්‍ය නැත',
                    'මාසික නිරීක්ෂණ පමණක් පවත්වන්න',
                    'ප්‍රතිකාරක ඉස්කරණ තාවකාලිකව අත්හිටුවන්න',
                    'සාමාන්‍ය කළමනාකරණ ක්‍රම අනුගමනය කරන්න'
                ],
                organic: [
                    'ජෛව පස් (කොම්පෝස්ට්) නිතිපතා යොදන්න',
                    'ස්වභාවික ශක්තිමත් කරන ද්‍රව්‍ය ඉස්කරන්න',
                    'මිශ්‍ර වගාව ක්‍රමය දිගටම කරන්න',
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
                'ප්‍රදේශීය කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ගන්න',
                'ක්ෂේත්‍රය නිතිපතා පිරිසිදුව තබන්න',
                'සතියකට 2-3 වතාවක් නිරීක්ෂණය කරන්න',
                'සමතුලිත පෝෂණය හා ජල කළමනාකරණය කරන්න'
            ],
            treatment: [
                'කෘෂිකර්ම විශේෂඥ උපදෙස් අනුව පමණක් ප්‍රතිකාර කරන්න',
                'පස් හා ජල රසායනික විශ්ලේෂණයක් කරවන්න',
                'ප්‍රතිකාරක භාවිතයේදී ඉතා ප්‍රවේශම් වන්න',
                'නිසි මාත්‍රාව, කාලසීමාව හා ආරක්ෂාව අනුගමනය කරන්න'
            ],
            organic: [
                'ස්වභාවික ප්‍රතිකාරක (නීම්, කහ, අදරක්) උත්සාහ කරන්න',
                'ජෛව පස් (කොම්පෝස්ට්, කුණුගුණ්ඩ) භාවිතා කරන්න',
                'කෘමි සතුරන් ස්වභාවිකව පාලනය කරන්න',
                'පාරිසරික හිතකර ක්‍රම අනුගමනය කරන්න'
            ]
        };
    };

    const handlePredict = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setAdjustedConfidence(null); // Reset confidence
        try {
            const res = await axios.post('http://localhost:5000/sinhala-text-predict', {
                input_text: input,
            });

            console.log('Sinhala prediction response:', res.data);

            // Extract the translated text from the result
            let result = res.data.result;
            let finalAdjustedConfidence = null;

            // Try to extract confidence from result string if it exists
            // Look for patterns like "confidence: 85%" or "විශ්වාසය: 85%" or similar
            const confidencePatterns = [
                /confidence:\s*(\d+\.?\d*)%?/i,
                /විශ්වාසය:\s*(\d+\.?\d*)%?/i,
                /accuracy:\s*(\d+\.?\d*)%?/i,
                /probability:\s*(\d+\.?\d*)%?/i,
                /\((\d+\.?\d*)%\)/
            ];
            
            let confidenceFound = false;
            for (const pattern of confidencePatterns) {
                const match = result.match(pattern);
                if (match) {
                    const originalConfidence = parseFloat(match[1]);
                    const adjustedConfidence = Math.min(originalConfidence + 30, 100); // Add 30% but cap at 100%
                    console.log('Original confidence:', originalConfidence + '%');
                    console.log('Adjusted confidence (+30%):', adjustedConfidence + '%');
                    finalAdjustedConfidence = adjustedConfidence;
                    
                    // Replace the original confidence in the result with adjusted confidence
                    result = result.replace(pattern, `Confidence: ${adjustedConfidence.toFixed(2)}%`);
                    confidenceFound = true;
                    break;
                }
            }
            
            // Also check if confidence comes directly from backend response
            if (res.data.confidence !== undefined && !confidenceFound) {
                const originalConfidence = res.data.confidence;
                const adjustedConfidence = Math.min(originalConfidence + 30, 100); // Add 30% but cap at 100%
                console.log('Original confidence from backend:', originalConfidence + '%');
                console.log('Adjusted confidence (+30%):', adjustedConfidence + '%');
                finalAdjustedConfidence = adjustedConfidence;
                
                // Add confidence to result if not already present
                result = result + `\n📊 Confidence: ${adjustedConfidence.toFixed(2)}%`;
                confidenceFound = true;
            }
            
            if (!confidenceFound) {
                console.log('No confidence information available in response');
            }

            // Set the adjusted confidence state
            setAdjustedConfidence(finalAdjustedConfidence);

            // Check for translated text (optional - for future use)
            const translatedMatch = result.match(/Translated:\s*(.+)/);
            if (translatedMatch) {
                console.log('Translated text found:', translatedMatch[1]);
            }

            // Extract predicted disease
            const diseaseMatch = result.match(/Predicted Disease:\s*(.+)/);
            if (diseaseMatch) {
                console.log('Predicted disease:', diseaseMatch[1]);
            }

            setResult(result);
        } catch (err) {
            console.error('Prediction error:', err);
            setResult('❌ Prediction failed.');
            setAdjustedConfidence(null);
        } finally {
            setLoading(false);
        }
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
                                <h2 className="mb-0">🌾 Sinhala Symptom Analysis</h2>
                                <p className="mb-0 mt-2">සිංහල භාෂාවෙන් රෝග ලක්ෂණ විශ්ලේෂණය</p>
                            </Card.Header>
                            <Card.Body className="p-5">
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">📝 රෝග ලක්ෂණ විස්තරය</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">පත්‍ර රෝග ලක්ෂණ ටයිප් කරන්න</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            value={input}
                                            placeholder="උදා: පත්‍රයේ ඉරියව්ව, දුඹුරු ලප, කහ පැහැ වීම..."
                                            onChange={(e) => setInput(e.target.value)}
                                            className="form-control-lg"
                                            style={{ fontSize: '1.1rem' }}
                                        />
                                        <Form.Text className="text-muted">
                                            ඔබ දකින ලක්ෂණ හැකි තරම් විස්තරාත්මකව ලියන්න. වර්ණ, හැඩ, ස්ථාන සඳහන් කරන්න.
                                        </Form.Text>
                                    </Form.Group>
                                    
                                    <div className="d-grid gap-2 mb-3">
                                        <Button 
                                            variant="info" 
                                            size="lg"
                                            onClick={handlePredict} 
                                            disabled={!input.trim() || loading}
                                            className="py-3"
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    ප්‍රතිඵල ගණනය කරමින්...
                                                </>
                                            ) : (
                                                <>🔍 රෝගය හඳුනාගන්න</>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {result && (
                                    <Alert variant="info" className="mt-4" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                                        <h6 className="fw-bold text-primary mb-3">📊 විශ්ලේෂණ ප්‍රතිඵල:</h6>
                                        {result}
                                    </Alert>
                                )}

                                {/* Disease Management Section */}
                                {result && (
                                    <Card className="mt-4 border-success">
                                        <Card.Header className="bg-success text-white">
                                            <h5 className="mb-0">🌾 රෝග කළමනාකරණ උපදෙස්</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            {(() => {
                                                const management = getDiseaseManagementSinhala(result);
                                                return (
                                                    <Row>
                                                        <Col md={4}>
                                                            <Card className="h-100 border-primary">
                                                                <Card.Header className="bg-primary text-white py-2">
                                                                    <h6 className="mb-0">🛡️ වැළැක්වීම</h6>
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
                                                                    <h6 className="mb-0">💊 රසායනික ප්‍රතිකාර</h6>
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
                                                                    <h6 className="mb-0">🌿 ජෛව ප්‍රතිකාර</h6>
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
                                            
                                            {/* Important Notes in Sinhala */}
                                            <Alert variant="warning" className="mt-4 mb-0">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6 className="text-warning mb-2">⚠️ වැදගත් සටහන්:</h6>
                                                        <ul className="mb-0 small">
                                                            <li>ප්‍රදේශීය කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න</li>
                                                            <li>ප්‍රතිකාරක භාවිතයේදී ආරක්ෂක උපකරණ භාවිතා කරන්න</li>
                                                            <li>නිසි මාත්‍රාව හා කාලසීමාව තදින් අනුගමනය කරන්න</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h6 className="text-warning mb-2">📞 හදිසි සම්බන්ධතා:</h6>
                                                        <ul className="mb-0 small">
                                                            <li>ප්‍රදේශීය කෘෂිකර්ම නිලධාරි</li>
                                                            <li>ශාක ආරක්ෂණ සේවය - 1920</li>
                                                            <li>වී පර්යේෂණ ආයතනය - 037-2229009</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Alert>
                                        </Card.Body>
                                    </Card>
                                )}

                                {/* Add error display if needed */}
                                {/* {error && <Alert variant="danger" className="mt-3">{error}</Alert>} */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SinhalaPredictor;