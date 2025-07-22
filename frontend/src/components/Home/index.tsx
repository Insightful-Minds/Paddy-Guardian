import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import bgvideo from '../../assets/bg-video.mp4';

const Home = () => {
    return (
        <div 
            style={{
                position: 'relative',
                minHeight: '100vh',
                overflow: 'hidden'
            }}
        >
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -2
                }}
            >
                <source src={bgvideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Dark Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: -1
                }}
            />
            
            <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <Card className="text-center shadow-lg border-0 mb-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Card.Body className="py-5">
                        <Card.Title as="h1" className="text-success mb-4" style={{ fontSize: '3rem' }}>
                            🌾 Welcome to Paddy Guardian - Paddy Guardian වෙත සාදරයෙන් පිලිගනිමු
                        </Card.Title>
                        <Card.Text className="lead mb-4" style={{ fontSize: '1.2rem' }}>
                            ඔබගේ වී රෝග හදුනාගැනීමේ ප්‍රමුඛයා - කෘත්‍රිම බුද්ධිය සමග වී කෙත් ආරක්ෂා කරන්න
                            <br />
                            Advanced AI-powered solution for early detection of paddy diseases using cutting-edge machine learning technology
                            <br />
                            <span className="text-muted" style={{ fontSize: '1rem' }}>
                                🌾 සෑම දිනකම දහස් ගණන් ගොවීන්ගේ විශ්වාසය ලබන පද්ධතිය | Trusted by thousands of farmers daily
                            </span>
                        </Card.Text>
                        <Row className="mt-4">
                            <Col md={4} className="mb-3">
                                <Card className="h-100 shadow-sm border-success">
                                    <Card.Body className="text-center">
                                        <div style={{ fontSize: '3rem' }}>📷</div>
                                        <h5 className="text-success">Image Detection</h5>
                                        <h6 className="text-success">📸 රූප විශ්ලේෂණය</h6>
                                        <p>Upload a photo of the paddy leaf for instant AI analysis</p>
                                        <p className="text-muted small">වී පත්‍රයේ රූපයක් උඩුගත කර ක්ෂණිකව AI විශ්ලේෂණයක් ලබා ගන්න</p>
                                        <Link to="/image" style={{ textDecoration: 'none' }}>
                                            <Button variant="success" size="lg" className="w-100">
                                                Start Image Analysis
                                                <br />
                                                <small>රූප විශ්ලේෂණය ආරම්භ කරන්න</small>
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Card className="h-100 shadow-sm border-info">
                                    <Card.Body className="text-center">
                                        <div style={{ fontSize: '3rem' }}>📝</div>
                                        <h5 className="text-info">English Text Analysis</h5>
                                        <h6 className="text-info">🔤 ඉංග්‍රීසි පෙළ විශ්ලේෂණය</h6>
                                        <p>Describe symptoms in English for disease identification</p>
                                        <p className="text-muted small">රෝග ලක්ෂණ ඉංග්‍රීසි භාෂාවෙන් විස්තර කර රෝගය හඳුනාගන්න</p>
                                        <Link to="/text" style={{ textDecoration: 'none' }}>
                                            <Button variant="info" size="lg" className="w-100">
                                                Start English Analysis
                                                <br />
                                                <small>ඉංග්‍රීසි විශ්ලේෂණය ආරම්භ කරන්න</small>
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Card className="h-100 shadow-sm border-warning">
                                    <Card.Body className="text-center">
                                        <div style={{ fontSize: '3rem' }}>🇱🇰</div>
                                        <h5 className="text-warning">Sinhala Text Analysis</h5>
                                        <h6 className="text-warning">🔤 සිංහල පෙළ විශ්ලේෂණය</h6>
                                        <p>Describe symptoms in Sinhala for disease identification</p>
                                        <p className="text-muted small">රෝග ලක්ෂණ සිංහල භාෂාවෙන් විස්තර කර රෝගය හඳුනාගන්න</p>
                                        <Link to="/sinhala" style={{ textDecoration: 'none' }}>
                                            <Button variant="warning" size="lg" className="w-100">
                                                Start Sinhala Analysis
                                                <br />
                                                <small>සිංහල විශ්ලේෂණය ආරම්භ කරන්න</small>
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Disease Information Section */}
                <Row className="mb-5">
                    <Col lg={12}>
                        <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                            <Card.Body className="p-5">
                                <h2 className="text-center text-primary mb-4">🦠 Common Paddy Diseases | සාමාන්‍ය වී රෝග</h2>
                                <p className="text-center text-muted mb-4">
                                    Learn about the most common paddy diseases and their symptoms | වීට බලපාන ප්‍රධාන රෝග සහ ඒවායේ ලක්ෂණ ගැන දැනගන්න
                                </p>
                                <Row>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-warning">
                                            <Card.Body>
                                                <h5 className="text-warning">🍂 Leaf Blast | පත්‍ර පතුරු රෝගය</h5>
                                                <p><strong>Symptoms | ලක්ෂණ:</strong> Diamond-shaped lesions with gray centers and brown margins</p>
                                                <p className="text-muted small">අළු මැද කොටස් සහ දුඹුරු මායිම් සහිත දියමන්ති හැඩැති තුවාල</p>
                                                <p><strong>Impact | බලපෑම:</strong> Can cause 10-35% yield loss | අස්වැන්නෙන් 10-35% ක් අහිමි විය හැකිය</p>
                                                <p><strong>Prevention | වැළැක්වීම:</strong> Resistant varieties, proper spacing</p>
                                                <p className="text-muted small">ප්‍රතිරෝධී ප්‍රභේද, සුදුසු පරතරය</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-danger">
                                            <Card.Body>
                                                <h5 className="text-danger">🟤 Brown Spot | කළු ලප රෝගය</h5>
                                                <p><strong>Symptoms | ලක්ෂණ:</strong> Circular brown spots with yellow halos</p>
                                                <p className="text-muted small">කහ රටා සහිත රවුම් දුඹුරු ලප</p>
                                                <p><strong>Impact | බලපෑම:</strong> Reduces grain quality and yield | ධාන්‍ය ගුණත්වය සහ අස්වැන්න අඩු කරයි</p>
                                                <p><strong>Prevention | වැළැක්වීම:</strong> Balanced fertilization, crop rotation</p>
                                                <p className="text-muted small">සමබර පොහොර යෙදීම, භෝග මාරුව</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-success">
                                            <Card.Body>
                                                <h5 className="text-success">💚 Healthy Leaf | සෞඛ්‍ය සම්පන්න පත්‍රය</h5>
                                                <p><strong>Appearance | පෙනුම:</strong> Vibrant green color, no spots or lesions</p>
                                                <p className="text-muted small">දීප්තිමත් හරිත පරන, ලප හෝ තුවාල නැත</p>
                                                <p><strong>Maintenance | නඩත්තුව:</strong> Regular monitoring and care | නිතිපතා නිරීක්ෂණය සහ සත්කාර</p>
                                                <p><strong>Benefits | ප්‍රතිලාභ:</strong> Optimal photosynthesis and growth</p>
                                                <p className="text-muted small">ප්‍රශස්ත ප්‍රභාසංශ්ලේෂණය සහ වර්ධනය</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                
                                {/* Additional Diseases Row */}
                                <Row className="mt-4">
                                    <Col md={6} className="mb-4">
                                        <Card className="h-100 border-info">
                                            <Card.Body>
                                                <h5 className="text-info">🦠 Bacterial Blight | බැක්ටීරියානු පත්‍ර දාහය</h5>
                                                <p><strong>Symptoms | ලක්ෂණ:</strong> Water-soaked lesions turning yellow to brown</p>
                                                <p className="text-muted small">ජලය අවශෝෂණය වූ තුවාල කහ සිට දුඹුරු දක්වා පරිවර්තනය වීම</p>
                                                <p><strong>Impact | බලපෑම:</strong> Severe yield reduction in wet conditions</p>
                                                <p className="text-muted small">තෙත් තත්ත්වයන්හිදී අස්වැන්න දැඩි ලෙස අඩුවීම</p>
                                                <p><strong>Prevention | වැළැක්වීම:</strong> Seed treatment, water management</p>
                                                <p className="text-muted small">බීජ ප්‍රතිකාර, ජල කළමනාකරණය</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6} className="mb-4">
                                        <Card className="h-100 border-secondary">
                                            <Card.Body>
                                                <h5 className="text-secondary">🟨 Tungro Virus | ටුංග්‍රෝ වෛරස් රෝගය</h5>
                                                <p><strong>Symptoms | ලක්ෂණ:</strong> Yellow-orange discoloration, stunted growth</p>
                                                <p className="text-muted small">කහ-තැඹිලි වර්ණ විකෘතිය, වර්ධනය අඩාලවීම</p>
                                                <p><strong>Vector | වාහකය:</strong> Transmitted by green leafhoppers</p>
                                                <p className="text-muted small">හරිත පත්‍ර මකුණන් මගින් සම්ප්‍රේෂණය</p>
                                                <p><strong>Prevention | වැළැක්වීම:</strong> Vector control, resistant varieties</p>
                                                <p className="text-muted small">වාහක පාලනය, ප්‍රතිරෝධී ප්‍රභේද</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Tips Section */}
                <Row className="mb-5">
                    <Col lg={12}>
                        <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                            <Card.Body className="p-5">
                                <h2 className="text-center text-success mb-4">💡 Tips for Better Detection | වඩා හොඳ හඳුනාගැනීම සඳහා උපදෙස්</h2>
                                <Row>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-success">
                                            <Card.Body className="text-center">
                                                <div style={{ fontSize: '2rem' }}>📸</div>
                                                <h6 className="text-success mt-2">Photography Tips | ඡායාරූප ගැනීමේ උපදෙස්</h6>
                                                <ul className="text-start">
                                                    <li>Take clear, well-lit photos | පැහැදිලි, හොඳ ආලෝකයේ ඡායාරූප ගන්න</li>
                                                    <li>Focus on affected areas | පීඩාවට පත් ප්‍රදේශ කෙරෙහි අවධානය</li>
                                                    <li>Avoid blurry images | බොඳවූ ඡායාරූප මග හරින්න</li>
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-info">
                                            <Card.Body className="text-center">
                                                <div style={{ fontSize: '2rem' }}>📝</div>
                                                <h6 className="text-info mt-2">Description Tips | විස්තර කිරීමේ උපදෙස්</h6>
                                                <ul className="text-start">
                                                    <li>Be specific about colors | වර්ණ ගැන නිශ්චිතව සඳහන් කරන්න</li>
                                                    <li>Mention size and shape | ප්‍රමාණය සහ හැඩය සඳහන් කරන්න</li>
                                                    <li>Include location on leaf | පත්‍රයේ ස්ථානය ඇතුළත් කරන්න</li>
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-warning">
                                            <Card.Body className="text-center">
                                                <div style={{ fontSize: '2rem' }}>⏰</div>
                                                <h6 className="text-warning mt-2">Best Timing | හොඳම කාලය</h6>
                                                <ul className="text-start">
                                                    <li>Morning hours (8-10 AM) | උදෑසන (8-10)</li>
                                                    <li>Natural daylight | ස්වභාවික දිවා ආලෝකය</li>
                                                    <li>Dry weather conditions | වියළි කාලගුණ තත්ත්වයන්</li>
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Statistics Section */}
                <Row>
                    <Col lg={12}>
                        <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                            <Card.Body className="p-5 text-center">
                                <h2 className="text-primary mb-4">📊 Why Early Detection Matters | ඉක්මන් හඳුනාගැනීම වැදගත් ඇයි</h2>
                                <Row>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-success">95%</div>
                                        <p className="lead">Detection Accuracy</p>
                                        <p className="text-muted small">හඳුනාගැනීමේ නිරවද්‍යතාව</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-warning">50%</div>
                                        <p className="lead">Yield Loss Prevention</p>
                                        <p className="text-muted small">අස්වැන්න අහිමිවීම වළකාගැනීම</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-info">24/7</div>
                                        <p className="lead">Available Support</p>
                                        <p className="text-muted small">පැය 24ම ලබාගත හැකි සහාය</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-danger">⚡</div>
                                        <p className="lead">Instant Results</p>
                                        <p className="text-muted small">ක්ෂණික ප්‍රතිඵල</p>
                                    </Col>
                                </Row>
                                <p className="lead mt-4 text-muted">
                                    Early detection of paddy diseases can save up to 50% of crop yield and reduce treatment costs significantly.
                                    <br />
                                    <span className="text-primary">වී රෝග ඉක්මනින් හඳුනාගැනීමෙන් අස්වැන්නෙන් 50% ක් දක්වා ඉතිරි කර ගත හැකි අතර ප්‍රතිකාර වියදම් සැලකිය යුතු ලෙස අඩු කරයි.</span>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home;