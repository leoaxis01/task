"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { usePortal } from "@/lib/portal-store";

type ChatMsg = { role: "bot" | "user"; text: string };

function replyFor(input: string, name?: string) {
  const q = input.toLowerCase();
  if (q.includes("register") || q.includes("sign"))
    return "Use Register to create your TASK account, then open My Dashboard for enrollments, jobs, and mentorship.";
  if (q.includes("course") || q.includes("engineering") || q.includes("java") || q.includes("python"))
    return "Browse Skill Offerings → Engineering for AutoCAD, Java, Python, CISCO and partner modules. Click Enrol to add a course to your Learning Hub.";
  if (q.includes("job") || q.includes("internship") || q.includes("placement"))
    return "Open Digital Job Centres to view AI-matched roles. Apply from a listing — applications appear on your dashboard.";
  if (q.includes("mentor"))
    return "Visit Mentorship, pick a mentor, and request a match. Pending requests sync to My Dashboard.";
  if (q.includes("skill") || q.includes("score") || q.includes("gap"))
    return "Use Skill Gap Engine to set your target role and focus. Your employability score is saved to your profile.";
  if (q.includes("resume"))
    return "Open Resume Builder to draft headline, skills, education and projects. Saved drafts stay in this browser.";
  if (q.includes("telugu") || q.includes("language"))
    return "Toggle English / తెలుగు from the top bar. More Telugu content packs can be connected to the CMS later.";
  if (q.includes("hello") || q.includes("hi") || q.includes("namaste"))
    return `Namaste${name ? `, ${name}` : ""}! I am TASK AI Counsellor. Ask about courses, jobs, mentorship, or skill gaps.`;
  return "I can help with courses, mentorship, jobs, skill-gap scoring, resume builder, and dashboard actions. Try: “Show engineering courses” or “How do I apply for internships?”";
}

export function AiAssistant() {
  const { user } = usePortal();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);

  const greeting = useMemo(
    () =>
      `Namaste${user ? `, ${user.name.split(" ")[0]}` : ""}! Ask me about TASK courses, jobs, mentorship, or your employability path.`,
    [user]
  );

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "bot", text: greeting }]);
    }
  }, [open, msgs.length, greeting]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const next: ChatMsg[] = [
      ...msgs,
      { role: "user", text },
      { role: "bot", text: replyFor(text, user?.name.split(" ")[0]) },
    ];
    setMsgs(next);
    setInput("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      {open ? (
        <div className="mb-3 flex h-[28rem] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between bg-brand-deep px-3 py-2 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bot size={16} className="text-accent" />
              TASK AI Counsellor
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto bg-mist/60 p-3">
            {msgs.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`max-w-[90%] rounded-md px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-brand text-white"
                    : "bg-white text-ink border border-line"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-line p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about courses, jobs..."
              className="flex-1 border border-line bg-mist px-2 py-2 text-sm outline-none"
            />
            <button type="button" className="btn-primary px-3" onClick={send}>
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lift hover:bg-brand-deep"
      >
        <MessageCircle size={18} />
        AI Help
      </button>
    </div>
  );
}
