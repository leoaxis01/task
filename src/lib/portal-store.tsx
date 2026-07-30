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
};

export type Enrollment = {
  id: string;
  courseKey: string;
  technology: string;
  module: string;
  enrolledAt: string;
  status: "enrolled" | "in-progress" | "completed";
};

export type JobApplication = {
  id: string;
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

type PortalState = {
  user: PortalUser | null;
  enrollments: Enrollment[];
  applications: JobApplication[];
  mentorships: MentorshipRequest[];
  notifications: NotificationItem[];
  resume: ResumeDraft;
  assessment: SkillAssessment | null;
  language: "EN" | "TE";
};

type PortalContextValue = PortalState & {
  hydrated: boolean;
  register: (input: Omit<PortalUser, "id"> & { password?: string }) => void;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  enrollCourse: (technology: string, module: string) => void;
  applyJob: (jobTitle: string, company: string) => void;
  requestMentor: (mentorName: string, focus: string) => void;
  saveResume: (resume: ResumeDraft) => void;
  saveAssessment: (assessment: SkillAssessment) => void;
  markNotificationsRead: () => void;
  pushNotification: (title: string, body: string) => void;
  setLanguage: (lang: "EN" | "TE") => void;
  unreadCount: number;
};

const STORAGE_KEY = "task-portal-v1";

const defaultResume: ResumeDraft = {
  headline: "",
  summary: "",
  skills: [],
  education: "",
  projects: "",
};

const defaultState: PortalState = {
  user: null,
  enrollments: [],
  applications: [],
  mentorships: [],
  notifications: [],
  resume: defaultResume,
  assessment: null,
  language: "EN",
};

const PortalContext = createContext<PortalContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PortalState;
        setState({ ...defaultState, ...parsed, resume: parsed.resume ?? defaultResume });
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const pushNotification = useCallback((title: string, body: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: uid("n"),
          title,
          body,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ].slice(0, 40),
    }));
  }, []);

  const register = useCallback(
    (input: Omit<PortalUser, "id">) => {
      const user: PortalUser = { ...input, id: uid("u") };
      setState((prev) => ({
        ...prev,
        user,
        notifications: [
          {
            id: uid("n"),
            title: "Welcome to TASK 2.0",
            body: `Your ${input.role.toLowerCase()} account is active. Explore courses, mentorship, and jobs.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      }));
    },
    []
  );

  const login = useCallback((email: string, role: UserRole) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return false;
    setState((prev) => {
      const existing =
        prev.user && prev.user.email.toLowerCase() === normalized
          ? { ...prev.user, role }
          : {
              id: uid("u"),
              name: normalized.split("@")[0].replace(/[._]/g, " "),
              email: normalized,
              role,
              district: prev.user?.district ?? "Hyderabad",
              stream: prev.user?.stream ?? "Engineering",
              college: prev.user?.college ?? "Registered College",
            };
      return {
        ...prev,
        user: {
          ...existing,
          name: existing.name.replace(/\b\w/g, (c) => c.toUpperCase()),
        },
        notifications: [
          {
            id: uid("n"),
            title: "Signed in",
            body: `Session active as ${role}.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: null }));
  }, []);

  const enrollCourse = useCallback(
    (technology: string, module: string) => {
      const courseKey = `${technology}::${module}`;
      setState((prev) => {
        if (prev.enrollments.some((e) => e.courseKey === courseKey)) return prev;
        return {
          ...prev,
          enrollments: [
            {
              id: uid("e"),
              courseKey,
              technology,
              module,
              enrolledAt: new Date().toISOString(),
              status: "enrolled",
            },
            ...prev.enrollments,
          ],
          notifications: [
            {
              id: uid("n"),
              title: "Course enrolled",
              body: `${technology} — ${module} added to your Learning Hub.`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...prev.notifications,
          ],
        };
      });
    },
    []
  );

  const applyJob = useCallback((jobTitle: string, company: string) => {
    setState((prev) => {
      if (
        prev.applications.some(
          (a) => a.jobTitle === jobTitle && a.company === company
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        applications: [
          {
            id: uid("j"),
            jobTitle,
            company,
            appliedAt: new Date().toISOString(),
            status: "submitted",
          },
          ...prev.applications,
        ],
        notifications: [
          {
            id: uid("n"),
            title: "Application submitted",
            body: `${jobTitle} at ${company}`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const requestMentor = useCallback((mentorName: string, focus: string) => {
    setState((prev) => {
      if (prev.mentorships.some((m) => m.mentorName === mentorName)) return prev;
      return {
        ...prev,
        mentorships: [
          {
            id: uid("m"),
            mentorName,
            focus,
            requestedAt: new Date().toISOString(),
            status: "pending",
          },
          ...prev.mentorships,
        ],
        notifications: [
          {
            id: uid("n"),
            title: "Mentorship requested",
            body: `Waiting for match with ${mentorName}.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const saveResume = useCallback((resume: ResumeDraft) => {
    setState((prev) => ({
      ...prev,
      resume,
      notifications: [
        {
          id: uid("n"),
          title: "Resume saved",
          body: "Your TASK resume draft is updated.",
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const saveAssessment = useCallback((assessment: SkillAssessment) => {
    setState((prev) => ({
      ...prev,
      assessment,
      notifications: [
        {
          id: uid("n"),
          title: "Skill gap updated",
          body: `Employability score ${assessment.score} for ${assessment.role}.`,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const setLanguage = useCallback((language: "EN" | "TE") => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );

  const value = useMemo<PortalContextValue>(
    () => ({
      ...state,
      hydrated,
      register,
      login,
      logout,
      enrollCourse,
      applyJob,
      requestMentor,
      saveResume,
      saveAssessment,
      markNotificationsRead,
      pushNotification,
      setLanguage,
      unreadCount,
    }),
    [
      state,
      hydrated,
      register,
      login,
      logout,
      enrollCourse,
      applyJob,
      requestMentor,
      saveResume,
      saveAssessment,
      markNotificationsRead,
      pushNotification,
      setLanguage,
      unreadCount,
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
