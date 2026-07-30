import { NextResponse } from "next/server";

function replyFor(input: string, name?: string) {
  const q = input.toLowerCase();
  if (q.includes("register") || q.includes("sign"))
    return "Use Register to create your TASK account. Sessions are secured with server cookies and sync across devices on this deployment.";
  if (q.includes("course") || q.includes("engineering") || q.includes("java") || q.includes("python"))
    return "Open Skill Offerings → Engineering. Search/filter modules and click Enrol — enrollments persist on the TASK server and appear on My Dashboard.";
  if (q.includes("job") || q.includes("internship") || q.includes("placement") || q.includes("fair"))
    return "Use Digital Job Centres or Virtual Job Fair to apply. Employers can post roles from the Employer Hub.";
  if (q.includes("mentor"))
    return "Visit Mentorship, request a match, and track status on your dashboard. Mentors can also register with the Mentor role.";
  if (q.includes("skill") || q.includes("score") || q.includes("gap"))
    return "Skill Gap Engine calculates an employability score from your target role and focus, then saves it to your profile.";
  if (q.includes("resume"))
    return "Resume Builder stores your draft on the server for job applications and employer reviews.";
  if (q.includes("telugu") || q.includes("language") || q.includes("తెలుగు"))
    return "Toggle English / తెలుగు in the top bar. Key navigation and module titles switch immediately.";
  if (q.includes("hello") || q.includes("hi") || q.includes("namaste"))
    return `Namaste${name ? `, ${name}` : ""}! I am TASK AI Counsellor for courses, jobs, mentorship, and skill pathways.`;
  return "Ask about courses, jobs, mentorship, skill-gap scoring, resume builder, employer hub, or the virtual job fair.";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "");
  const name = body.name ? String(body.name) : undefined;
  return NextResponse.json({ reply: replyFor(message, name) });
}
