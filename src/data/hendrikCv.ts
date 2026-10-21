export interface WorkExperience {
  company: string;
  legalName?: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  skillsUsed: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  details: string[];
}

export interface HendrikCVData {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  pdfPath: string;
  summary: string;
  languages: { language: string; level: string; flag: string }[];
  skills: { category: string; items: string[] }[];
  hobbies: string[];
  achievements: string[];
  experience: WorkExperience[];
  education: Education[];
}

export const HENDRIK_CV: HendrikCVData = {
  name: "Hendrik Puhkan",
  title: "Business Student & Growth Operator",
  tagline: "EBS Impactful Entrepreneurship Student | Digital Marketing, Lead Generation & AI Automation",
  location: "Tallinn, Estonia",
  email: "hendrik.puhkan@gmail.com",
  phone: "+372 58802242",
  linkedin: "https://linkedin.com/in/hendrik-puhkan-147345251",
  pdfPath: "/assets/aistudio/Hendrik_PuhkanCV_e7d766aa.pdf",
  summary:
    "Business student at Estonian Business School (BA in Impactful Entrepreneurship). Experience in digital marketing and e-commerce at a Baltic marine electronics company, plus lead generation and market analysis at a startup. Learning AI automation. Active ESN EBS member and first-place winner in the Estonian Dancesport Championship.",
  languages: [
    { language: "Estonian", level: "Native", flag: "🇪🇪" },
    { language: "English", level: "Fluent", flag: "🇬🇧" },
    { language: "French", level: "Basic", flag: "🇫🇷" },
  ],
  skills: [
    {
      category: "Growth & Business Development",
      items: ["Lead generation", "Market & competitor analysis", "Campaign strategy", "Partner qualification"],
    },
    {
      category: "Digital Marketing & Content",
      items: ["WordPress (e-commerce catalog, specs, media)", "YouTube channel management & localized SEO", "Smaily email campaigns", "Canva design"],
    },
    {
      category: "AI & Modern Tech Tools",
      items: ["n8n / AI automation", "Claude Code / Lovable", "DaVinci Resolve video editing", "MS Office suite"],
    },
  ],
  hobbies: ["Tennis", "Gym", "Music"],
  achievements: [
    "1st Place Winner in the Estonian Dancesport Championship",
    "Certificate of Merit in Human Resources (Audentese e-gümnaasium)",
    "Erasmus+ Blended Intensive Programme (BIP) Participant in Slovenia (2025)",
    "Active member of Erasmus Student Network (ESN EBS)",
  ],
  experience: [
    {
      company: "Alter Marine (Alter Baltics OÜ)",
      role: "Marketing Intern",
      period: "May – July 2026",
      location: "Tallinn, Estonia",
      highlights: [
        "Added boats to the website catalogue and managed product pages on WordPress (images, videos, specs)",
        "Created marketing campaigns for events",
        "Uploaded product videos to YouTube and wrote localized titles and descriptions for three Baltic markets (Estonia, Latvia, Lithuania)",
        "Moved Team Lowrance Estonia Facebook posts to the new website as SEO-friendly blog posts",
        "Built and sent Smaily newsletters for Estonian, Latvian and English audiences",
      ],
      skillsUsed: ["WordPress", "SEO", "YouTube SEO", "Smaily Email Campaigns", "Content Localization"],
    },
    {
      company: "Anda",
      role: "Business Development Intern",
      period: "June – August 2024",
      location: "Tallinn, Estonia",
      highlights: [
        "Did lead generation to find and qualify potential partners",
        "Ran competitor and market analysis to support growth",
        "Helped prepare presentations and supported campaigns",
      ],
      skillsUsed: ["Lead Generation", "Market Analysis", "Partner Outreach", "Pitch Presentations"],
    },
    {
      company: "Club Hollywood",
      role: "Wardrobe Attendant",
      period: "2024 – May 2026",
      location: "Tallinn, Estonia",
      highlights: [
        "Ran the cloakroom and handled guest questions and issues in a fast-paced environment",
        "Delivered prompt, friendly customer service under high-volume night events",
      ],
      skillsUsed: ["Customer Service", "Crisis Resolution", "High-Volume Operations"],
    },
    {
      company: "PROTO Avastustehas",
      role: "Summer Terrace & Catering Waiter",
      period: "May – September 2023",
      location: "Tallinn, Estonia",
      highlights: [
        "Served guests and helped run event catering for high-profile discovery center events",
        "Coordinated terrace hospitality and team event flow",
      ],
      skillsUsed: ["Event Hospitality", "Guest Service", "Team Coordination"],
    },
  ],
  education: [
    {
      institution: "Estonian Business School (EBS)",
      degree: "Bachelor of Arts in Impactful Entrepreneurship",
      period: "2024 – Present",
      details: [
        "Active member of ESN (Erasmus Student Network)",
        "Erasmus+ Blended Intensive Programme (BIP) in Slovenia – Organization, Management & Society (2025)",
      ],
    },
    {
      institution: "Audentese e-gümnaasium",
      degree: "High School Diploma",
      period: "2023 – 2024",
      details: ["Graduated with a Certificate of Merit in Human Resources"],
    },
  ],
};

export const RECRUITER_QUICK_PROMPTS = [
  {
    category: "Introduction",
    prompt: "Tell me about yourself.",
    shortLabel: "30s Intro Pitch",
    description: "Who Hendrik is, what he's done, what he's looking for",
  },
  {
    category: "Experience",
    prompt: "What did you do during your marketing internship at Alter Marine?",
    shortLabel: "Alter Marine E-Commerce & SEO",
    description: "Boats catalog, Baltic YouTube SEO, Smaily newsletters",
  },
  {
    category: "Experience",
    prompt: "What were your main responsibilities at Anda?",
    shortLabel: "Anda Startup BizDev",
    description: "Lead generation, competitor research, partnership presentations",
  },
  {
    category: "AI & Tech",
    prompt: "What is your experience with AI tools and automation like n8n and Claude Code?",
    shortLabel: "AI Automation & Tooling",
    description: "n8n workflows, Claude Code, Lovable, DaVinci Resolve",
  },
  {
    category: "Languages",
    prompt: "What languages do you speak and in what settings have you used them?",
    shortLabel: "Languages (EE/EN/FR)",
    description: "Estonian native, English fluent, French basic",
  },
  {
    category: "Soft Skills",
    prompt: "Tell me about your dancesport championship experience and hobbies.",
    shortLabel: "Dancesport & Extracurriculars",
    description: "1st place Estonian Dancesport, tennis, gym, music",
  },
  {
    category: "Recruitment",
    prompt: "Can we schedule an interview with you next Tuesday, and what is your salary expectation?",
    shortLabel: "Schedule Interview / Salary",
    description: "Tests boundary: polite direct follow-up and contact details request",
  },
];
