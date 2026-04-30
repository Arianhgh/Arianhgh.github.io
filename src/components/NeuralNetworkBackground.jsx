import React, { useEffect, useRef } from 'react';
import './NeuralNetworkBackground.css';

const NeuralNetworkBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const COUNT = 160;
    const CONNECT = 150;
    const MOUSE_CONNECT = 220;
    const MOUSE_REPEL = 160;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener('resize', setSize);

    class Neuron {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.phase = Math.random() * Math.PI * 2;
      }
      update(t) {
        const w = window.innerWidth, h = window.innerHeight;
        this.x += this.vx; this.y += this.vy;
        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;
        const m = mouseRef.current;
        if (m.x !== null) {
          const dx = m.x - this.x, dy = m.y - this.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_REPEL && d > 0) {
            const f = (MOUSE_REPEL - d) / MOUSE_REPEL;
            this.x -= (dx / d) * f * 1.8;
            this.y -= (dy / d) * f * 1.8;
          }
        }
        this.pulse = 0.4 + 0.4 * Math.sin(t * 0.015 + this.phase);
      }
      draw(ctx) {
        const a = 0.25 + 0.5 * this.pulse;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        g.addColorStop(0, `rgba(34,211,238,${a * 0.2})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(34,211,238,${a})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const neurons = Array.from({ length: COUNT }, () => new Neuron());

    // Binary data streams
    const streams = Array.from({ length: 8 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.2 + Math.random() * 0.5,
      len: 60 + Math.random() * 100,
      opacity: 0.025 + Math.random() * 0.035,
    }));

    // ── Floating ML terms ──
    const ML_TERMS = [
      '∇L(θ)', 'softmax(z)', 'ReLU(x)', 'σ(Wx + b)', 'argmin L(θ)',
      'P(y|x)', 'KL(p‖q)', 'E[log p(x)]', '∂L/∂w', 'Adam',
      'attention(Q,K,V)', 'LayerNorm', 'dropout(p=0.1)', 'GELU',
      'CrossEntropy', 'SGD', 'BatchNorm', 'residual(x)',
      'θ ← θ − η∇L', 'Transformer', 'self-attention',
      'multi-head', 'embedding', 'positional enc',
      'backprop', 'chain rule', 'Jacobian',
      'L₂ regularization', 'weight decay', 'learning rate',
    ];

    const floatingTerms = ML_TERMS.map(term => ({
      text: term,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      opacity: 0.04 + Math.random() * 0.06,
      size: 9 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Floating equations (bigger, rarer) ──
    const EQUATIONS = [
      'L = -Σ yᵢ log ŷᵢ',
      'aᵢ = softmax(qᵢᵀK / √dₖ)',
      'h = σ(Wx + b)',
      'θₜ₊₁ = θₜ - η·∇L(θₜ)',
      'p(x) = Σ π_k N(x|μ_k,σ_k)',
    ];

    const floatingEqs = EQUATIONS.map(eq => ({
      text: eq,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.06,
      opacity: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const animate = () => {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      t++;

      // Ambient glow
      const g1 = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.35);
      g1.addColorStop(0, 'rgba(34,211,238,0.018)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.75, h * 0.6, 0, w * 0.75, h * 0.6, w * 0.3);
      g2.addColorStop(0, 'rgba(167,139,250,0.012)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Data streams
      ctx.font = '9px JetBrains Mono, monospace';
      streams.forEach(s => {
        s.y += s.speed;
        if (s.y > h + s.len) { s.y = -s.len; s.x = Math.random() * w; }
        for (let i = 0; i < s.len; i += 12) {
          const fade = 1 - i / s.len;
          ctx.fillStyle = `rgba(34,211,238,${s.opacity * fade})`;
          ctx.fillText(Math.random() > 0.5 ? '1' : '0', s.x, s.y + i);
        }
      });

      // ── Draw floating ML terms ──
      floatingTerms.forEach(term => {
        term.x += term.vx;
        term.y += term.vy;
        if (term.x < -100) term.x = w + 50;
        if (term.x > w + 100) term.x = -50;
        if (term.y < -30) term.y = h + 30;
        if (term.y > h + 30) term.y = -30;

        const breathe = term.opacity + 0.02 * Math.sin(t * 0.008 + term.phase);
        ctx.font = `${term.size}px JetBrains Mono, monospace`;
        ctx.fillStyle = `rgba(34,211,238,${breathe})`;
        ctx.fillText(term.text, term.x, term.y);
      });

      // ── Draw floating equations (larger, dimmer) ──
      floatingEqs.forEach(eq => {
        eq.x += eq.vx;
        eq.y += eq.vy;
        if (eq.x < -200) eq.x = w + 100;
        if (eq.x > w + 200) eq.x = -100;
        if (eq.y < -30) eq.y = h + 30;
        if (eq.y > h + 30) eq.y = -30;

        const breathe = eq.opacity + 0.015 * Math.sin(t * 0.006 + eq.phase);
        ctx.font = '14px JetBrains Mono, monospace';
        ctx.fillStyle = `rgba(167,139,250,${breathe})`;
        ctx.fillText(eq.text, eq.x, eq.y);
      });

      // Update neurons
      neurons.forEach(n => n.update(t));

      // Connections
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            const o = (1 - d / CONNECT) * 0.12;
            ctx.strokeStyle = `rgba(34,211,238,${o})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.stroke();
          }
        }
        const m = mouseRef.current;
        if (m.x !== null) {
          const dx = neurons[i].x - m.x, dy = neurons[i].y - m.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_CONNECT) {
            const o = (1 - d / MOUSE_CONNECT) * 0.4;
            ctx.strokeStyle = `rgba(34,211,238,${o})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      neurons.forEach(n => n.draw(ctx));

      // Mouse glow
      const m = mouseRef.current;
      if (m.x !== null) {
        const mg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 100);
        mg.addColorStop(0, 'rgba(34,211,238,0.06)');
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 100, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      if (e.target.closest('button, a, input, .terminal-window')) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onOut = () => { mouseRef.current = { x: null, y: null }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onOut);
    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="neural-network-bg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default NeuralNetworkBackground;
