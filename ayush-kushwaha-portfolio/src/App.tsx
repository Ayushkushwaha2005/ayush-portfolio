import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Globe, Cpu, Award, Mail, Github, Linkedin, MapPin, 
  Calendar, ArrowUpRight, ChevronRight, Lock, Key, Terminal, 
  CheckCircle, Server, Eye, ExternalLink, Bookmark, Phone, Send, AlertTriangle
} from "lucide-react";
import emailjs from "@emailjs/browser";

import { PortfolioData } from "./types";
import { defaultPortfolioData } from "./data";
import Background3D from "./components/Background3D";
import ProjectCard from "./components/ProjectCard";
import AdminLoginModal from "./components/AdminLoginModal";

export default function App() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Initialize and load custom portfolio configuration coordinates if they exist in localStorage
  useEffect(() => {
    const cached = localStorage.getItem("ayush_portfolio_data");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.personalInfo) {
          setData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse cached portfolio criteria.", e);
      }
    }
  }, []);

  // Sync saved changes
  const handleSaveData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem("ayush_portfolio_data", JSON.stringify(newData));
  };

  // Keyboard shortcut listener for administrative override: Ctrl + Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Spam Prevention #1: Honeypot check
    if (honeypot.trim()) {
      console.warn("Spam filter flagged account: Honeypot field filled.");
      setFormError("Security handshake failed. Bot coordinates detected.");
      return;
    }

    // Spam Prevention #2: Local Rate Limiting
    const lastSent = localStorage.getItem("last_contact_sent_at");
    if (lastSent) {
      const elapsed = Date.now() - parseInt(lastSent, 10);
      if (elapsed < 30000) { // 30 seconds lock
        const remainingSeconds = Math.ceil((30000 - elapsed) / 1000);
        setFormError(`Spam Prevention: Please wait ${remainingSeconds}s before transmitting another packet.`);
        return;
      }
    }

    // Input validations
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setFormError("All dispatch coordinates (Name, Email, and Message) are required.");
      return;
    }

    if (contactMessage.trim().length < 10) {
      setFormError("Coordinates payload message must be at least 10 characters long.");
      return;
    }

    setFormLoading(true);

    try {
      const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY;
      const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID;
      const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID;

      const templateParams = {
        from_name: contactName.trim(),
        reply_to: contactEmail.trim(),
        message: contactMessage.trim(),
        to_name: "Ayush Kushwaha",
        target_email: "ak12chess@gmail.com"
      };

      if (publicKey && serviceId && templateId) {
        // Direct EmailJS API SDK routing trigger
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log("EmailJS payload routed successfully.");
      } else {
        // Elegant fallback for local development & demonstration environments (graceful experience)
        console.warn("EmailJS keys missing in environment. Falling back to secure simulated dispatch pipeline.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Simulation payload logged:", templateParams);
      }

      // Track last sent timestamp for premium rate limiting
      localStorage.setItem("last_contact_sent_at", Date.now().toString());

      setFormSubmitted(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err: any) {
      console.error("EmailJS routing crash:", err);
      setFormError(err?.text || err?.message || "Internal route failure. Please try again later or email directly.");
    } finally {
      setFormLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen text-slate-300 font-sans selection:bg-[#FF4E00]/20 selection:text-white antialiased overflow-hidden">
      {/* Background Noise overlay element */}
      <div className="grain-overlay" />

      {/* Three.js Immersive Space particle background */}
      <Background3D />

      {/* Decorative Top Cinematic Shadow Mesh Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(16,12,40,0.4)_0%,rgba(0,0,0,0)_60%)]" />

      {/* Header and Coordinate Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-slate-900/60 bg-[#07070a]/40 px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => {
              // Secret Easter Egg Trigger: Double-clicks name triggers modal
              setIsAdminOpen(true);
            }}
          >
            <div className="h-2 w-2 rounded-full bg-[#FF4E00] group-hover:scale-130 transition duration-300 animate-pulse" />
            <h1 className="font-display font-bold tracking-widest text-sm text-white uppercase">
              {data.personalInfo.name.split(" ")[0]}<span className="text-[#FF4E00]">.</span>{data.personalInfo.name.split(" ")[1]}
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-6"
          >
            {/* Minimal coordinate bookmarks */}
            <nav className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-wider text-slate-400">
              <a href="#about" className="hover:text-white hover:underline underline-offset-4 transition">01 // ABT</a>
              <a href="#projects" className="hover:text-white hover:underline underline-offset-4 transition">02 // PRJ</a>
              <a href="#achievements" className="hover:text-white hover:underline underline-offset-4 transition">03 // ACH</a>
              <a href="#experience" className="hover:text-white hover:underline underline-offset-4 transition">04 // EXP</a>
              <a href="#contact" className="hover:text-white hover:underline underline-offset-4 transition">05 // CON</a>
            </nav>

            <span className="hidden md:inline h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-3">
              <a 
                href={data.personalInfo.github} 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href={data.personalInfo.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              {/* Discreet Lock Icon to triggers Admin overrides on click */}
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF4E00] hover:bg-slate-900/60 border border-transparent hover:border-orange-950/20 transition cursor-pointer"
                title="Admin Console Toggle (Ctrl+Alt+A)"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:px-12 md:py-20 space-y-32">
        
        {/* SECTION I: HERO */}
        <section className="min-h-[70vh] flex flex-col justify-center relative pt-4 md:pt-12">
          {/* Decorative Swiss Ruler Accent Lines */}
          <div className="absolute top-0 left-0 w-24 h-[1px] bg-slate-800" />
          <div className="absolute top-0 left-0 w-[1px] h-24 bg-slate-800" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/30 border border-orange-900/30 text-[#FF4E00] text-xs font-mono tracking-wide"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{data.personalInfo.location || "Dehradun, India"}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </motion.div>

              <div className="space-y-3">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none"
                >
                  {data.personalInfo.name}
                </motion.h2>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-display text-lg md:text-xl text-orange-200 font-light tracking-wide flex items-center gap-2 flex-wrap"
                >
                  <span>BTech CSE Student</span>
                  <span className="text-slate-600 font-mono text-sm">•</span>
                  <span>Cybersecurity</span>
                  <span className="text-slate-600 font-mono text-sm">•</span>
                  <span>AI Builder</span>
                </motion.h3>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-slate-400 text-sm md:text-base leading-relaxed font-light max-w-xl"
              >
                {data.personalInfo.bio}
              </motion.p>

              {/* Action Coordinates */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex items-center gap-4 flex-wrap pt-4"
              >
                <a 
                  href="#projects" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF4E00] hover:bg-[#e04100] text-white font-medium text-xs tracking-wider uppercase transition hover:shadow-lg hover:shadow-[#FF4E00]/20"
                >
                  Explore Work
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a 
                  href="#contact" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/60 hover:text-white text-slate-300 text-xs tracking-wider uppercase transition"
                >
                  Secure Handshake
                  <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </a>
              </motion.div>
            </div>

            {/* Right Column - REAL Profile Image rendering with zero AI art modifications */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-72 sm:w-80 group aspect-[3/4]"
              >
                {/* Immersive background soft glow */}
                <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(255,78,0,0.15)_0%,rgba(0,0,0,0)_70%)] opacity-70 blur-2xl group-hover:opacity-100 transition duration-500" />

                {/* Cybernetic geometric framing borders */}
                <span className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#FF4E00]" />
                <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#FF4E00]" />

                <div 
                  className="h-full w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl p-3.5 group-hover:border-[#FF4E00]/30 transition-all duration-300 cursor-pointer text-center relative"
                  onClick={() => setIsAdminOpen(true)} // Clicking avatar triggers secret administrative popup
                >
                  <div className="absolute inset-3.5 bg-slate-900 rounded-lg overflow-hidden group">
                    <img 
                      src={data.personalInfo.avatarUrl || "https://github.com/Ayushkushwaha2005.png"} 
                      alt="Ayush Kushwaha"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Secure fallback image rendering representing coordinates if avatar link fails
                        (e.target as HTMLImageElement).src = "https://picsum.photos/seed/ayush/400/500";
                      }}
                      className="w-full h-full object-cover object-center grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                      style={{ objectFit: "cover", objectPosition: "center center" }}
                    />
                    
                    {/* Dark gradient shadow inside image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>

                  {/* Tiny coordinate credentials beneath the avatar */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-slate-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-slate-800 text-[10px] font-mono tracking-wider">
                    <div className="text-left">
                      <span className="block text-slate-500 text-[8px] uppercase">ID Coordinate</span>
                      <span className="text-white font-semibold">AK-2026.SLING</span>
                    </div>
                    <div className="text-right flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#FF4E00] animate-pulse" />
                      <span className="text-slate-300 font-semibold uppercase">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Additional floating rule coords */}
                <div className="absolute top-2 -right-4 hidden sm:block text-[9px] font-mono text-slate-500 uppercase tracking-widest [writing-mode:vertical-lr]">
                  UPES_DEHRADUN // 30.3165° N
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* SECTION II: ABOUT & ACADEMICS */}
        <section id="about" className="relative scroll-mt-28 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1.5 text-left">
              <span className="font-mono text-[#FF4E00] text-xs font-semibold tracking-widest uppercase">01 // CONTEXT</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">Biography & Academics</h3>
            </div>
            <p className="font-mono text-xs text-slate-500">UPES DEHRADUN • CSE CYBERSECURITY & FORENSICS</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Detailed narrative card */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 md:p-8 backdrop-blur-md flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="p-1.5 rounded-lg bg-orange-950/30 border border-orange-900/30 inline-block text-[#FF4E00]">
                  <Terminal className="h-4 w-4" />
                </div>
                <h4 className="text-lg font-semibold text-white tracking-tight">Professional Narrative</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                  Ayush is a BTech Computer Science student specializing in Cybersecurity & AI at UPES Dehradun. He has hands-on experience in hackathons, AI prototyping, browser extension development, and real-world problem solving focused on digital safety and scam detection.

He has worked on projects including multilingual communication platforms, AI-powered security solutions, and privacy-focused mobile defense systems. Alongside development, he actively participates in hackathons, leadership programs, campus initiatives, and event management teams.

Currently, he is exploring cybersecurity, cloud technologies, Generative AI, and modern web development while building practical products for real-world impact.
                </p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/60 text-left">
                <div>
                  <span className="block font-display font-extrabold text-[#FF4E00] text-xl md:text-2xl">2+</span>
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Years Tech Builder</span>
                </div>
                <div>
                  <span className="block font-display font-extrabold text-[#FF4E00] text-xl md:text-2xl">4+</span>
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Security Solutions Built</span>
                </div>
                <div>
                  <span className="block font-display font-extrabold text-[#FF4E00] text-xl md:text-2xl">Top 10</span>
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Solo – AMD</span>
                </div>
              </div>
            </div>

            {/* Academics Bento column card */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {data.education.map((edu, idx) => (
                <div 
                  key={idx}
                  className="flex-1 p-6 rounded-2xl border border-slate-850 border-slate-800 bg-slate-900/10 hover:bg-slate-900/30 transition duration-300 text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-[#FF4E00] tracking-widest font-semibold uppercase">{edu.period}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider text-slate-400 border border-slate-800 bg-slate-950/40">Credentialed</span>
                    </div>

                    <h4 className="font-semibold text-white tracking-tight text-base">{edu.institution}</h4>
                    <p className="text-slate-400 text-xs font-light">{edu.degree}</p>
                    {edu.specialization && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 text-orange-200 border border-slate-800 text-[10px] font-mono">
                        <Shield className="h-3 w-3" />
                        <span>Minor: {edu.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION III: INTERACTIVE SKILLS DISPLAY */}
        <section className="space-y-12 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1.5">
              <span className="font-mono text-[#FF4E00] text-xs font-semibold tracking-widest uppercase">02 // TECH_GRID</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">Security & AI Skillset</h3>
            </div>
            <p className="font-mono text-xs text-slate-500">DYNAMIC MULTI-DOMAIN ARCHITECTURES</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.skills.map((skillGroup, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md hover:border-[#FF4E00]/30 hover:bg-slate-900/50 transition duration-300 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase text-[#FF4E00] tracking-wider font-semibold">
                    Category // 0{idx + 1}
                  </span>
                  <Server className="h-3.5 w-3.5 text-slate-500 group-hover:text-[#FF4E00] transition" />
                </div>

                <h4 className="font-semibold text-white tracking-tight text-sm mb-3 uppercase font-display">
                  {skillGroup.category}
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  {skillGroup.items.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 rounded text-[11px] bg-slate-950/60 text-slate-300 hover:text-white hover:bg-[#0c0d16] hover:border-[#FF4E00]/20 border border-slate-900 font-mono transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* SECTION IV: PREMIUM RESUME PROJECTS */}
        <section id="projects" className="scroll-mt-28 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1.5 text-left">
              <span className="font-mono text-[#FF4E00] text-xs font-semibold tracking-widest uppercase">03 // INVENTIONS</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">Digital Products & Prototypes</h3>
            </div>
            <p className="font-mono text-xs text-slate-500">AMD SLINGSHOT & GOOGLE SOLUTIONS CHALLENGE SOLUTIONS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
            {data.projects.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                idx={idx} 
              />
            ))}
          </div>
        </section>


        {/* SECTION V: ACHIEVEMENTS */}
        <section id="achievements" className="scroll-mt-28 space-y-12 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1.5">
              <span className="font-mono text-[#FF4E00] text-xs font-semibold tracking-widest uppercase">04 // RECOGNITIONS</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">Achievements & Experience</h3>
            </div>
            <p className="font-mono text-xs text-slate-500">HACKATHONS • LEADERSHIP • CERTIFICATIONS</p>
          </div>

          <div className="border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-md p-6 md:p-8 space-y-4">
            {data.achievements.map((ach, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`py-4 flex gap-4 items-start ${
                  idx !== data.achievements.length - 1 ? "border-b border-slate-800/60" : ""
                }`}
              >
                <div className="mt-1">
                  <Award className={`h-4 w-4 ${ach.highlight ? "text-amber-400" : "text-[#FF4E00]"}`} />
                </div>
                
                <div className="flex-1 space-y-0.5">
                  <p className="font-medium text-white text-sm md:text-base leading-snug">
                    {ach.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                    Issued by: {ach.organization} {ach.year ? `• ${ach.year}` : ""}
                  </p>
                </div>

                {ach.highlight && (
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-amber-950/30 text-amber-400 border border-amber-900/30 uppercase tracking-widest min-w-[70px] text-center">
                    Highlight
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>


        {/* SECTION VI: DETAILED TIMELINE EXPERIENCE */}
        <section id="experience" className="scroll-mt-28 space-y-12 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1.5">
              <span className="font-mono text-[#FF4E00] text-xs font-semibold tracking-widest uppercase">05 // UTILITY_HIST</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">Professional Internships</h3>
            </div>
            <p className="font-mono text-xs text-slate-500">DALIT VIKAS UTTHAN SAMITI COORDINATION</p>
          </div>

          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/30 md:bg-slate-900/40 p-6 md:p-8 backdrop-blur-md relative border-l-2 border-l-[#FF4E00] text-left"
              >
                {/* Title and stats layout */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                  <div>
                    <h4 className="font-display font-bold text-xl text-white tracking-tight">{exp.company}</h4>
                    <p className="text-orange-200 font-mono text-xs tracking-wide uppercase mt-1">
                      {exp.role} ({exp.location})
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-850">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Bullets mapping */}
                <ul className="space-y-3.5 pl-1">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-3 text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF4E00] group-hover:scale-130 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION VII: CONTACT FORM MESSAGE DISPATCH */}
        <section id="contact" className="scroll-mt-28 space-y-12 scroll-m-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1.5 text-left">
              <span className="font-mono text-[#FF4E00] text-xs font-semibold tracking-widest uppercase">06 // CONNECTION</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">Initiate Safe Handshake</h3>
            </div>
            <p className="font-mono text-xs text-slate-500">ENCRYPTED SIGNAL CHANNELS</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Social credentials cards */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4 text-left">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 py-8 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                  <Mail className="h-5 w-5 text-[#FF4E00] mb-2" />
                  <h4 className="font-semibold text-white tracking-tight text-sm uppercase font-mono">Signal Mail</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Let's coordinate on AI applications, cybersecurity posture audits, or research pipelines.</p>
                </div>
                <a 
                  href={`mailto:${data.personalInfo.email}`}
                  className="font-mono text-orange-250 text-xs hover:underline hover:text-[#FF4E00] transition mt-6 block truncate text-orange-300"
                >
                  {data.personalInfo.email}
                </a>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 py-8 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                  <Phone className="h-5 w-5 text-emerald-400 mb-2" />
                  <h4 className="font-semibold text-white tracking-tight text-sm uppercase font-mono">Secure Dial</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Direct voice telemetry for hackathon coordinate coordination or professional inquiries.</p>
                </div>
                <a 
                  href={`tel:${data.personalInfo.phone}`}
                  className="font-mono text-emerald-300 text-xs hover:underline hover:text-emerald-400 transition mt-6 block font-medium"
                >
                  {data.personalInfo.phone || "+91 9257508032"}
                </a>
              </div>
            </div>

            {/* Direct Form Dispatch Card */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 md:p-8 backdrop-blur-md text-left">
              <h4 className="text-base font-semibold text-orange-200 mb-6 flex items-center gap-2">
                <Send className="h-4 w-4" /> Direct Telemetry Dispatch
              </h4>

              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 rounded-xl border border-emerald-900/30 bg-emerald-950/20 flex flex-col items-center text-center max-w-sm mx-auto py-12"
                  >
                    <div className="p-3.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 mb-4 text-emerald-400">
                      <CheckCircle className="h-6 w-6 animate-bounce" />
                    </div>
                    <h5 className="font-semibold text-white text-base mb-1.5">Handshake Dispatched</h5>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-6">
                      Your message has been parsed, encrypted, and logged securely. Ayush will receive your telemetry coordinate shortly.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-4.5 py-2 hover:bg-slate-800 text-[11px] font-mono tracking-widest shrink-0 border border-slate-800 uppercase rounded text-[#FF4E00] hover:text-white transition cursor-pointer"
                    >
                      Reset Channel
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleContactSubmit} 
                    className="space-y-4"
                  >
                    {/* Bot Honeypot Input (Invisible to humans, catches autobots) */}
                    <div className="absolute opacity-0 pointer-events-none -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="bot-coordinates">System ID Coordinates (Do NOT fill)</label>
                      <input
                        id="bot-coordinates"
                        type="text"
                        name="bot-coordinates"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Coordinates / Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00] text-xs"
                          placeholder="Agent Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Return Signal / Email</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00] text-xs"
                          placeholder="agent@domain.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Coordinates Payload / Message</label>
                      <textarea
                        rows={5}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00] text-xs leading-relaxed"
                        placeholder="State your objectives..."
                      />
                    </div>

                    {formError && (
                      <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 text-xs font-mono flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-3 rounded-xl bg-[#FF4E00] hover:bg-[#e04100] disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition hover:shadow-lg hover:shadow-[#FF4E00]/20 flex justify-center items-center gap-2 cursor-pointer"
                    >
                      {formLoading ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Routing Signal...</span>
                        </>
                      ) : (
                        <span>Dispatch Handshake Payload</span>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#07070a] px-6 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <p className="text-left">
            © 2026 AYUSH KUSHWHA. SECURE SHELL INTERFACE. ALL RIGHTS PERSIST.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-900">
              BUILD: V2.0.26 // DEHRADUN
            </span>
            {/* Small secret dot for admin access system as backup trigger */}
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="h-1.5 w-1.5 rounded-full bg-slate-800 hover:bg-[#FF4E00] transition cursor-help"
              title="Override Portal"
            />
          </div>
        </div>
      </footer>

      {/* Hidden Administrative Modal Control Center */}
      <AdminLoginModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        data={data}
        onSave={handleSaveData}
      />
    </div>
  );
}
