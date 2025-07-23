import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Alert, Row, Col, Spinner, Badge } from 'react-bootstrap';
import bgimg from '../../assets/bg-img.jpg';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  translation?: string;
  confidence?: number;
  disease?: string;
  isTyping?: boolean;
}

interface SymptomAnalysis {
  symptoms: string[];
  confidence: number;
  suggestedQuestions: string[];
}

const TextDiseasePredictor = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'ආයුබෝවන්! මම පැදි රෝග හඳුනාගැනීමේ AI සහායකයා. ඔබේ වී පත්‍රවල දක්නා ලක්ෂණ සිංහලෙන් හෝ ඉංග්‍රීසියෙන් විස්තර කරන්න.\n\nHello! I\'m your AI paddy disease detection assistant. Please describe the symptoms you see on your rice leaves in Sinhala or English.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [serverStatus, setServerStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<SymptomAnalysis>({
    symptoms: [],
    confidence: 0,
    suggestedQuestions: []
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check server status on component mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/', { timeout: 3000 });
        if (response.status === 200) {
          setServerStatus('connected');
        }
      } catch (error) {
        setServerStatus('disconnected');
        console.warn('Server not reachable:', error);
      }
    };
    
    checkServerStatus();
  }, []);

  // Detect if input is primarily Sinhala
  const isSinhalaText = (text: string): boolean => {
    const sinhalaCharCount = (text.match(/[\u0D80-\u0DFF]/g) || []).length;
    return sinhalaCharCount > text.length * 0.3; // If >30% Sinhala characters
  };

  // Enhanced symptom extraction and analysis
  const analyzeSymptoms = (text: string, translation?: string): SymptomAnalysis => {
    const analysisText = translation || text;
    const symptoms: string[] = [];
    let confidence = 0;
    
    // Symptom keywords and their confidence weights
    const symptomKeywords = {
      color: { keywords: ['yellow', 'brown', 'black', 'white', 'gray', 'green', 'කහ', 'දුම්', 'කළු', 'සුදු', 'අළු', 'කොළ'], weight: 20 },
      spots: { keywords: ['spot', 'patch', 'lesion', 'mark', 'ලප', 'තුවාල', 'කැලැල්', 'ලකුණ'], weight: 25 },
      shape: { keywords: ['circular', 'oval', 'diamond', 'irregular', 'round', 'වෘත්තාකාර', 'ඕවලාකාර', 'අක්‍රමවත්'], weight: 15 },
      texture: { keywords: ['dry', 'wet', 'wilted', 'crispy', 'soft', 'වියළි', 'තෙත්', 'මැලවුණු', 'හැපෙනවා'], weight: 20 },
      severity: { keywords: ['severe', 'mild', 'spreading', 'small', 'large', 'ප්‍රබල', 'සාමාන්‍ය', 'පැතිරෙන', 'කුඩා', 'විශාල'], weight: 20 }
    };

    // Extract symptoms
    for (const [category, data] of Object.entries(symptomKeywords)) {
      const foundKeywords = data.keywords.filter(keyword => 
        analysisText.toLowerCase().includes(keyword.toLowerCase())
      );
      if (foundKeywords.length > 0) {
        symptoms.push(`${category}: ${foundKeywords.join(', ')}`);
        confidence += data.weight * Math.min(foundKeywords.length, 2); // Cap at 2x weight
      }
    }

    // Generate suggested follow-up questions based on missing information
    const suggestedQuestions: string[] = [];
    if (!symptoms.some(s => s.includes('color'))) {
      suggestedQuestions.push('පත්‍රයේ පැහැය කුමක්ද? / What color are the leaves?');
    }
    if (!symptoms.some(s => s.includes('spots'))) {
      suggestedQuestions.push('ලප හෝ තුවාල තිබේද? / Are there any spots or lesions?');
    }
    if (!symptoms.some(s => s.includes('shape'))) {
      suggestedQuestions.push('ලප වල හැඩය කුමක්ද? / What is the shape of the spots?');
    }

    return {
      symptoms,
      confidence: Math.min(confidence, 100),
      suggestedQuestions: suggestedQuestions.slice(0, 2) // Limit to 2 questions
    };
  };

  // Add typing indicator
  const addTypingIndicator = () => {
    const typingMessage: ChatMessage = {
      id: Date.now().toString(),
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
    return typingMessage.id;
  };

  // Remove typing indicator
  const removeTypingIndicator = (typingId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== typingId));
  };

  // Add bot message
  const addBotMessage = (text: string, translation?: string, disease?: string, confidence?: number) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      translation,
      disease,
      confidence
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Enhanced message processing
  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentInput.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const typingId = addTypingIndicator();

    try {
      const isSinhala = isSinhalaText(currentInput);
      
      let response;
      let data;
      
      try {
        // Try the new enhanced chatbot endpoint first
        response = await axios.post('http://localhost:5000/chatbot-predict', {
          input_text: currentInput.trim(),
          is_sinhala: isSinhala
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        });
        data = response.data;
      } catch (enhancedError) {
        console.warn('Enhanced endpoint failed, falling back to basic endpoint:', enhancedError);
        
        // Fallback to the original endpoints
        const endpoint = isSinhala ? '/sinhala-text-predict' : '/text-predict';
        response = await axios.post(`http://localhost:5000${endpoint}`, {
          input_text: currentInput.trim()
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        });
        
        // Convert old format to new format
        const result = response.data.result;
        data = {
          success: true,
          message: result,
          confidence: 75, // Default confidence for fallback
          disease: 'Unknown',
          symptoms_identified: [],
          translation: null
        };
        
        // Try to extract disease from old format
        if (result.includes('Predicted Disease:')) {
          const diseaseMatch = result.match(/✅ Predicted Disease: (.+?)(?=\n|$)/);
          if (diseaseMatch) {
            data.disease = diseaseMatch[1];
          }
        }
        
        // Try to extract translation from old format
        if (result.includes('Translated:')) {
          const translationMatch = result.match(/🌐 Translated: (.+?)(?=\n|$)/);
          if (translationMatch) {
            data.translation = translationMatch[1];
          }
        }
      }

      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      removeTypingIndicator(typingId);

      if (data.error) {
        addBotMessage(data.message);
        return;
      }

      // Analyze symptoms for follow-up questions
      const analysis = analyzeSymptoms(currentInput, data.translation);
      setConversationContext(prev => ({
        symptoms: [...prev.symptoms, ...data.symptoms_identified],
        confidence: data.confidence,
        suggestedQuestions: analysis.suggestedQuestions
      }));

      // Enhanced bot response
      let botResponse = data.message;
      
      if (data.translation) {
        botResponse += `\n\n🌐 පරිවර්තනය: ${data.translation}`;
      }

      if (data.symptoms_identified && data.symptoms_identified.length > 0) {
        botResponse += '\n\n� හඳුනාගත් ලක්ෂණ:\n';
        data.symptoms_identified.forEach((symptom: string) => {
          botResponse += `• ${symptom}\n`;
        });
      }

      if (data.confidence < 70 && analysis.suggestedQuestions.length > 0) {
        botResponse += '\n\n🤔 වඩා හොඳ ප්‍රතිඵලයක් සඳහා:\n';
        analysis.suggestedQuestions.forEach((q: string, i: number) => {
          botResponse += `${i + 1}. ${q}\n`;
        });
      }

      // Provide treatment suggestions based on disease
      const treatmentSuggestions = getTreatmentSuggestions(data.disease);
      if (treatmentSuggestions) {
        botResponse += `\n\n💊 ප්‍රතිකාර යෝජනා:\n${treatmentSuggestions}`;
      }

      addBotMessage(botResponse, data.translation, data.disease, data.confidence);

    } catch (error) {
      removeTypingIndicator(typingId);
      console.error('All prediction endpoints failed:', error);
      
      let errorMessage = '❌ සමාවන්න, දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.\nSorry, an error occurred. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          errorMessage = '🔌 සර්වරය සම්බන්ධ නොවේ. කරුණාකර සර්වරය ධාවනය වන්නේදැයි පරීක්ෂා කරන්න.\n🔌 Cannot connect to server. Please check if the server is running.';
        } else if (error.response?.status === 404) {
          errorMessage = '📍 API endpoint සොයාගත නොහැක. Backend නිවැරදිව configure කර ඇත්දැයි පරීක්ෂා කරන්න.\n📍 API endpoint not found. Please check if backend is properly configured.';
        } else if (error.response?.status === 0 || error.message.includes('CORS')) {
          errorMessage = '🚫 CORS දෝෂයක්. Backend CORS සැකසුම් පරීක්ෂා කරන්න.\n🚫 CORS error. Please check backend CORS configuration.';
        }
      }
      
      addBotMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setCurrentInput('');
    }
  };

  // Treatment suggestions based on disease
  const getTreatmentSuggestions = (disease: string): string => {
    const treatments: { [key: string]: string } = {
      'Blast': '• දිලීර නාශක ඉසින්න\n• ජලය කළමනාකරණය කරන්න\n• ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න',
      'Bacterial Blight': '• තඹ පදනම් ඔවදන භාවිතා කරන්න\n• ක්ෂේත්‍රය වියළි තබන්න\n• සනීපාරක්ෂක පියවර ගන්න',
      'Brown Spot': '• සේන්ද්‍රීය පස් අඩු කරන්න\n• ක්ෂේත්‍රය පිරිසිදු තබන්න\n• දිලීර නාශක ඉස්කරන්න',
      'Tungro': '• ආසාදිත පැල් ඉවත් කරන්න\n• පළිබෝධ කෙරෙහි අවධානය\n• නව බීජ භාවිතා කරන්න'
    };
    
    return treatments[disease] || '• කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ගන්න\n• නිසි ජල කළමනාකරණය\n• නිතිපතා පරීක්ෂා කරන්න';
  };

  // Quick suggestion buttons
  const quickSuggestions = [
    { text: 'පත්‍ර කහ වී ඇත', emoji: '🟡' },
    { text: 'දුම් පැහැති ලප තිබේ', emoji: '🔵' },
    { text: 'කළු තුවාල දකිනවා', emoji: '⚫' },
    { text: 'පත්‍ර වියළී ගිය', emoji: '🍂' },
    { text: 'ලප වර්ධනය වෙනවා', emoji: '📈' }
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setCurrentInput(suggestion);
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'danger';
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
          <Col lg={10} xl={8}>
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Header className="bg-info text-white text-center py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ minWidth: '100px' }}>
                    <Badge 
                      bg={serverStatus === 'connected' ? 'success' : serverStatus === 'disconnected' ? 'danger' : 'secondary'}
                      className="small"
                    >
                      {serverStatus === 'connected' ? '🟢 Online' : serverStatus === 'disconnected' ? '🔴 Offline' : '⚪ Checking...'}
                    </Badge>
                  </div>
                  <div className="text-center flex-grow-1">
                    <h2 className="mb-0">🤖 AI Chatbot for Disease Detection</h2>
                    <h3 className="mb-0 mt-2">🗣️ රෝග හඳුනාගැනීමේ AI සහායකයා</h3>
                    <p className="mb-0 mt-2">Chat in Sinhala or English about your paddy symptoms</p>
                    <p className="mb-0 mt-1 small">ඔබේ වී පත්‍රවල ලක්ෂණ ගැන සිංහලෙන් හෝ ඉංග්‍රීසියෙන් කතා කරන්න</p>
                  </div>
                  <div style={{ minWidth: '100px' }}></div>
                </div>
              </Card.Header>
              
              <Card.Body className="p-4">
                {/* Chat Messages */}
                <div 
                  className="chat-container border rounded-3 p-3 mb-4"
                  style={{ 
                    height: '400px', 
                    overflowY: 'auto',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                      <div
                        className={`rounded-3 px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white border'
                        }`}
                        style={{ 
                          maxWidth: '75%',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {message.isTyping ? (
                          <div className="d-flex align-items-center">
                            <Spinner animation="grow" size="sm" className="me-2" />
                            <small>AI සහායකයා ටයිප් කරමින්...</small>
                          </div>
                        ) : (
                          <>
                            <div>{message.text}</div>
                            {message.confidence && (
                              <div className="mt-2">
                                <Badge bg={getConfidenceColor(message.confidence)}>
                                  විශ්වාසය: {message.confidence}%
                                </Badge>
                              </div>
                            )}
                            <small className="text-muted d-block mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </small>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Suggestions */}
                <div className="mb-3">
                  <small className="text-muted mb-2 d-block">💡 ඉක්මන් යෝජනා / Quick Suggestions:</small>
                  <div className="d-flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleQuickSuggestion(suggestion.text)}
                        disabled={isLoading}
                      >
                        {suggestion.emoji} {suggestion.text}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          placeholder="ඔබේ වී පත්‍රවල ලක්ෂණ විස්තර කරන්න... / Describe your paddy leaf symptoms..."
                          disabled={isLoading}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          style={{ resize: 'none' }}
                        />
                        <Button
                          variant="primary"
                          onClick={handleSendMessage}
                          disabled={!currentInput.trim() || isLoading}
                          className="px-4"
                        >
                          {isLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            '📤 යවන්න'
                          )}
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Shift+Enter නව පේළියක් සඳහා, Enter යැවීමට / Shift+Enter for new line, Enter to send
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Current Context Display */}
                {conversationContext.symptoms.length > 0 && (
                  <Alert variant="info" className="mb-4">
                    <h6>🔍 දැනට හඳුනාගත් ලක්ෂණ / Currently Identified Symptoms:</h6>
                    <ul className="mb-2">
                      {conversationContext.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <Badge bg={getConfidenceColor(conversationContext.confidence)}>
                        විශ්ලේෂණ විශ්වාසය: {conversationContext.confidence}%
                      </Badge>
                    </div>
                  </Alert>
                )}

                {/* Instructions */}
                <Row className="mt-4">
                  <Col>
                    <Card className="border-success">
                      <Card.Body>
                        <h6 className="text-success mb-3">� චැට් කරන ආකාරය / How to Chat:</h6>
                        <Row>
                          <Col md={6}>
                            <h6 className="text-primary mb-2">🇱🇰 සිංහලෙන්:</h6>
                            <ul className="list-unstyled small">
                              <li>• "පත්‍ර කහ වී ඇත"</li>
                              <li>• "කළු ලප දකිනවා"</li>
                              <li>• "පත්‍ර වියළී ගිය"</li>
                              <li>• "දුම් පැහැති තුවාල"</li>
                            </ul>
                          </Col>
                          <Col md={6}>
                            <h6 className="text-primary mb-2">🇬🇧 In English:</h6>
                            <ul className="list-unstyled small">
                              <li>• "Leaves are yellowing"</li>
                              <li>• "Black spots visible"</li>
                              <li>• "Leaves are wilting"</li>
                              <li>• "Grayish lesions"</li>
                            </ul>
                          </Col>
                        </Row>
                        <Alert variant="light" className="mt-3 mb-0">
                          <small>
                            🎯 <strong>Pro Tip:</strong> විස්තරාත්මක ලක්ෂණ ලබා දීමෙන් වඩා හොඳ ප්‍රතිඵල ලැබේ / More detailed symptoms give better results
                          </small>
                        </Alert>
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

export default TextDiseasePredictor;