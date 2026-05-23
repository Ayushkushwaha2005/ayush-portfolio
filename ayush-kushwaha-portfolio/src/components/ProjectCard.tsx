import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ExternalLink, Github, Sparkles, AlertCircle, Shield, Globe, Award } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  key?: string | number;
  project: Project;
  idx: number;
}

export default function ProjectCard({ project, idx }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for luxury organic fluid movement
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  // Highlight coordinates for glinting reflection overlay
  const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates to [-0.5, 0.5] range
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  const getIconForProject = (id: string) => {
    if (id.includes("edu") || id.includes("sentinel")) {
      return <Shield className="h-4 w-4 text-[#FF4E00]" />;
    }
    if (id.includes("bhasha") || id.includes("milan")) {
      return <Globe className="h-4 w-4 text-emerald-400" />;
    }
    return <Sparkles className="h-4 w-4 text-[#FF4E00]" />;
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        perspective: 1000,
      }}
      className="relative cursor-pointer group"
      id={`project-card-${project.id}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 md:p-8 backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#FF4E00]/5 hover:border-[#FF4E00]/30 overflow-hidden"
      >
        {/* Dynamic Glowing Light Highlight Sheet */}
        <motion.div
          style={{
            background: `radial-gradient(circle 120px at ${shineX} ${shineY}, rgba(255, 78, 0, 0.12) 0%, rgba(255, 78, 0, 0) 100%)`,
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Top Indicators */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 group-hover:border-[#FF4E00]/20 transition-all duration-300">
              {getIconForProject(project.id)}
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#FF4E00] font-semibold">{project.subtitle}</p>
              {project.metric && (
                <div className="flex items-center gap-1 mt-0.5" style={{ transform: "translateZ(10px)" }}>
                  <Award className="h-2.5 w-2.5 text-amber-500" />
                  <span className="text-[9px] font-mono font-medium text-amber-500 tracking-wider uppercase">{project.metric}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 rounded bg-slate-950/50 border border-slate-800 hover:text-[#FF4E00] hover:border-[#FF4E00]/40 transition duration-200"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 rounded bg-slate-950/50 border border-slate-800 hover:text-[#FF4E00] hover:border-[#FF4E00]/40 transition duration-200"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ transform: "translateZ(20px)" }} className="space-y-3.5">
          <h4 className="text-lg md:text-xl font-semibold text-white tracking-tight group-hover:text-orange-100 transition-colors duration-200">
            {project.title}
          </h4>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light min-h-[60px]">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div style={{ transform: "translateZ(15px)" }} className="flex flex-wrap gap-1.5 pt-6 mt-4 border-t border-slate-800/60">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/50 text-slate-400 border border-slate-900 font-medium group-hover:border-slate-800/80 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
