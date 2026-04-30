import React from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import './Hero.css';
import NeuralNetworkBackground from './NeuralNetworkBackground';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <NeuralNetworkBackground />
      <div className="container hero-container">
        <div className="hero-content animate-fade-in">
          <p className="hero-greeting text-gradient">Hello, I'm</p>
          <h1 className="hero-title">Arian Haghparast</h1>
          <h2 className="hero-subtitle">Machine Learning & Robotics Researcher</h2>
          
          <p className="hero-description">
            I specialize in developing deep learning and reinforcement learning models for 
            complex systems, from scalable multi-agent vehicle routing to self-balancing robotics.
          </p>
          
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="mailto:arianhgh@my.yorku.ca" className="btn-secondary">Contact Me</a>
          </div>
          
          <div className="hero-socials">
            <a href="https://github.com/Arianhgh/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/arian-haghparast-3a5743260/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://scholar.google.com/citations?user=2lAL6q4AAAAJ&hl=en" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M21.42 10.922a2 2 0 0 1-.019 3.838L12.83 19.83a2 2 0 0 1-1.66 0L2.6 14.76a2 2 0 0 1-.019-3.838l8.57-4.438a2 2 0 0 1 1.708 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <a href="#about" aria-label="Scroll down">
          <ChevronDown size={32} className="bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
