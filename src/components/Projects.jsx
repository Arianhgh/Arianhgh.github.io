import React, { useRef } from 'react';
import './Projects.css';
import { motion } from 'framer-motion';

const SpotlightCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={cardRef} className={`spotlight-card ${className}`} onMouseMove={handleMouseMove}>
      {children}
    </div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Distributed Model Training Pipeline",
      date: "2025",
      tech: ["PyTorch", "DeepSpeed", "Weights & Biases", "Docker"],
      description: "Built a scalable distributed training framework for fine-tuning large Transformer models across multi-GPU clusters. Implemented gradient accumulation, mixed-precision training, and automated checkpointing with W&B experiment tracking, reducing training time by 3.2× on a 4-node setup."
    },
    {
      title: "Real-Time Anomaly Detection Engine",
      date: "2025",
      tech: ["PyTorch", "ONNX Runtime", "FastAPI", "Redis"],
      description: "Designed and deployed a production-grade anomaly detection system using variational autoencoders and attention-based temporal models. Serves <10ms inference via ONNX-optimized serving behind a FastAPI gateway, processing 50K+ events/sec with Redis-backed feature stores."
    },
    {
      title: "Structured Data Modeling for Financial Time Series",
      date: "Dec 2025",
      tech: ["Python", "XGBoost", "pandas", "scikit-learn"],
      description: "Developed a predictive ML pipeline to forecast EUR/USD exchange rate movements using 17 years of hourly tabular data. Trained a custom-weighted XGBoost classifier achieving a 17.73% strategy return with robust walk-forward validation."
    },
    {
      title: "Equibot: RL & Vision-Based Balancing Robot",
      date: "2024",
      tech: ["PyTorch", "OpenCV", "PPO", "Arduino"],
      description: "Trained a deep RL agent using Proximal Policy Optimization to dynamically balance a ball on a moving platform. Integrated real-time computer vision for state estimation and deployed the policy on embedded hardware for closed-loop control."
    },
    {
      title: "Pendubot: Self-Balancing Inverted Pendulum",
      date: "2024",
      tech: ["Raspberry Pi", "LQR Control", "Python", "NumPy"],
      description: "Designed a self-balancing robotic system using LQR optimal control and Kalman filtering for state estimation. Achieved stable inverted equilibrium under dynamic disturbances with real-time sensor fusion at 100Hz."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div className="projects-container"
      variants={containerVariants} initial="hidden" animate="show">
      <div className="projects-grid">
        {projects.map((project, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <SpotlightCard className="project-card glass-panel">
              <div className="project-content">
                <div className="project-header">
                  <div className="folder-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <span className="project-date mono">{project.date}</span>
                </div>
                <h3 className="project-title">{project.title}</h3>
                <div className="project-description">
                  <p>{project.description}</p>
                </div>
                <ul className="project-tech-list">
                  {project.tech.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
