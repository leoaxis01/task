import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type UserRole =
  | "Student"
  | "Coordinator"
  | "College Management"
  | "Mentor"
  | "Employer"
  | "Government Admin";

export type DbUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  mobile?: string;
  role: UserRole;
  district: string;
  stream: string;
  college?: string;
  company?: string;
  createdAt: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseKey: string;
  technology: string;
  module: string;
  enrolledAt: string;
  status: "enrolled" | "in-progress" | "completed";
};

export type JobPost = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  match?: number;
  description: string;
  employerId?: string;
  createdAt: string;
};

export type JobApplication = {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: "submitted" | "shortlisted" | "interview" | "rejected";
};

export type MentorshipRequest = {
  id: string;
  userId: string;
  mentorName: string;
  focus: string;
  requestedAt: string;
  status: "pending" | "matched" | "active";
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type ResumeDraft = {
  userId: string;
  headline: string;
  summary: string;
  skills: string[];
  education: string;
  projects: string;
  updatedAt: string;
};

export type SkillAssessment = {
  userId: string;
  role: string;
  focus: string;
  score: number;
  updatedAt: string;
};

export type Venture = {
  id: string;
  userId: string;
  program: string;
  title: string;
  submittedAt: string;
};

export type PortalDb = {
  users: DbUser[];
  enrollments: Enrollment[];
  jobs: JobPost[];
  applications: JobApplication[];
  mentorships: MentorshipRequest[];
  notifications: NotificationItem[];
  resumes: ResumeDraft[];
  assessments: SkillAssessment[];
  ventures: Venture[];
};

const DB_PATH = path.join(process.cwd(), "data", "portal-db.json");

const seedJobs: JobPost[] = [
  {
    id: "job_seed_1",
    title: "Junior Software Engineer",
    company: "TechMahindra Partner Drive",
    location: "Hyderabad / Hybrid",
    type: "Full-time",
    skills: ["Java", "SQL", "Problem Solving"],
    match: 92,
    description: "Campus hiring role for TASK-registered engineering graduates.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job_seed_2",
    title: "Cloud Support Associate",
    company: "AWS Educate Pathway",
    location: "Hyderabad",
    type: "Full-time",
    skills: ["Cloud 101", "Networking", "Linux"],
    match: 88,
    description: "Cloud support pathway through AWS Educate partnership.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job_seed_3",
    title: "RPA Intern",
    company: "UIPath Academic Alliance",
    location: "Remote + Campus",
    type: "Internship",
    skills: ["RPA Basics", "Process Mapping"],
    match: 85,
    description: "Internship for RPA fundamentals and bot development.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job_seed_4",
    title: "Civil Design Trainee",
    company: "Infrastructure MSME Cluster",
    location: "Warangal",
    type: "Trainee",
    skills: ["AutoCAD", "Fusion360"],
    match: 81,
    description: "District MSME trainee role for civil/mechanical students.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job_seed_5",
    title: "Data Analyst Intern",
    company: "Pharma Analytics Desk",
    location: "Hyderabad",
    type: "Internship",
    skills: ["Python", "SQL", "Excel"],
    match: 79,
    description: "Analytics internship aligned to pharma industry demand.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job_seed_6",
    title: "Campus Hiring – Multiple Roles",
    company: "TASK Virtual Job Fair",
    location: "Statewide",
    type: "Campus",
    skills: ["Aptitude", "Communication"],
    match: 76,
    description: "Multi-employer campus drive via TASK Virtual Job Fair.",
    createdAt: new Date().toISOString(),
  },
];

function emptyDb(): PortalDb {
  return {
    users: [],
    enrollments: [],
    jobs: seedJobs,
    applications: [],
    mentorships: [],
    notifications: [],
    resumes: [],
    assessments: [],
    ventures: [],
  };
}

let writeQueue: Promise<void> = Promise.resolve();

async function ensureDb(): Promise<PortalDb> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as PortalDb;
    if (!parsed.jobs?.length) parsed.jobs = seedJobs;
    return parsed;
  } catch {
    const db = emptyDb();
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return db;
  }
}

export async function readDb(): Promise<PortalDb> {
  return ensureDb();
}

export async function updateDb(
  mutator: (db: PortalDb) => void | Promise<void>
): Promise<PortalDb> {
  writeQueue = writeQueue.then(async () => {
    const db = await ensureDb();
    await mutator(db);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  });
  await writeQueue;
  return ensureDb();
}

export function uid(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function publicUser(user: DbUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    district: user.district,
    stream: user.stream,
    college: user.college,
    company: user.company,
  };
}
