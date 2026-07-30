const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.PORTAL_URL || "http://localhost:3001";
const OUT = "/opt/cursor/artifacts/screenshots";
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function ok(name, detail = "") {
  results.push({ name, pass: true, detail });
  console.log(`PASS  ${name}${detail ? " — " + detail : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, pass: false, detail });
  console.error(`FAIL  ${name}${detail ? " — " + detail : ""}`);
}

async function shot(page, name) {
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: true,
  });
}

function fillByLabel(page, pairs) {
  return page.evaluate((pairs) => {
    const labels = [...document.querySelectorAll("label")];
    const byText = (t) =>
      labels.find((l) => l.textContent.trim().startsWith(t));
    for (const [label, value] of pairs) {
      const input = byText(label)?.querySelector("input, select, textarea");
      if (!input) throw new Error("missing " + label);
      const proto =
        input.tagName === "SELECT"
          ? HTMLSelectElement.prototype
          : input.tagName === "TEXTAREA"
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, pairs);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(25000);
  const email = `e2e.${Date.now()}@task.gov.in`;

  try {
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    const homeTitle = await page.$eval("h1", (el) => el.textContent.trim());
    if (homeTitle.includes("TASK")) ok("Home loads", homeTitle);
    else fail("Home loads", homeTitle);
    await shot(page, "01-home");

    // API health
    const stats = await page.evaluate(async () => {
      const res = await fetch("/api/stats");
      return { status: res.status, data: await res.json() };
    });
    if (stats.status === 200 && stats.data.totals) ok("Stats API live");
    else fail("Stats API live", JSON.stringify(stats));

    await page.goto(BASE + "/register", { waitUntil: "networkidle2" });
    await fillByLabel(page, [
      ["Full name", "E2E Student"],
      ["Mobile", "9876543210"],
      ["Email", email],
      ["Password", "task2026"],
      ["District", "Hyderabad"],
      ["Course / Stream", "Engineering"],
    ]);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => location.pathname.includes("/dashboard"), {
      timeout: 20000,
    });
    ok("Register → dashboard (server auth)");
    await shot(page, "02-dashboard-after-register");

    const dash = await page.content();
    if (dash.includes("Welcome") && dash.includes("E2E Student"))
      ok("Dashboard greets user");
    else fail("Dashboard greets user");

    // Session cookie exists
    const cookies = await page.cookies();
    if (cookies.some((c) => c.name === "task_session")) ok("JWT session cookie set");
    else fail("JWT session cookie set");

    await page.goto(BASE + "/courses/engineering", { waitUntil: "networkidle2" });
    await page.waitForSelector("table");
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Search AutoCAD"]');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "Java");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForFunction(() =>
      [...document.querySelectorAll("tbody tr")].some((r) =>
        r.textContent.includes("Java")
      )
    );
    ok("Course search filters Java");
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "Enrol"
      );
      btn?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Enrolled:")
    );
    ok("Course enrol persists via API");
    await shot(page, "03-course-enrolled");

    await page.goto(BASE + "/jobs", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "Apply now"
      );
      btn?.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes("Applied:"));
    ok("Job apply via API");
    await shot(page, "04-job-applied");

    await page.goto(BASE + "/mentorship", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "Request match"
      );
      btn?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Mentorship requested")
    );
    ok("Mentorship request via API");

    await page.goto(BASE + "/skill-gap", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Save score")
      );
      btn?.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes("Saved."));
    ok("Skill score saved via API");

    await page.goto(BASE + "/resume", { waitUntil: "networkidle2" });
    await fillByLabel(page, [
      ["Headline", "Aspiring Cloud Engineer"],
      ["Summary", "TASK registered engineering student focused on cloud."],
      ["Skills (comma separated)", "Java, SQL, Cloud"],
      ["Education", "B.Tech CSE"],
      ["Projects", "Campus portal"],
    ]);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() =>
      document.body.innerText.includes("Resume saved")
    );
    ok("Resume saved via API");

    await page.goto(BASE + "/job-fair", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Enter booth")
      );
      btn?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Joined booth")
    );
    ok("Virtual job fair booth join");

    await page.goto(BASE + "/colleges", { waitUntil: "networkidle2" });
    if ((await page.content()).includes("Osmania")) ok("Colleges page live");
    else fail("Colleges page live");

    await page.goto(BASE + "/command-centre", { waitUntil: "networkidle2" });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Students on platform") ||
      document.body.innerText.includes("Portal enrollments")
    );
    ok("Command centre live stats");

    await page.goto(BASE + "/search?q=python", { waitUntil: "networkidle2" });
    await page.waitForFunction(() =>
      document.body.innerText.toLowerCase().includes("python")
    );
    ok("Search finds Python");

    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("AI Help")
      );
      btn?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("TASK AI Counsellor")
    );
    await page.type('input[placeholder*="Ask about"]', "Tell me about courses");
    await page.evaluate(() => {
      document
        .querySelector('input[placeholder*="Ask about"]')
        ?.parentElement?.querySelector("button")
        ?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Skill Offerings")
    );
    ok("AI counsellor API responds");
    await shot(page, "09-ai-chat");

    await page.goto(BASE + "/dashboard", { waitUntil: "networkidle2" });
    const body = await page.evaluate(() => document.body.innerText);
    for (const [label, re] of [
      ["courses", /Courses enrolled[\s\S]*?[1-9]/],
      ["applications", /Job applications[\s\S]*?[1-9]/],
      ["mentorship", /Mentorship[\s\S]*?[1-9]/],
      ["score", /Employability score[\s\S]*?\d{2}/],
    ]) {
      if (re.test(body)) ok(`Dashboard shows ${label}`);
      else fail(`Dashboard shows ${label}`);
    }

    await page.reload({ waitUntil: "networkidle2" });
    const still = await page.evaluate(() => document.body.innerText);
    if (still.includes("E2E Student") && /Courses enrolled[\s\S]*?[1-9]/.test(still))
      ok("Server session persists after reload");
    else fail("Server session persists after reload");

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }),
      page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          b.textContent.includes("Sign out")
        );
        btn?.click();
      }),
    ]);
    const signedOut = await page.evaluate(
      () =>
        location.pathname === "/" &&
        [...document.querySelectorAll("a")].some((a) =>
          a.textContent.includes("Sign In")
        )
    );
    if (signedOut) ok("Sign out clears session");
    else fail("Sign out clears session", page.url());

    // Re-login with same credentials
    await page.goto(BASE + "/login", { waitUntil: "networkidle2" });
    await fillByLabel(page, [
      ["Email / TASK ID", email],
      ["Password", "task2026"],
    ]);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => location.pathname.includes("/dashboard"));
    const restored = await page.evaluate(() => document.body.innerText);
    if (/Courses enrolled[\s\S]*?[1-9]/.test(restored))
      ok("Re-login restores server data");
    else fail("Re-login restores server data");
    await shot(page, "10-relogin");
  } catch (err) {
    fail("Unhandled error", err.message);
    try {
      await shot(page, "error");
    } catch {}
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  fs.writeFileSync(
    "/opt/cursor/artifacts/e2e-results.json",
    JSON.stringify({ passed, failed, results }, null, 2)
  );
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
