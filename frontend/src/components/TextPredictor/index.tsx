import { useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';

const TextDiseasePredictor = () => {
  const [text, setText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId] = useState(`user_${Math.floor(Math.random() * 1000000)}`); // unique per session

  const handleChatSend = async () => {
    if (!text.trim()) {
      setError('කරුණාකර පණිවිඩයක් ඇතුළත් කරන්න.');
      return;
    }

    setLoading(true);
    setError('');
    const userMsg = text.trim();

    // Append user's message
    setChatHistory(prev => [...prev, { role: 'user', message: userMsg }]);
    setText('');

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        user_id: userId,
        message: userMsg
      });

      const botMsg = response.data.response;
      const followUps = response.data.questions;

      // Append bot's message + follow-up questions if any
      setChatHistory(prev => [
        ...prev,
        { role: 'bot', message: botMsg },
        ...(followUps ? followUps.map((q: string) => ({ role: 'bot', message: `👉 ${q}` })) : [])
      ]);
    } catch (err) {
      console.error(err);
      setError("❌ සම්බන්ධ වීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setText('');
    setChatHistory([]);
    setError('');
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
                <h2 className="mb-0">🤖 Paddy Disease Chatbot</h2>
                <h4 className="mb-0 mt-2">සිංහල භාෂාවෙන් රෝග හඳුනාගැනීම</h4>
              </Card.Header>

              <Card.Body className="p-4">
                {/* Chat History */}
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '0.5rem', background: '#f8f9fa' }}>
                  {chatHistory.length === 0 && <p className="text-muted">👋 ඔබේ රෝග ලක්ෂණ මෙහි ලියන්න...</p>}
                  {chatHistory.map((entry, idx) => (
                    <div key={idx} className={`mb-2 ${entry.role === 'user' ? 'text-end' : 'text-start'}`}>
                      <span 
                        className={`px-3 py-2 rounded d-inline-block ${entry.role === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                        style={{ maxWidth: '80%' }}
                      >
                        {entry.message}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Input Box */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">✍️ ඔබේ පණිවිඩය ලියන්න</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={text}
                    placeholder="e.g., පත්‍ර කහ පැහැයෙන් යුක්තව ලප සහිත වේ..."
                    onChange={(e) => setText(e.target.value)}
                    className="form-control-lg"
                    style={{ fontSize: '1.05rem' }}
                  />
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <Button 
                    variant="success"
                    onClick={handleChatSend}
                    disabled={!text.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        විශ්ලේෂණය කරමින්...
                      </>
                    ) : (
                      <>📨 යවන්න</>
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={resetChat}
                    disabled={loading}
                  >
                    🔄 නව චැට් එකක් ආරම්භ කරන්න
                  </Button>
                </div>

                {/* Error */}
                {error && (
                  <Alert variant="danger" className="mt-3 text-center">
                    {error}
                  </Alert>
                )}

                {/* Examples */}
                <hr />
                <h6 className="text-muted">🧪 උදාහරණ</h6>
                <div className="d-flex flex-wrap gap-2">
                  {symptomExamples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TextDiseasePredictor;
