export type CourseRow = {
  technology: string;
  module: string;
  specialization: string;
  year: string;
  live: string;
  virtual: string;
  certification: string;
};

export const engineeringCourses: CourseRow[] = [
  {
    technology: "AutoCAD",
    module: "Beginner Level",
    specialization: "Mechanical, Civil",
    year: "1st year, 2nd semester",
    live: "2 days",
    virtual: "3 days @ 2 hrs / day",
    certification: "Course completion certificate by TASK",
  },
  {
    technology: "AutoCAD",
    module: "User Level",
    specialization: "Mechanical, Civil",
    year: "2nd year, 1st & 2nd semesters",
    live: "3 days",
    virtual: "4 days @ 3 hrs / day",
    certification: "Course completion certificate by TASK",
  },
  {
    technology: "AutoCAD",
    module: "Professional Level",
    specialization: "Mechanical, Civil",
    year: "3rd year, 1st & 2nd semesters",
    live: "5 days",
    virtual: "6 days @ 3 hrs / day",
    certification: "Course completion certificate by TASK",
  },
  {
    technology: "Fusion360",
    module: "User Level",
    specialization: "Mechanical, Civil",
    year: "3rd year, 2nd semester & 4th year, 1st semester",
    live: "3 days",
    virtual: "5 days @ 3 hrs / day",
    certification: "Course completion certificate by TASK",
  },
  {
    technology: "Additive Manufacturing – 3D Printing",
    module: "Introduction",
    specialization: "All Branches",
    year: "2nd year, 2nd semester",
    live: "2 days",
    virtual: "NA",
    certification: "—",
  },
  {
    technology: "Java",
    module: "Fundamentals",
    specialization: "All branches",
    year: "2nd year, 1st semester",
    live: "3 days",
    virtual: "5 days @ 3 hrs / day",
    certification: "Course completion certificate from ORACLE",
  },
  {
    technology: "Java",
    module: "AI with ML in Java",
    specialization: "CSE, IT, ECE",
    year: "4th year, 1st semester",
    live: "3 days",
    virtual: "3 days @ 2 hrs / day",
    certification: "Course completion certificate from ORACLE",
  },
  {
    technology: "Python",
    module: "Programming Essentials in Python",
    specialization: "All Branches",
    year: "2nd year, 2nd semester",
    live: "3 days",
    virtual: "5 days @ 3 hrs / day",
    certification: "Access to CISCO e-Learning for further assessment",
  },
  {
    technology: "Python",
    module: "For Machine Learning",
    specialization: "CSE, IT, ECE",
    year: "3rd–4th year",
    live: "5 days",
    virtual: "5 days @ 3 hrs / day",
    certification: "Participation certificate by TASK",
  },
  {
    technology: "CISCO: CCNA",
    module: "Module 1",
    specialization: "All branches",
    year: "2nd year, 2nd semester",
    live: "23 days",
    virtual: "25 days @ 6 hrs / day",
    certification: "Access to CISCO e-Learning",
  },
  {
    technology: "Google",
    module: "Android Kotlin Fundamentals",
    specialization: "CSE, IT",
    year: "3rd Year 2nd Semester & 4th Year 1st Semester",
    live: "5 days",
    virtual: "5 days @ 3 hrs / day",
    certification: "Online Badges on course completion",
  },
  {
    technology: "Front End Development",
    module: "Html5 & Css3",
    specialization: "CSE, IT, ECE",
    year: "2nd year, 1st & 2nd semester",
    live: "2 days",
    virtual: "3 days @ 3 hrs / day",
    certification: "Course completion certificate by TASK",
  },
  {
    technology: "Database",
    module: "Design & Programming with SQL",
    specialization: "CSE, IT, ECE",
    year: "3rd–4th year",
    live: "6 days",
    virtual: "6 days @ 3 hrs / day",
    certification: "Course completion certificate from ORACLE",
  },
  {
    technology: "Soft Skills",
    module: "Interview Skills",
    specialization: "All branches",
    year: "3rd and 4th year",
    live: "—",
    virtual: "3 days @ 1.5 hrs / day",
    certification: "—",
  },
  {
    technology: "Aptitude and Reasoning",
    module: "Core Aptitude",
    specialization: "All branches",
    year: "All semesters",
    live: "2 days",
    virtual: "6 days @ 2 hrs / day",
    certification: "—",
  },
];

export type CourseCategory = {
  slug: string;
  title: string;
  audience: string;
  description: string;
  modules: number;
};

export const courseCategories: CourseCategory[] = [
  {
    slug: "engineering",
    title: "For Engineering Students",
    audience: "B.E / B.Tech",
    description:
      "Technology, soft skills, and corporate partnership trainings for registered engineering students.",
    modules: engineeringCourses.length,
  },
  {
    slug: "degree",
    title: "For Degree Students",
    audience: "B.A / B.Sc / B.Com",
    description:
      "Employability, communication, and digital literacy pathways for degree students.",
    modules: 28,
  },
  {
    slug: "pharmacy",
    title: "For Pharmacy Students",
    audience: "B.Pharm / Pharm.D",
    description:
      "Domain and soft-skill programs aligned to pharma industry readiness.",
    modules: 18,
  },
  {
    slug: "polytechnic",
    title: "For Polytechnic Students",
    audience: "Diploma",
    description:
      "Hands-on technical modules and workplace readiness for polytechnic cohorts.",
    modules: 22,
  },
  {
    slug: "pg",
    title: "For MBA, MCA & PG Students",
    audience: "PG / MCA / MBA",
    description:
      "Advanced technology, analytics, and leadership modules for postgraduate students.",
    modules: 24,
  },
];

export type PartnerOffering = {
  partner: string;
  modules: string;
  specialization: string;
  year: string;
  mode: string;
  duration: string;
};

export const partnerOfferings: PartnerOffering[] = [
  {
    partner: "Salesforce",
    modules: "Developer, Administrator",
    specialization: "CSE, IT, ECE",
    year: "3rd–4th year",
    mode: "TTT, Online LMS",
    duration: "4 months",
  },
  {
    partner: "AWS Educate",
    modules: "Cloud 101 & role tracks",
    specialization: "CSE, IT",
    year: "3rd–4th year",
    mode: "TTT, Online LMS",
    duration: "24–45 hrs",
  },
  {
    partner: "Google Cloud",
    modules: "Cloud Foundations, Associate Cloud Engineer",
    specialization: "CSE, IT",
    year: "3rd–4th year",
    mode: "TTT, Online LMS",
    duration: "40–60 hrs",
  },
  {
    partner: "UIPath Academic Alliance",
    modules: "Step into RPA & Introduction to RPA",
    specialization: "All branches",
    year: "3rd year",
    mode: "TTT, Online LMS",
    duration: "20 hrs",
  },
  {
    partner: "Oracle Academy",
    modules: "JAVA programming and Database development",
    specialization: "CSE, IT, ECE",
    year: "3rd–4th year",
    mode: "Online LMS",
    duration: "40–60 hrs",
  },
  {
    partner: "Internshala",
    modules: "Nationwide internship access",
    specialization: "All branches",
    year: "All semesters",
    mode: "Online marketplace",
    duration: "Ongoing",
  },
];
