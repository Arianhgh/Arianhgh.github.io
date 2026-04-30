import React from 'react';
import { BookOpen } from 'lucide-react';
import './Publications.css';
import { motion } from 'framer-motion';

const Publications = () => {
  const publications = [
    {
      title: "Network-Constrained Policy Optimization for Adaptive Multi-agent Vehicle Routing",
      journal: "arXiv preprint arXiv:2510.26089",
      year: "2026",
      authors: "F. Arasteh*, A. Haghparast*, M. Papagelis",
      note: "*Co-first author"
    },
    {
      title: "PathletRL++: Optimizing Trajectory Pathlet Extraction and Dictionary Formation via Reinforcement Learning",
      journal: "ACM Transactions on Spatial Algorithms and Systems, Special Issue for Best Papers of ACM SIGSPATIAL 2023",
      year: "2025",
      authors: "G. Alix*, A. Haghparast*, M. Papagelis",
      note: "*Co-first author"
    },
    {
      title: "Robot Wheelchair Convoys for Assistive Human Transportation",
      journal: "2024 IEEE International Conference on Smart Mobility (SM), pp. 25-32",
      year: "2024",
      authors: "H. Perroni Filho, J. Ren, M. Akhavan, Y. Hou, W. Khan, A. Haghparast, et al."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="publications-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="publications-list">
        {publications.map((pub, idx) => (
          <motion.div key={idx} variants={itemVariants} className="publication-item glass-panel">
            <div className="pub-icon">
              <BookOpen size={24} className="text-purple" />
            </div>
            <div className="pub-content">
              <h3 className="pub-title">{pub.title}</h3>
              <p className="pub-authors">{pub.authors}</p>
              <div className="pub-meta">
                <span className="pub-journal">{pub.journal}</span>
                <span className="pub-year">{pub.year}</span>
              </div>
              {pub.note && <span className="pub-note">{pub.note}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Publications;
