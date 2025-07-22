import { useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';

const SinhalaPredictor = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/sinhala-text-predict', {
                input_text: input,
            });

            console.log('🔤 Full Response:', res.data);

            // Extract the translated text from the result
            const result = res.data.result;

            // Handle both success and error cases for translation
            let translatedText = 'Translation not found';

            // First try to match the success format: "🌐 Translated: ..."
            const translatedMatch = result.match(/Translated:\s*(.+)/);

            // If not found, try to match the error format: "\nTranslated: ..."
            if (translatedMatch) {
                translatedText = translatedMatch[1];
            }

            console.log('🔤 Translated English text:===>', translatedText);

            // 🎯 Log the final result (Sinhala + English disease prediction)
            console.log('🧠 Final Prediction Result:', result);
            setResult(result);
        } catch (err) {
            console.error(err);
            setResult('❌ Prediction failed.');
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
                    <Col lg={10} xl={10}>
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