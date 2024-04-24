import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBar from "./components/SearchBar/SearchBar";
import Details from "./components/Details/Details";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function App() {
  return (
    <Container fluid>
      <Row>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<SearchBar />} />
              <Route path="/search/:query" element={<SearchBar />} />
              <Route path="/product/:itemId" element={<Details />} />
            </Routes>
          </div>
        </Router>
      </Row>
    </Container>
  );
}

export default App;
