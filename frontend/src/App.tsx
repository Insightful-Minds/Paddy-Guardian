import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import ImagePredictor from './components/ImagePredictor';
import TextPredictor from './components/TextPredictor';
import { Container, Navbar, Nav } from 'react-bootstrap';

function App() {

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg">
        <Container className='d-flex justify-content-between align-items-center'>
          <Navbar.Brand as={NavLink} to="/"><h2>🌾Paddy Disease App</h2></Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/image">Image Prediction</Nav.Link>
            <Nav.Link as={NavLink} to="/text">Text Prediction</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image" element={<ImagePredictor />} />
          <Route path="/text" element={<TextPredictor />} />
        </Routes>
      </div>
    </>
  )
}

export default App
