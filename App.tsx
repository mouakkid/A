import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Industries from './components/Industries';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Services />
        <Industries />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;