import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;