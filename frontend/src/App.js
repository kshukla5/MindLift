import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
// If you plan to use React Router for navigation:
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    // <Router> {/* Uncomment if using React Router for navigation */}
    <div className="App">
      <Navbar />
      {/*
        When you implement routing, your routes will go here.
        For example:
        <Routes>
          <Route path="/" element={<HeroSection />} />
          {/* <Route path="/login" element={<LoginForm />} /> ...other routes */ }
        {/* </Routes> */}
      <main className="main-content">
        <HeroSection /> {/* This will be the content for your homepage path "/" */}
      </main>
      <Footer />
    </div>
    // </Router> {/* Uncomment if using React Router */}
  );
}

export default App;
