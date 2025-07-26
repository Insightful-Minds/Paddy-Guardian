import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import ImagePredictor from './components/ImagePredictor';
import TextPredictor from './components/TextPredictor';
import { Container, Navbar, Nav } from 'react-bootstrap';
import SinhalaPredictor from './components/SinhalaPredictor';

function App() {

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container className='d-flex justify-content-between align-items-center'>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            <h2 className="mb-0">🌾 Paddy Guardian</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" className="mx-2" style={{ fontSize: '0.9rem' }}>
                🏠 Home | මුල් පිටුව
              </Nav.Link>
              <Nav.Link as={NavLink} to="/image" className="mx-2" style={{ fontSize: '0.9rem' }}>
                📷 Image Analysis | රූප විශ්ලේෂණය
              </Nav.Link>
              {/* <Nav.Link as={NavLink} to="/text" className="mx-2" style={{ fontSize: '0.9rem' }}>
                📝 English Text | ඉංග්‍රීසි පෙළ
              </Nav.Link> */}
              <Nav.Link as={NavLink} to="/sinhala" className="mx-2" style={{ fontSize: '0.9rem' }}>
                🇱🇰 Sinhala Text | සිංහල පෙළ
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image" element={<ImagePredictor />} />
          <Route path="/text" element={<TextPredictor />} />
          <Route path="/sinhala" element={<SinhalaPredictor />} />
        </Routes>
      </div>
    </>
  )
}

export default App
