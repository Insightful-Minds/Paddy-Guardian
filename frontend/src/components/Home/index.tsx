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
                            🌾 Paddy Leaf Disease Detector
                        </Card.Title>
                        <Card.Text className="lead mb-4" style={{ fontSize: '1.2rem' }}>
                            Advanced AI-powered solution for early detection of paddy diseases
                        </Card.Text>
                        <Row className="mt-4">
                            <Col md={6} className="mb-3">
                                <Card className="h-100 shadow-sm border-success">
                                    <Card.Body className="text-center">
                                        <div style={{ fontSize: '3rem' }}>📷</div>
                                        <h5 className="text-success">Image Detection</h5>
                                        <p>Upload a photo of the paddy leaf for instant AI analysis</p>
                                        <Link to="/image" style={{ textDecoration: 'none' }}>
                                            <Button variant="success" size="lg" className="w-100">
                                                Start Image Analysis
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Card className="h-100 shadow-sm border-info">
                                    <Card.Body className="text-center">
                                        <div style={{ fontSize: '3rem' }}>✍️</div>
                                        <h5 className="text-info">Text Analysis</h5>
                                        <p>Describe symptoms for disease identification</p>
                                        <Link to="/text" style={{ textDecoration: 'none' }}>
                                            <Button variant="info" size="lg" className="w-100">
                                                Start Text Analysis
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
                                <h2 className="text-center text-primary mb-4">🦠 Common Paddy Diseases</h2>
                                <Row>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-warning">
                                            <Card.Body>
                                                <h5 className="text-warning">🍂 Leaf Blast</h5>
                                                <p><strong>Symptoms:</strong> Diamond-shaped lesions with gray centers and brown margins</p>
                                                <p><strong>Impact:</strong> Can cause 10-35% yield loss</p>
                                                <p><strong>Prevention:</strong> Resistant varieties, proper spacing</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-danger">
                                            <Card.Body>
                                                <h5 className="text-danger">🟤 Brown Spot</h5>
                                                <p><strong>Symptoms:</strong> Circular brown spots with yellow halos</p>
                                                <p><strong>Impact:</strong> Reduces grain quality and yield</p>
                                                <p><strong>Prevention:</strong> Balanced fertilization, crop rotation</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 border-success">
                                            <Card.Body>
                                                <h5 className="text-success">💚 Healthy Leaf</h5>
                                                <p><strong>Appearance:</strong> Vibrant green color, no spots or lesions</p>
                                                <p><strong>Maintenance:</strong> Regular monitoring and care</p>
                                                <p><strong>Benefits:</strong> Optimal photosynthesis and growth</p>
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
                                <h2 className="text-primary mb-4">📊 Why Early Detection Matters</h2>
                                <Row>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-success">95%</div>
                                        <p className="lead">Detection Accuracy</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-warning">50%</div>
                                        <p className="lead">Yield Loss Prevention</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-info">24/7</div>
                                        <p className="lead">Available Support</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <div className="display-4 text-danger">⚡</div>
                                        <p className="lead">Instant Results</p>
                                    </Col>
                                </Row>
                                <p className="lead mt-4 text-muted">
                                    Early detection of paddy diseases can save up to 50% of crop yield and reduce treatment costs significantly.
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