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

export interface QuickPrompt {
  category: string;
  categoryEt: string;
  prompt: string;
  promptEt: string;
  shortLabel: string;
  shortLabelEt: string;
  description: string;
  descriptionEt: string;
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
  summaryEt: string;
  languages: { language: string; level: string; flag: string }[];
  skills: { category: string; categoryEt: string; items: string[] }[];
  hobbies: string[];
  hobbiesEt: string[];
  achievements: string[];
  achievementsEt: string[];
  experience: WorkExperience[];
  education: Education[];
}

export const OPENING_LINES = {
  en: "Hi, I'm an AI assistant representing Hendrik Puhkan. I can tell you about my background, skills, and projects. What would you like to know?",
  et: "Tere! Olen Hendrik Puhkanit esindav tehisintellekti häälassistent. Saan rääkida oma haridusest, töökogemusest ja oskustest. Mida sooviksite teada?",
};

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
  summaryEt:
    "Estonian Business Schooli ettevõtlustudeng (BA Mõjukas Ettevõtlus). Digiturunduse ja e-kaubanduse kogemus Baltikumi meretööstuse elektroonikaettevõttes ning müügivihjete genereerimine ja turuanalüüs idufirmas. Õpin tehisintellekti automatiseerimist. Aktiivne ESN EBS liige ja Eesti tantsuspordi meistrivõistluste esikoha omanik.",
  languages: [
    { language: "Estonian", level: "Native (Emakeel)", flag: "🇪🇪" },
    { language: "English", level: "Fluent (Vabalt)", flag: "🇬🇧" },
    { language: "French", level: "Basic (Algteadmised)", flag: "🇫🇷" },
  ],
  skills: [
    {
      category: "Growth & Business Development",
      categoryEt: "Äriarendus ja Müük",
      items: ["Lead generation", "Market & competitor analysis", "Campaign strategy", "Partner qualification"],
    },
    {
      category: "Digital Marketing & Content",
      categoryEt: "Digiturundus ja Sisuloome",
      items: ["WordPress (e-commerce catalog, specs, media)", "YouTube channel management & localized SEO", "Smaily email campaigns", "Canva design"],
    },
    {
      category: "AI & Modern Tech Tools",
      categoryEt: "Tehisintellekt ja Automatiseerimine",
      items: ["n8n / AI automation", "Claude Code / Lovable", "DaVinci Resolve video editing", "MS Office suite"],
    },
  ],
  hobbies: ["Tennis", "Gym", "Music"],
  hobbiesEt: ["Tennis", "Jõusaal", "Muusika"],
  achievements: [
    "1st Place Winner in the Estonian Dancesport Championship",
    "Certificate of Merit in Human Resources (Audentese e-gümnaasium)",
    "Erasmus+ Blended Intensive Programme (BIP) Participant in Slovenia (2025)",
    "Active member of Erasmus Student Network (ESN EBS)",
  ],
  achievementsEt: [
    "1. koht Eesti tantsuspordi meistrivõistlustel",
    "Kiituskiri inimressursside juhtimise alal (Audentese e-gümnaasium)",
    "Erasmus+ Blended Intensive Programme (BIP) Sloveenias (2025)",
    "Erasmus Student Networki (ESN EBS) aktiivne liige",
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

export const RECRUITER_QUICK_PROMPTS: QuickPrompt[] = [
  {
    category: "Introduction",
    categoryEt: "Tutvustus",
    prompt: "Tell me about yourself.",
    promptEt: "Räägi mulle lühidalt endast.",
    shortLabel: "30s Pitch",
    shortLabelEt: "30s Enesetutvustus",
    description: "Who Hendrik is, what he's done, what he's looking for",
    descriptionEt: "Kes Hendrik on, mis kogemused tal on ja mida otsib",
  },
  {
    category: "Experience",
    categoryEt: "Töökogemus",
    prompt: "What did you do during your marketing internship at Alter Marine?",
    promptEt: "Mida sa tegid turunduspraktikal Alter Marine'is?",
    shortLabel: "Alter Marine E-Commerce & SEO",
    shortLabelEt: "Alter Marine & SEO",
    description: "Boats catalog, Baltic YouTube SEO, Smaily newsletters",
    descriptionEt: "Paatide kataloog, Baltikumi YouTube SEO, uudiskirjad",
  },
  {
    category: "Experience",
    categoryEt: "Töökogemus",
    prompt: "What were your main responsibilities at Anda?",
    promptEt: "Millised olid su peamised ülesanded idufirmas Anda?",
    shortLabel: "Anda Startup BizDev",
    shortLabelEt: "Anda Äriarendus",
    description: "Lead generation, competitor research, partnership presentations",
    descriptionEt: "Müügivihjed, konkurentsianalüüs, partnerlussuhted",
  },
  {
    category: "AI & Tech",
    categoryEt: "AI ja Tehnoloogia",
    prompt: "What is your experience with AI tools and automation like n8n and Claude Code?",
    promptEt: "Milline on sinu kogemus AI tööriistade ja automatiseerimisega nagu n8n ja Claude Code?",
    shortLabel: "AI Automation Tools",
    shortLabelEt: "AI ja n8n Tööriistad",
    description: "n8n workflows, Claude Code, Lovable, DaVinci Resolve",
    descriptionEt: "n8n automatiseerimine, Claude Code, Lovable",
  },
  {
    category: "Languages",
    categoryEt: "Keeled",
    prompt: "What languages do you speak and in what settings have you used them?",
    promptEt: "Mis keeli sa valdad ja millistes olukordades oled neid kasutanud?",
    shortLabel: "Language Fluency",
    shortLabelEt: "Keeleoskus (EE / EN / FR)",
    description: "Estonian native, English fluent, French basic",
    descriptionEt: "Eesti emakeel, inglise keel vabalt, prantsuse algtase",
  },
  {
    category: "Soft Skills",
    categoryEt: "Saavutused",
    prompt: "Tell me about your dancesport championship experience and hobbies.",
    promptEt: "Räägi oma tantsuspordi meistritiitlist ja hobidest.",
    shortLabel: "Dancesport & Passions",
    shortLabelEt: "Tantsusport ja Hobid",
    description: "1st place Estonian Dancesport, tennis, gym, music",
    descriptionEt: "Eesti meister tantsuspordis, tennis, jõusaal, muusika",
  },
  {
    category: "Recruitment",
    categoryEt: "Töövestlus",
    prompt: "Can we schedule an interview with you next Tuesday, and what is your salary expectation?",
    promptEt: "Kas saaksime leppida kokku töövestluse ja milline on su palgasoov?",
    shortLabel: "Interview & Salary Check",
    shortLabelEt: "Töövestlus ja Palgasoov",
    description: "Tests boundary: polite direct follow-up and contact details request",
    descriptionEt: "Testib piire: suunab otse Hendrikuga ühendust võtma",
  },
];
