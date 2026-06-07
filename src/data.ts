import { PortfolioData } from "./types";

export const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Ayush Kushwaha",
    title: "BTech CSE Student | Cybersecurity | AI Builder",
    location: "Dehradun, Uttarakhand",
    email: "ak12chess@gmail.com",
    phone: "+91 9257508032",
    github: "https://github.com/Ayushkushwaha2005",
    linkedin: "https://linkedin.com/in/ayush-kushwaha-b881132b8",
    bio: "BTech Computer Science student specializing in Cybersecurity & AI with hands-on experience in hackathons, product development, leadership programs, and real-world problem solving. Skilled in programming, web technologies, cloud tools, and AI prototyping with experience building browser extensions, websites, and mobile app solutions. Certified in Generative AI and Google Cloud programs. Seeking internship opportunities to apply technical skills, gain industry exposure, and contribute to impactful projects.",
    avatarUrl: "https://github.com/Ayushkushwaha2005.png"
  },
  education: [
    {
      institution: "UPES, Dehradun",
      degree: "Bachelor of Technology in Computer Science Engineering",
      specialization: "Cybersecurity & Forensics",
      period: "2024 – Present"
    },
    {
      institution: "CSAIC Inter College, Prayagraj",
      degree: "Class XII",
      period: "Completed"
    }
  ],
  experience: [
    {
      company: "Dalit Vikas Avam Samajik Utthan Samiti",
      role: "Intern",
      period: "June 2025 – July 2025",
      location: "Dehradun",
      bullets: [
        "Managed documentation and reporting tasks for organizational activities.",
        "Assisted in awareness campaigns and event coordination.",
        "Streamlined task tracking and improved workflow support.",
        "Strengthened communication, teamwork, and professional discipline."
      ]
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["C", "Python", "Java", "JavaScript", "SQL"]
    },
    {
      category: "Web & Mobile",
      items: ["HTML", "CSS","React.js", "Node.js", "Flutter", "JSON", "Kotlin"]
    },
    {
      category: "AI / ML & Core CS",
      items: ["GenAI", "TFLite", "Google Colab", "DSA", "Problem Solving"]
    },
    {
      category: "Cloud",
      items: ["Google Cloud", "CI/CD", "Kubernetes"]
    },
    {
      category: "Security",
      items: ["Cybersecurity", "OSINT", "Kali Linux", "Shodan", "Nmap"]
    },
    {
      category: "Soft Skills",
      items: ["Leadership", "Teamwork", "Communication"]
    }
  ],
  projects: [
    {
      id: "edu_platform",
      title: "EduSentinel AI Platform",
      subtitle: "AMD Slingshot Hackathon 2026",
      description: "Developed a chrome browser extension and supporting backend website focused on digital scam detection, fake internship alerts, student safety, and social engineering awareness. Achieved Top 50 Team Selection and Top 10 Solo Rank.",
      tags: ["Cybersecurity", "AI Prototyping", "Scam Detection", "Chrome Extension"],
      metric: "Top 50 Team | Top 10 Solo"
    },
    {
      id: "edu_app",
      title: "EduSentinel AI App",
      subtitle: "Google Solution Challenge 2026",
      description: "An AI-driven, privacy-first mobile defense ecosystem designed to protect mobile users from SMS scams, phishing attempts, malicious download links, and device security risks using localized TF Lite and secure encrypted storage.",
      tags: ["Android", "Kotlin", "TensorFlow Lite", "Mobile Security"],
      metric: "Google Solution Challenge '26 Entry"
    },
    {
      id: "bhasha_milan",
      title: "Bhasha Milan",
      subtitle: "AI for Bharat Hackathon 2026",
      description: "Built a multilingual translation and inclusive voice-to-voice communication solution designed to dismantle language barriers and improve digital accessibility for verncular Indian users across diverse regions.",
      tags: ["GenAI", "Multilingual Chat", "Voice Access", "Inclusive Tech"],
      metric: "AI for Bharat Hackathon 2026"
    },
    {
      id: "season_cycle",
      title: "Season Cycle",
      subtitle: "Innovate4FinLit Game Challenge 2026",
      description: "Developed a gamified conceptual financial-simulator modeling agricultural seasonal patterns, microeconomics, and crop yields to improve budget awareness, savings strategies, and user engagement for regional farmers.",
      tags: ["Gamification", "Budget Modeling", "Product Design", "Microfinance"],
      metric: "Innovate4FinLit Game Challenge '26"
    }
  ],
  achievements: [
    {
      title: "Agentic Premier League (APL) 2026 – Solo Finalist(Build with AI)",
      organization: "Google Developer Group, Lucknow",
      highlight: true
    },
    {
      title: "AMD Slingshot Hackathon (2026) – Top 50 Team Selection",
      organization: "AMD, Jaipur",
      highlight: true
    },
    {
      title: "AMD Slingshot Hackathon (2026) – Top 10 Solo Rank",
      organization: "AMD, Jaipur",
      highlight: true
    },
    {
      title: "Chief Staff – AMD Slingshot Grand Finale 2026",
      organization: "AMD, Zorba, Gurugram",
      highlight: true
    },
    {
      title: "Crew Team Member – AMD Slingshot Hackathon 2026",
      organization: "AMD, IIIT Delhi",
      highlight: false
    },
    {
      title: "Event Staff Team Member – Prompt War 2026",
      organization: "Google Signature Tower D, Gurugram",
      highlight: false
    },
    {
      title: "Google Gemini Student Ambassador (2026) – Round 2 Selection",
      organization: "Google",
      highlight: true
    },
    {
      title: "Google Cloud Scholar – Applied Generative AI, Kubernetes & MLOps",
      organization: "Google Cloud",
      highlight: false
    },
    {
      title: "Campus Ambassador",
      organization: "Hack2Skill (2026)",
      highlight: false
    }
  ]
};
