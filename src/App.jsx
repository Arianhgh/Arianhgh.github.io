import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';
import TerminalHUD from './components/TerminalHUD';
import { GraduationCap } from 'lucide-react';

/* ── Typewriter ────────────────────────── */
function useTypewriter(text, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
        else { setDone(true); clearInterval(iv); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/* ── Animated loss curve (larger) ────────────────────────── */
function LossCurve() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const w = 280, h = 80;
    c.width = w * 2; c.height = h * 2;
    c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.scale(2, 2);
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(34,211,238,0.05)';
      ctx.lineWidth = 0.5;
      for (let y = 10; y < h; y += 14) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      // Validation curve (dimmer)
      ctx.strokeStyle = 'rgba(167,139,250,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const pts = Math.min(frame, w);
      for (let x = 0; x < pts; x++) {
        const t = x / w;
        const val = 50 * Math.exp(-2.5 * t) + 8 + 5 * Math.sin(t * 15) * Math.exp(-1.5 * t);
        const y = h - val; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      } ctx.stroke();
      // Train curve
      ctx.strokeStyle = 'rgba(34,211,238,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < pts; x++) {
        const t = x / w;
        const loss = 50 * Math.exp(-3.5 * t) + 4 + 3 * Math.sin(t * 22) * Math.exp(-2 * t);
        const y = h - loss; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      } ctx.stroke();
      // Glow on train
      ctx.strokeStyle = 'rgba(34,211,238,0.12)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let x = 0; x < pts; x++) {
        const t = x / w;
        const loss = 50 * Math.exp(-3.5 * t) + 4 + 3 * Math.sin(t * 22) * Math.exp(-2 * t);
        const y = h - loss; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      } ctx.stroke();
      // Legend
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(34,211,238,0.5)'; ctx.fillText('train', w - 30, 12);
      ctx.fillStyle = 'rgba(167,139,250,0.4)'; ctx.fillText('val', w - 30, 22);
      frame += 0.7;
      requestAnimationFrame(draw);
    };
    draw();
  }, []);
  return <canvas ref={canvasRef} className="viz-canvas" />;
}

/* ── Animated weight matrix (larger) ────────────────────────── */
function WeightMatrix() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const size = 100;
    c.width = size * 2; c.height = size * 2;
    c.style.width = size + 'px'; c.style.height = size + 'px';
    ctx.scale(2, 2);
    const cells = 10; const cs = size / cells;
    const weights = Array.from({ length: cells * cells }, () => Math.random() * 2 - 1);
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      for (let r = 0; r < cells; r++) {
        for (let col = 0; col < cells; col++) {
          const idx = r * cells + col;
          const w = weights[idx] + 0.15 * Math.sin(frame * 0.018 + idx * 0.4);
          const intensity = Math.abs(w) / 1.3;
          ctx.fillStyle = w > 0
            ? `rgba(34,211,238,${intensity * 0.65})`
            : `rgba(167,139,250,${intensity * 0.45})`;
          ctx.fillRect(col * cs + 0.5, r * cs + 0.5, cs - 1, cs - 1);
        }
      }
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
  }, []);
  return <canvas ref={canvasRef} className="viz-canvas" />;
}

/* ── Attention heatmap ────────────────────────── */
function AttentionMap() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const w = 120, h = 80;
    c.width = w * 2; c.height = h * 2;
    c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.scale(2, 2);
    const rows = 8, cols = 12; const cw = w / cols, ch = h / rows;
    const attn = Array.from({ length: rows * cols }, () => Math.random());
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const idx = r * cols + col;
          // Simulate attention shifting
          const v = attn[idx] * (0.7 + 0.3 * Math.sin(frame * 0.012 + idx * 0.5));
          ctx.fillStyle = `rgba(34,211,238,${v * 0.7})`;
          ctx.fillRect(col * cw + 0.3, r * ch + 0.3, cw - 0.6, ch - 0.6);
        }
      }
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
  }, []);
  return <canvas ref={canvasRef} className="viz-canvas" />;
}

/* ── Gradient norm bar ────────────────────────── */
function GradientBar() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const w = 280, h = 16;
    c.width = w * 2; c.height = h * 2;
    c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.scale(2, 2);
    const bars = 60;
    const barW = w / bars;
    const values = Array.from({ length: bars }, () => Math.random());
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < bars; i++) {
        const v = values[i] * (0.6 + 0.4 * Math.sin(frame * 0.02 + i * 0.3));
        const barH = v * h;
        ctx.fillStyle = `rgba(34,211,238,${0.15 + v * 0.45})`;
        ctx.fillRect(i * barW + 0.5, h - barH, barW - 1, barH);
      }
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
  }, []);
  return <canvas ref={canvasRef} className="viz-canvas gradient-bar" />;
}

/* ── Boot Sequence ────────────────────────── */
const BOOT_LINES = [
  { text: '> initializing neural cortex ...', delay: 0 },
  { text: '> loading weights [████████████████] 100%', delay: 600 },
  { text: '> compiling computation graph ...', delay: 1200 },
  { text: '> identity: arian_haghparast', delay: 1800 },
  { text: '> status: online', delay: 2200, color: 'var(--accent-emerald)' },
];

function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    BOOT_LINES.forEach((line) => {
      setTimeout(() => setLines(prev => [...prev, line]), line.delay);
    });
    setTimeout(() => setOpacity(0), 3200);
    setTimeout(onComplete, 3800);
  }, []);
  return (
    <motion.div className="boot-sequence" style={{ opacity }}
      initial={{ opacity: 0 }} animate={{ opacity }} transition={{ duration: 0.6 }}>
      <div className="boot-terminal">
        {lines.map((l, i) => (
          <motion.div key={i} className="boot-line mono"
            style={{ color: l.color || 'var(--accent-cyan)' }}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}>
            {l.text}
          </motion.div>
        ))}
        <span className="boot-cursor">█</span>
      </div>
    </motion.div>
  );
}

/* ── Node definitions (symmetrical layout) ────────────────────────── */
const NODES = [
  { id: 'about',        label: 'about',        x: '14%', y: '32%' },
  { id: 'experience',   label: 'experience',   x: '86%', y: '32%' },
  { id: 'publications', label: 'publications', x: '14%', y: '72%' },
  { id: 'projects',     label: 'projects',     x: '86%', y: '72%' },
  { id: 'contact',      label: 'contact',      x: '50%', y: '92%' },
];

/* ── App ────────────────────────── */
function App() {
  const [booted, setBooted] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.4200);
  const [acc, setAcc] = useState(52.1);
  const [gradNorm, setGradNorm] = useState(0.85);
  const [converged, setConverged] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [rickrolled, setRickrolled] = useState(false);
  const prevActiveRef = useRef(null);

  const title = useTypewriter('Arian Haghparast', 55, booted ? 300 : 99999);
  const sub = useTypewriter('ML Researcher & Robotics Engineer', 25, booted ? 1500 : 99999);

  // Live metrics — loss decays over epochs
  useEffect(() => {
    if (!booted) return;
    const iv = setInterval(() => {
      setEpoch(e => {
        const next = e + 1;
        const t = next / 25;
        const newLoss = 0.42 * Math.exp(-2.5 * t) + 0.002 + Math.random() * 0.003;
        const newAcc = Math.min(99.5, 52 + 47 * (1 - Math.exp(-3 * t)) + Math.random() * 1.5);
        const newGrad = 0.85 * Math.exp(-2 * t) + 0.005 + Math.random() * 0.01;
        setLoss(newLoss);
        setAcc(newAcc);
        setGradNorm(newGrad);
        if (next >= 20 && !converged) setConverged(true);
        return next;
      });
    }, 1800);
    return () => clearInterval(iv);
  }, [booted, converged]);

  // ESC to close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setActiveNode(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Track visited nodes & unlock secret
  useEffect(() => {
    if (activeNode) {
      setVisitedNodes(prev => new Set([...prev, activeNode]));
      prevActiveRef.current = activeNode;
    } else if (prevActiveRef.current) {
      // Unlock after visiting the 4 core nodes (contact optional)
      const updated = new Set([...visitedNodes, prevActiveRef.current]);
      const coreNodes = ['about', 'experience', 'publications', 'projects'];
      const allCoreVisited = coreNodes.every(n => updated.has(n));
      if (allCoreVisited && !secretUnlocked) {
        setSecretUnlocked(true);
      }
      prevActiveRef.current = null;
    }
  }, [activeNode]);

  return (
    <div className="app-container">
      <NeuralNetworkBackground />
      <AnimatePresence mode="wait">
        {!booted ? (
          <BootSequence key="boot" onComplete={() => setBooted(true)} />
        ) : (
          <motion.div key="main" className="main-layer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>

            {/* ── Nodes ── */}
            <div className="nodes-layer">
              {NODES.map((node, i) => (
                <motion.button key={node.id}
                  className={`neural-node ${activeNode === node.id ? 'active' : ''}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setActiveNode(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}>
                  <div className="node-ring" />
                  <div className="node-ring r2" />
                  <div className="node-dot" />
                  <AnimatePresence>
                    {hoveredNode === node.id && (
                      <motion.span className="node-label mono"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}>
                        {node.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* ── Hero ── */}
            <AnimatePresence>
              {!activeNode && (
                <motion.div className="hero-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.5 }}>
                  <div className="hero-card">

                    {/* Top metrics bar */}
                    <div className="hero-metrics mono">
                      <div className="metric">
                        <span className="metric-label">epoch</span>
                        <span className="metric-value">{epoch}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">loss</span>
                        <span className="metric-value">{loss.toFixed(4)}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">accuracy</span>
                        <span className="metric-value">{acc.toFixed(1)}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">∇ norm</span>
                        <span className="metric-value">{gradNorm.toFixed(4)}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">lr</span>
                        <span className="metric-value">3e-4</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">status</span>
                        <span className={`metric-value ${converged ? 'metric-online' : 'metric-training'}`}>
                          <span className={converged ? 'status-dot' : 'status-dot training'} />
                          {converged ? 'converged' : 'training'}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <h1 className="hero-name">
                      {title.displayed}
                      {!title.done && <span className="cursor">|</span>}
                    </h1>
                    <p className="hero-role mono">
                      {sub.displayed}
                      {title.done && !sub.done && <span className="cursor">|</span>}
                    </p>

                    {/* Visualizations row */}
                    <motion.div className="hero-viz"
                      initial={{ opacity: 0 }} animate={{ opacity: sub.done ? 1 : 0 }}
                      transition={{ duration: 0.6 }}>
                      <div className="viz-block">
                        <span className="viz-label mono">train / val loss</span>
                        <LossCurve />
                      </div>
                      <div className="viz-block">
                        <span className="viz-label mono">W₁ weights</span>
                        <WeightMatrix />
                      </div>
                      <div className="viz-block">
                        <span className="viz-label mono">attention</span>
                        <AttentionMap />
                      </div>
                    </motion.div>

                    {/* Gradient flow bar */}
                    <motion.div className="viz-block viz-wide"
                      initial={{ opacity: 0 }} animate={{ opacity: sub.done ? 1 : 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}>
                      <span className="viz-label mono">gradient flow across layers</span>
                      <GradientBar />
                    </motion.div>

                    {/* Links */}
                    <motion.div className="hero-links"
                      initial={{ opacity: 0 }} animate={{ opacity: sub.done ? 1 : 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}>
                      <a href="https://github.com/Arianhgh/" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        <span>github</span>
                      </a>
                      <a href="https://www.linkedin.com/in/arian-haghparast-3a5743260/" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        <span>linkedin</span>
                      </a>
                      <a href="https://scholar.google.com/citations?user=2lAL6q4AAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                        <GraduationCap size={16} />
                        <span>scholar</span>
                      </a>
                    </motion.div>

                    <motion.p className="hero-hint mono"
                      initial={{ opacity: 0 }} animate={{ opacity: sub.done ? 1 : 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}>
                      select a node to explore
                    </motion.p>

                    {/* Secret easter egg node */}
                    <AnimatePresence>
                      {secretUnlocked && (
                        <motion.button
                          className="secret-node"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.3 }}
                          onClick={() => setRickrolled(true)}
                          title="???"
                        >
                          {/* Spark particles */}
                          {[...Array(8)].map((_, i) => (
                            <motion.span key={i} className="spark"
                              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [1, 0.8, 0],
                                x: Math.cos(i * Math.PI / 4) * 30,
                                y: Math.sin(i * Math.PI / 4) * 30,
                              }}
                              transition={{ duration: 0.8, delay: 0.3 + i * 0.05, repeat: Infinity, repeatDelay: 3 }}
                            />
                          ))}
                          <div className="secret-dot" />
                          <span className="secret-label mono">???</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HUD corners */}
            <div className="hud-corner tl" />
            <div className="hud-corner tr" />
            <div className="hud-corner bl" />
            <div className="hud-corner br" />

            <TerminalHUD activeNode={activeNode} onClose={() => setActiveNode(null)} />

            {/* Rickroll overlay */}
            <AnimatePresence>
              {rickrolled && (
                <motion.div className="rickroll-overlay"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="rickroll-backdrop" onClick={() => setRickrolled(false)} />
                  <motion.div className="rickroll-player"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
                    <button className="rickroll-close mono" onClick={() => setRickrolled(false)}>✕</button>
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="???"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
