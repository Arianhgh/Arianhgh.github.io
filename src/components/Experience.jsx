import React from 'react';
import './Experience.css';
import { motion } from 'framer-motion';

const Experience = () => {
  const experiences = [
    {
      role: "Research Assistant — ML & Robotics",
      company: "SDCN Lab, York University",
      period: "May 2024 – Present",
      description: [
        "Designed and trained deep reinforcement learning policies for autonomous quadrotor control, integrating learned perception with Model Predictive Control (MPC) for real-time trajectory optimization.",
        "Built end-to-end ML pipelines in PyTorch for sensor fusion and state estimation, deploying trained models onto embedded hardware (STM32) via ROS/ROS2 in production flight systems.",
        "Developed automated experiment tracking and data analysis tooling in Python, reducing iteration cycles by 40% and enabling reproducible evaluation across flight campaigns."
      ]
    },
    {
      role: "Research Assistant — Deep Learning",
      company: "Data Mining Lab, York University",
      period: "Jan 2024 – Present",
      description: [
        "Architected and trained large-scale deep learning models (Transformers, GNNs, VAEs) in PyTorch for trajectory representation learning on real-world urban mobility datasets with millions of records.",
        "Co-developed PathletRL++, a deep RL framework using PPO and custom reward shaping that reduced dictionary size by 65.8% and memory by ~24,000×, published in ACM TSAS.",
        "Engineered a Multi-Level Hyper-Transformer with Fourier-based spatiotemporal encoding, achieving state-of-the-art results on trajectory similarity benchmarks across 3 city-scale datasets."
      ]
    },
    {
      role: "ML Research Trainee (NSERC CREATE)",
      company: "SMART Program — Smart Mobility Research",
      period: "Sep 2025 – Apr 2026",
      description: [
        "Trained and evaluated multi-agent reinforcement learning (MARL) models for large-scale vehicle routing optimization, achieving 25.7% lower average travel time on realistic road networks.",
        "Implemented scalable hierarchical MARL architectures with shared policy networks and attention-based communication, achieving 100% routing success with 15.9% efficiency gains.",
        "Conducted rigorous ablation studies and hyperparameter sweeps across synthetic and real-world benchmarks, managing distributed training on multi-GPU clusters."
      ]
    },
    {
      role: "Research Assistant — ML Infrastructure",
      company: "Elder Laboratory, York University",
      period: "Sep 2023 – Dec 2023",
      description: [
        "Built real-time data ingestion and processing pipelines using Node.js and WebSockets to support continuous model evaluation and experiment monitoring for computer vision research.",
        "Developed internal ML experiment dashboards and visualization tools with React, enabling researchers to track training metrics, compare model runs, and analyze results interactively."
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="experience-container">
      <motion.div 
        className="timeline"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="timeline-line"></div>
        {experiences.map((exp, idx) => (
          <motion.div 
            key={idx} 
            className="timeline-item active-framer"
            variants={itemVariants}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-content glass-panel">
              <div className="timeline-header">
                <h3>{exp.role}</h3>
                <span className="timeline-period">{exp.period}</span>
              </div>
              <h4 className="timeline-company">{exp.company}</h4>
              <ul className="timeline-description">
                {exp.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Experience;
