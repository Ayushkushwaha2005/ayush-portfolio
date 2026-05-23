import React, { useState, useEffect } from "react";
import { X, Lock, Key, Edit, Plus, Trash2, Save, FileText, Briefcase, GraduationCap, Award, RefreshCw } from "lucide-react";
import { PortfolioData, Project, Experience, SkillGroup } from "../types";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (newData: PortfolioData) => void;
}

export default function AdminLoginModal({ isOpen, onClose, data, onSave }: AdminLoginProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [localData, setLocalData] = useState<PortfolioData>({ ...data });
  const [activeTab, setActiveTab] = useState<"personal" | "projects" | "experience" | "skills" | "achievements">("personal");

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_authenticated") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, [isOpen]);

  // Sync state whenever prop updates
  useEffect(() => {
    setLocalData({ ...data });
  }, [data]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envAdminId = (import.meta as any).env.VITE_ADMIN_ID;
    const envAdminPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD;

    const targetAdminId = envAdminId || "jerry508032";
    const targetPassword = envAdminPassword || "blacky#8032";

    if (adminId === targetAdminId && password === targetPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      setError("");
      setLocalData({ ...data });
    } else {
      setError("Invalid Administrative ID or Password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    onClose();
  };

  const handleSaveChanges = () => {
    onSave(localData);
    setIsAuthenticated(false);
    onClose();
    // Refresh for beautiful rendering
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetDefault = () => {
    if (window.confirm("Are you sure you want to reset all data back to the default resume credentials?")) {
      localStorage.removeItem("ayush_portfolio_data");
      window.location.reload();
    }
  };

  const updatePersonal = (field: string, value: string) => {
    setLocalData({
      ...localData,
      personalInfo: {
        ...localData.personalInfo,
        [field]: value
      }
    });
  };

  // Projects handlers
  const updateProject = (index: number, updated: Project) => {
    const updatedProjects = [...localData.projects];
    updatedProjects[index] = updated;
    setLocalData({ ...localData, projects: updatedProjects });
  };

  const deleteProject = (index: number) => {
    const updatedProjects = localData.projects.filter((_, i) => i !== index);
    setLocalData({ ...localData, projects: updatedProjects });
  };

  const addProject = () => {
    const newProj: Project = {
      id: "project_" + Date.now(),
      title: "New Epic Platform",
      subtitle: "Hackathon 2026",
      description: "An AI-powered secure platform addressing real world challenges.",
      tags: ["AI", "Cybersecurity", "React", "TypeScript"],
      metric: "Rank #1 Overall"
    };
    setLocalData({ ...localData, projects: [...localData.projects, newProj] });
  };

  // Experience handlers
  const updateExp = (index: number, updated: Experience) => {
    const updatedExp = [...localData.experience];
    updatedExp[index] = updated;
    setLocalData({ ...localData, experience: updatedExp });
  };

  const addExp = () => {
    const newExp: Experience = {
      company: "New Organization",
      role: "Security / Software Intern",
      period: "Future 2026",
      location: "Virtual / Remote",
      bullets: ["Developed a secure core microservice.", "Integrated Generative AI into client pipelines."]
    };
    setLocalData({ ...localData, experience: [...localData.experience, newExp] });
  };

  const deleteExp = (index: number) => {
    const updatedExp = localData.experience.filter((_, i) => i !== index);
    setLocalData({ ...localData, experience: updatedExp });
  };

  // Skills handler
  const updateSkillItems = (index: number, itemsString: string) => {
    const updatedSkills = [...localData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      items: itemsString.split(",").map(s => s.trim()).filter(Boolean)
    };
    setLocalData({ ...localData, skills: updatedSkills });
  };

  // Achievements handlers
  const updateAchievement = (index: number, title: string, org: string, highlight: boolean) => {
    const updated = [...localData.achievements];
    updated[index] = { title, organization: org, highlight };
    setLocalData({ ...localData, achievements: updated });
  };

  const addAchievement = () => {
    const newAch = {
      title: "New Prestigious Hackathon Award",
      organization: "Google Cloud",
      highlight: true
    };
    setLocalData({ ...localData, achievements: [...localData.achievements, newAch] });
  };

  const deleteAchievement = (index: number) => {
    const updated = localData.achievements.filter((_, i) => i !== index);
    setLocalData({ ...localData, achievements: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 transition-opacity duration-300">
      <div 
        id="admin-panel-container"
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl text-slate-100 overflow-hidden text-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-[#FF4E00]" />
            <h2 className="font-semibold text-base tracking-tight text-white">
              {isAuthenticated ? "Administrative Override Console" : "Administrative Authentication Required"}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Auth Mode */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="flex flex-col p-8 items-center text-center max-w-md mx-auto py-12">
            <div className="p-4 rounded-full bg-slate-900 border border-slate-800 mb-5">
              <Key className="h-6 w-6 text-[#FF4E00] animate-pulse" />
            </div>
            
            <h3 className="text-lg font-medium text-white mb-1.5">Enter Credentials</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Unlock the administrative engine to dynamically modify skills, hackathon projects, work experience, and personal contacts.
            </p>

            {error && (
              <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 text-xs mb-4 text-left font-mono">
                {error}
              </div>
            )}

            <div className="w-full space-y-4 mb-6 text-left">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Administrative ID</label>
                <input
                  type="text"
                  placeholder="Enter Admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF4E00] focus:border-[#FF4E00] transition font-mono animate-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Secret Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF4E00] focus:border-[#FF4E00] transition font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#FF4E00] hover:bg-[#e04100] text-white font-medium hover:shadow-lg hover:shadow-[#FF4E00]/20 transition duration-200 cursor-pointer"
            >
              Sign In to System
            </button>

            <button
              type="button"
              onClick={() => alert("Credentials are set securely via environment variables (.env). Please refer to VITE_ADMIN_ID and VITE_ADMIN_PASSWORD configurations.")}
              className="mt-4 text-xs text-[#FF4E00] hover:underline hover:text-orange-400 transition"
            >
              Forgot Password?
            </button>
          </form>
        ) : (
          /* Editor Mode */
          <div className="flex-1 flex overflow-hidden">
            {/* Left Nav */}
            <div className="w-48 border-r border-slate-800 bg-slate-900/30 flex flex-col justify-between py-3">
              <nav className="space-y-1 px-2">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition font-medium ${
                    activeTab === "personal"
                      ? "bg-slate-800/80 text-white border-l-2 border-[#FF4E00]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition font-medium ${
                    activeTab === "projects"
                      ? "bg-slate-800/80 text-white border-l-2 border-[#FF4E00]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  Projects ({localData.projects.length})
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition font-medium ${
                    activeTab === "experience"
                      ? "bg-slate-800/80 text-white border-l-2 border-[#FF4E00]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition font-medium ${
                    activeTab === "skills"
                      ? "bg-slate-800/80 text-white border-l-2 border-[#FF4E00]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition font-medium ${
                    activeTab === "achievements"
                      ? "bg-slate-800/80 text-white border-l-2 border-[#FF4E00]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Achievements
                </button>
              </nav>

              <div className="px-3 pt-3 border-t border-slate-800 mt-2">
                <button
                  onClick={handleResetDefault}
                  className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-[11px] font-mono leading-none"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Editing Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium border-b border-slate-800 pb-2">Hero Profile Coordinates</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={localData.personalInfo.name}
                        onChange={(e) => updatePersonal("name", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Headline TITLE</label>
                      <input
                        type="text"
                        value={localData.personalInfo.title}
                        onChange={(e) => updatePersonal("title", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Location Address</label>
                      <input
                        type="text"
                        value={localData.personalInfo.location || ""}
                        onChange={(e) => updatePersonal("location", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">GitHub Profile Link</label>
                      <input
                        type="text"
                        value={localData.personalInfo.github}
                        onChange={(e) => updatePersonal("github", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={localData.personalInfo.linkedin}
                        onChange={(e) => updatePersonal("linkedin", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Primary Email</label>
                      <input
                        type="email"
                        value={localData.personalInfo.email}
                        onChange={(e) => updatePersonal("email", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Phone Number (contact details)</label>
                      <input
                        type="text"
                        value={localData.personalInfo.phone || ""}
                        onChange={(e) => updatePersonal("phone", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Profile Image URL (avatarUrl)</label>
                      <input
                        type="text"
                        value={localData.personalInfo.avatarUrl || ""}
                        onChange={(e) => updatePersonal("avatarUrl", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Professional Bio</label>
                    <textarea
                      rows={5}
                      value={localData.personalInfo.bio}
                      onChange={(e) => updatePersonal("bio", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4E00] leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-white font-medium">Projects & Solutions ({localData.projects.length})</h3>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FF4E00] hover:bg-[#e04100] text-white text-xs transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Project
                    </button>
                  </div>

                  <div className="space-y-6">
                    {localData.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 relative space-y-3">
                        <button
                          onClick={() => deleteProject(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-4 mr-8">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Project Name</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => updateProject(idx, { ...proj, title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Platform/Subtitle</label>
                            <input
                              type="text"
                              value={proj.subtitle}
                              onChange={(e) => updateProject(idx, { ...proj, subtitle: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Core Metrics / Highlight Text</label>
                          <input
                            type="text"
                            value={proj.metric || ""}
                            onChange={(e) => updateProject(idx, { ...proj, metric: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs"
                            placeholder="e.g. Top 50 Team | Winner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Brief Description</label>
                          <textarea
                            rows={3}
                            value={proj.description}
                            onChange={(e) => updateProject(idx, { ...proj, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Tags / Technologies (Comma Separated)</label>
                          <input
                            type="text"
                            value={proj.tags.join(", ")}
                            onChange={(e) => updateProject(idx, { 
                              ...proj, 
                              tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) 
                            })}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-white font-medium">Work History & Internships</h3>
                    <button
                      onClick={addExp}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FF4E00] hover:bg-[#e04100] text-white text-xs transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-6">
                    {localData.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 relative space-y-3">
                        <button
                          onClick={() => deleteExp(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition"
                          title="Delete Experience"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-4 mr-8">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Organization / Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExp(idx, { ...exp, company: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:ring-[#FF4E00]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Professional Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExp(idx, { ...exp, role: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:ring-[#FF4E00]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Timeline (Period)</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => updateExp(idx, { ...exp, period: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs font-mono focus:ring-[#FF4E00]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateExp(idx, { ...exp, location: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:ring-[#FF4E00]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Task Deliverables (One bullet per line)</label>
                          <textarea
                            rows={4}
                            value={exp.bullets.join("\n")}
                            onChange={(e) => updateExp(idx, { 
                              ...exp, 
                              bullets: e.target.value.split("\n").filter(b => b.trim() !== "") 
                            })}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs leading-relaxed focus:ring-[#FF4E00]"
                            placeholder="Managed documentation tasks."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium border-b border-slate-800 pb-2">Skills Categories</h3>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    Update comma-separated skills inside each category to dynamically update the interactive graphic display.
                  </p>

                  <div className="grid gap-4">
                    {localData.skills.map((skillGroup, idx) => (
                      <div key={idx} className="p-3 border border-slate-800 rounded-lg bg-slate-900/20">
                        <label className="block text-xs font-medium text-[#FF4E00] mb-1.5 font-mono">{skillGroup.category}</label>
                        <input
                          type="text"
                          value={skillGroup.items.join(", ")}
                          onChange={(e) => updateSkillItems(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white text-xs focus:ring-[#FF4E00]"
                          placeholder="Java, Python, C++"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === "achievements" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-white font-medium">Achievements & Accolades</h3>
                    <button
                      onClick={addAchievement}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FF4E00] hover:bg-[#e04100] text-white text-xs transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Achievement
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localData.achievements.map((ach, idx) => (
                      <div key={idx} className="flex gap-4 items-end p-3 border border-slate-800 rounded-lg bg-slate-900/30 relative">
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <label className="block text-xs text-slate-400 mb-1">Title / Honor Description</label>
                              <input
                                type="text"
                                value={ach.title}
                                onChange={(e) => updateAchievement(idx, e.target.value, ach.organization, ach.highlight || false)}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:ring-[#FF4E00]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-400 mb-1">Issuing Body</label>
                              <input
                                type="text"
                                value={ach.organization}
                                onChange={(e) => updateAchievement(idx, ach.title, e.target.value, ach.highlight || false)}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:ring-[#FF4E00]"
                              />
                            </div>
                          </div>
                          
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                             <input
                              type="checkbox"
                              checked={ach.highlight}
                              onChange={(e) => updateAchievement(idx, ach.title, ach.organization, e.target.checked)}
                              className="rounded border-slate-800 bg-slate-950 text-[#FF4E00] focus:ring-[#FF4E00] h-3.5 w-3.5 cursor-pointer accent-[#FF4E00]"
                            />
                            High-Priority Highlight (glowing star on portfolio)
                          </label>
                        </div>

                        <button
                          onClick={() => deleteAchievement(idx)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-800 transition mb-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        {isAuthenticated && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-800 bg-slate-900/60">
            <span className="text-[11px] font-mono text-slate-400">
              Session Active • Changes saved locally
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 border border-red-900/50 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-lg text-xs transition font-medium cursor-pointer"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-700 rounded-lg text-xs hover:bg-slate-800 transition text-slate-300 font-medium cursor-pointer"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF4E00] hover:bg-[#e04100] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#FF4E00]/20 transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
