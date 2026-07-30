"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole =
  | "Student"
  | "Coordinator"
  | "College Management"
  | "Mentor"
  | "Employer"
  | "Government Admin";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  district: string;
  stream: string;
  college?: string;
  company?: string;
};

export type Enrollment = {
  id: string;
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
  description?: string;
  employerId?: string;
  createdAt?: string;
};

export type JobApplication = {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: "submitted" | "shortlisted" | "interview" | "rejected";
};

export type MentorshipRequest = {
  id: string;
  mentorName: string;
  focus: string;
  requestedAt: string;
  status: "pending" | "matched" | "active";
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type ResumeDraft = {
  headline: string;
  summary: string;
  skills: string[];
  education: string;
  projects: string;
};

export type SkillAssessment = {
  role: string;
  focus: string;
  score: number;
  updatedAt: string;
};

export type Venture = {
  id: string;
  program: string;
  title: string;
  submittedAt: string;
};

type PortalContextValue = {
  hydrated: boolean;
  user: PortalUser | null;
  enrollments: Enrollment[];
  applications: JobApplication[];
  mentorships: MentorshipRequest[];
  notifications: NotificationItem[];
  resume: ResumeDraft;
  assessment: SkillAssessment | null;
  ventures: Venture[];
  jobs: JobPost[];
  language: "EN" | "TE";
  unreadCount: number;
  refresh: () => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password?: string;
    mobile?: string;
    role: UserRole;
    district: string;
    stream: string;
    college?: string;
    company?: string;
  }) => Promise<string | null>;
  login: (email: string, password: string, role?: UserRole) => Promise<string | null>;
  logout: () => Promise<void>;
  enrollCourse: (technology: string, module: string) => Promise<void>;
  applyJob: (jobId: string) => Promise<void>;
  postJob: (input: {
    title: string;
    company: string;
    location: string;
    type: string;
    skills: string;
    description: string;
  }) => Promise<string | null>;
  requestMentor: (mentorName: string, focus: string) => Promise<void>;
  saveResume: (resume: ResumeDraft) => Promise<void>;
  saveAssessment: (assessment: SkillAssessment) => Promise<void>;
  submitVenture: (program: string, title: string) => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  setLanguage: (lang: "EN" | "TE") => void;
  t: (key: string) => string;
};

const defaultResume: ResumeDraft = {
  headline: "",
  summary: "",
  skills: [],
  education: "",
  projects: "",
};

const STRINGS: Record<"EN" | "TE", Record<string, string>> = {
  EN: {
    brandSub: "Telangana Academy for Skill and Knowledge",
    skillOfferings: "Skill Offerings",
    mentorship: "Mentorship",
    jobCentres: "Job Centres",
    skillGap: "Skill Gap",
    learningHub: "Learning Hub",
    commandCentre: "Command Centre",
    entrepreneurship: "Entrepreneurship",
    myDashboard: "My Dashboard",
    signIn: "Sign In",
    register: "Register",
    signOut: "Sign out",
    employerHub: "Employer Hub",
    jobFair: "Job Fair",
    colleges: "Colleges",
  },
  TE: {
    brandSub: "తెలంగాణ నైపుణ్య మరియు జ్ఞాన అకాడమీ",
    skillOfferings: "నైపుణ్య కోర్సులు",
    mentorship: "మార్గదర్శకత్వం",
    jobCentres: "ఉద్యోగ కేంద్రాలు",
    skillGap: "నైపుణ్య అంతరం",
    learningHub: "అభ్యసన కేంద్రం",
    commandCentre: "కమాండ్ సెంటర్",
    entrepreneurship: "వ్యవస్థాపకత్వం",
    myDashboard: "నా డాష్‌బోర్డ్",
    signIn: "సైన్ ఇన్",
    register: "నమోదు",
    signOut: "సైన్ అవుట్",
    employerHub: "యజమాని హబ్",
    jobFair: "జాబ్ ఫెయిర్",
    colleges: "కళాశాలలు",
  },
};

const PortalContext = createContext<PortalContextValue | null>(null);

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<PortalUser | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [resume, setResume] = useState<ResumeDraft>(defaultResume);
  const [assessment, setAssessment] = useState<SkillAssessment | null>(null);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [language, setLanguageState] = useState<"EN" | "TE">("EN");

  const refresh = useCallback(async () => {
    const me = await api<{
      user: PortalUser | null;
      enrollments?: Enrollment[];
      applications?: JobApplication[];
      mentorships?: MentorshipRequest[];
      notifications?: NotificationItem[];
      resume?: ResumeDraft;
      assessment?: SkillAssessment | null;
      ventures?: Venture[];
      jobs?: JobPost[];
    }>("/api/auth/me");
    setUser(me.user);
    setEnrollments(me.enrollments || []);
    setApplications(me.applications || []);
    setMentorships(me.mentorships || []);
    setNotifications(me.notifications || []);
    setResume(me.resume || defaultResume);
    setAssessment(me.assessment || null);
    setVentures(me.ventures || []);
    if (me.jobs) setJobs(me.jobs);
    else {
      const jobsRes = await api<{ jobs: JobPost[] }>("/api/jobs");
      setJobs(jobsRes.jobs);
    }
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem("task-lang");
    if (lang === "EN" || lang === "TE") setLanguageState(lang);
    refresh()
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, [refresh]);

  const setLanguage = useCallback((lang: "EN" | "TE") => {
    setLanguageState(lang);
    localStorage.setItem("task-lang", lang);
  }, []);

  const t = useCallback(
    (key: string) => STRINGS[language][key] || STRINGS.EN[key] || key,
    [language]
  );

  const register: PortalContextValue["register"] = useCallback(
    async (input) => {
      try {
        await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(input),
        });
        await refresh();
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Registration failed";
      }
    },
    [refresh]
  );

  const login: PortalContextValue["login"] = useCallback(
    async (email, password, role) => {
      try {
        await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password, role }),
        });
        await refresh();
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Login failed";
      }
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    setEnrollments([]);
    setApplications([]);
    setMentorships([]);
    setNotifications([]);
    setResume(defaultResume);
    setAssessment(null);
    setVentures([]);
    window.location.assign("/");
  }, []);

  const enrollCourse = useCallback(
    async (technology: string, module: string) => {
      await api("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({ technology, module }),
      });
      await refresh();
    },
    [refresh]
  );

  const applyJob = useCallback(
    async (jobId: string) => {
      await api("/api/jobs", {
        method: "POST",
        body: JSON.stringify({ jobId }),
      });
      await refresh();
    },
    [refresh]
  );

  const postJob: PortalContextValue["postJob"] = useCallback(
    async (input) => {
      try {
        await api("/api/jobs", {
          method: "POST",
          body: JSON.stringify({ action: "post", ...input }),
        });
        await refresh();
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Failed to post job";
      }
    },
    [refresh]
  );

  const requestMentor = useCallback(
    async (mentorName: string, focus: string) => {
      await api("/api/mentorships", {
        method: "POST",
        body: JSON.stringify({ mentorName, focus }),
      });
      await refresh();
    },
    [refresh]
  );

  const saveResume = useCallback(
    async (draft: ResumeDraft) => {
      await api("/api/resume", {
        method: "POST",
        body: JSON.stringify(draft),
      });
      await refresh();
    },
    [refresh]
  );

  const saveAssessment = useCallback(
    async (next: SkillAssessment) => {
      await api("/api/assessment", {
        method: "POST",
        body: JSON.stringify(next),
      });
      await refresh();
    },
    [refresh]
  );

  const submitVenture = useCallback(
    async (program: string, title: string) => {
      await api("/api/ventures", {
        method: "POST",
        body: JSON.stringify({ program, title }),
      });
      await refresh();
    },
    [refresh]
  );

  const markNotificationsRead = useCallback(async () => {
    await api("/api/notifications", { method: "POST" });
    await refresh();
  }, [refresh]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo<PortalContextValue>(
    () => ({
      hydrated,
      user,
      enrollments,
      applications,
      mentorships,
      notifications,
      resume,
      assessment,
      ventures,
      jobs,
      language,
      unreadCount,
      refresh,
      register,
      login,
      logout,
      enrollCourse,
      applyJob,
      postJob,
      requestMentor,
      saveResume,
      saveAssessment,
      submitVenture,
      markNotificationsRead,
      setLanguage,
      t,
    }),
    [
      hydrated,
      user,
      enrollments,
      applications,
      mentorships,
      notifications,
      resume,
      assessment,
      ventures,
      jobs,
      language,
      unreadCount,
      refresh,
      register,
      login,
      logout,
      enrollCourse,
      applyJob,
      postJob,
      requestMentor,
      saveResume,
      saveAssessment,
      submitVenture,
      markNotificationsRead,
      setLanguage,
      t,
    ]
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}
