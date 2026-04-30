import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
import './TerminalHUD.css';

import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Publications from './Publications';
import Contact from './Contact';

const NODE_META = {
  about:        { label: 'about.sys' },
  experience:   { label: 'experience.dat' },
  projects:     { label: 'projects.exe' },
  publications: { label: 'publications.doc' },
  contact:      { label: 'contact.sh' },
};

const TerminalHUD = ({ activeNode, onClose }) => {
  const [bootText, setBootText] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (activeNode) {
      setBootText('');
      setShowContent(false);
      const meta = NODE_META[activeNode];
      const full = `> loading ${meta.label} ...\n> decrypting data ...\n> rendering`;
      let i = 0;
      const iv = setInterval(() => {
        if (i < full.length) { setBootText(full.slice(0, i + 1)); i++; }
        else { clearInterval(iv); setTimeout(() => setShowContent(true), 150); }
      }, 12);
      return () => clearInterval(iv);
    } else {
      setShowContent(false);
      setBootText('');
    }
  }, [activeNode]);

  const renderContent = () => {
    switch (activeNode) {
      case 'about': return <About />;
      case 'experience': return <Experience />;
      case 'projects': return <Projects />;
      case 'publications': return <Publications />;
      case 'contact': return <Contact />;
      default: return null;
    }
  };

  const meta = activeNode ? NODE_META[activeNode] : null;

  return (
    <AnimatePresence>
      {activeNode && (
        <motion.div className="terminal-hud-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="terminal-backdrop" onClick={onClose} />
          <motion.div className="terminal-window"
            initial={{ scale: 0.94, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}>

            <div className="term-header">
              <div className="term-title mono">
                <Terminal size={12} />
                <span>{meta?.label}</span>
              </div>
              <button className="term-close" onClick={onClose}>
                <X size={14} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!showContent ? (
                <motion.div key="boot" className="term-boot mono"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                  <pre>{bootText}<span className="term-cursor">█</span></pre>
                </motion.div>
              ) : (
                <motion.div key="content" className="term-content custom-scrollbar"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}>
                  {renderContent()}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="term-footer mono">
              <span>esc to close</span>
              <span>arian://portfolio</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalHUD;
