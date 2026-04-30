import React, { useState, useRef, useEffect } from 'react';
import './Contact.css';
import { motion } from 'framer-motion';

const Contact = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Connection established. Type "help" for available commands.' }
  ]);
  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, { type: 'input', text: `guest@arian-server:~$ ${input}` }];
      
      if (cmd === 'help') {
        newHistory.push({ type: 'output', text: 'Available commands: about, email, github, linkedin, clear' });
      } else if (cmd === 'email' || cmd === 'contact') {
        newHistory.push({ type: 'output', text: 'Initializing mail protocol...' });
        newHistory.push({ type: 'link', text: 'arianhgh@my.yorku.ca', url: 'mailto:arianhgh@my.yorku.ca' });
      } else if (cmd === 'github') {
        newHistory.push({ type: 'link', text: 'github.com/Arianhgh', url: 'https://github.com/Arianhgh/' });
      } else if (cmd === 'linkedin') {
        newHistory.push({ type: 'link', text: 'linkedin.com/in/arian-haghparast-3a5743260', url: 'https://www.linkedin.com/in/arian-haghparast-3a5743260/' });
      } else if (cmd === 'about') {
        newHistory.push({ type: 'output', text: 'Arian Haghparast - Machine Learning & Robotics Researcher looking for new opportunities.' });
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd !== '') {
        newHistory.push({ type: 'error', text: `bash: ${cmd}: command not found` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cli-window glass-panel" onClick={() => inputRef.current?.focus()}>
        <div className="cli-header">
          <div className="cli-buttons">
            <span className="cli-btn close"></span>
            <span className="cli-btn minimize"></span>
            <span className="cli-btn maximize"></span>
          </div>
          <div className="cli-title">guest@arian-server:~</div>
        </div>
        
        <div className="cli-body custom-scrollbar" ref={terminalBodyRef}>
          {history.map((line, idx) => (
            <div key={idx} className={`cli-line ${line.type}`}>
              {line.type === 'link' ? (
                <a href={line.url} target="_blank" rel="noopener noreferrer">{line.text}</a>
              ) : (
                line.text
              )}
            </div>
          ))}
          <div className="cli-input-line">
            <span className="prompt">guest@arian-server:~$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      
      <div className="footer-bottom mt-8 text-center text-secondary text-sm">
        <p>Built with React, Vite & Framer Motion.</p>
        <p>Arian Haghparast &copy; {new Date().getFullYear()}</p>
      </div>
    </motion.div>
  );
};

export default Contact;
