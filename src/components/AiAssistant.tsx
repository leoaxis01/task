"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { usePortal } from "@/lib/portal-store";

type ChatMsg = { role: "bot" | "user"; text: string };

export function AiAssistant() {
  const { user } = usePortal();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [busy, setBusy] = useState(false);

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

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setMsgs((prev) => [...prev, { role: "user", text }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          name: user?.name.split(" ")[0],
        }),
      });
      const data = await res.json();
      setMsgs((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "Please try again." },
      ]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        { role: "bot", text: "Counsellor temporarily unavailable." },
      ]);
    } finally {
      setBusy(false);
    }
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
                    : "border border-line bg-white text-ink"
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
            <button type="button" className="btn-primary px-3" onClick={send} disabled={busy}>
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
