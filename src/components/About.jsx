import React from 'react';
import './About.css';
import { Code2, Brain, Wrench, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className }) => {
  const cardRef = React.useRef(null);
  const [style, setStyle] = React.useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out',
    });
  };

  return (
    <div ref={cardRef} className={className} style={style}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const About = () => {
  const skills = [
    {
      title: 'Languages',
      icon: <Code2 size={18} className="text-cyan" />,
      items: ['Python', 'C/C++', 'JavaScript', 'SQL', 'Rust', 'Go']
    },
    {
      title: 'Machine Learning',
      icon: <Brain size={18} className="text-purple" />,
      items: ['PyTorch', 'TensorFlow', 'Deep RL', 'Transformers', 'GNNs', 'Metric Learning']
    },
    {
      title: 'Robotics',
      icon: <Cpu size={18} className="text-emerald" />,
      items: ['ROS/ROS2', 'PID Control', 'MPC', 'STM32', 'Arduino', 'RTOS']
    },
    {
      title: 'Tools & Data',
      icon: <Wrench size={18} style={{color: '#94a3b8'}} />,
      items: ['NumPy', 'Pandas', 'Node.js', 'React', 'Linux', 'AWS', 'Git']
    }
  ];

  return (
    <motion.div className="about-container" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="about-text glass-panel">
        <p>
          Machine Learning-focused Computer Science student at York University with hands-on experience building
          and evaluating deep learning and reinforcement learning models on structured and real-world datasets.
        </p>
        <p>
          My research spans multi-agent routing, trajectory representation learning, and robotics control —
          always with a focus on rigorous experimental design, validation, and reproducibility.
        </p>
      </motion.div>

      <motion.div variants={item} className="about-stats">
        <div className="stat-card glass-panel">
          <div className="stat-value text-gradient">3.96</div>
          <div className="stat-label">GPA / 4.00</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-value text-gradient">3</div>
          <div className="stat-label">Publications</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-value text-gradient">4+</div>
          <div className="stat-label">Research Roles</div>
        </div>
      </motion.div>

      <motion.div variants={item} className="skills-container">
        {skills.map((cat, idx) => (
          <TiltCard key={idx} className="skill-category glass-panel">
            <div className="skill-header">
              {cat.icon}
              <h3>{cat.title}</h3>
            </div>
            <div className="skill-tags">
              {cat.items.map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          </TiltCard>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default About;
