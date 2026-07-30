const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.PORTAL_URL || "http://localhost:3000";
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

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  try {
    // Home
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    const homeTitle = await page.$eval("h1", (el) => el.textContent.trim());
    if (homeTitle.includes("TASK")) ok("Home loads", homeTitle);
    else fail("Home loads", homeTitle);
    await shot(page, "01-home");

    // Register
    await page.goto(BASE + "/register", { waitUntil: "networkidle2" });
    await page.type('input[type="tel"]', "9876543210");
    // Fill name - first text-ish inputs: full name is first required text without type email/tel
    const nameInput = await page.$("label:nth-of-type(2) input, form input:not([type])");
    // More reliable: fill by label traversal
    await page.evaluate(() => {
      const labels = [...document.querySelectorAll("label")];
      const byText = (t) =>
        labels.find((l) => l.textContent.trim().startsWith(t));
      const set = (label, value) => {
        const input = byText(label)?.querySelector("input, select, textarea");
        if (!input) throw new Error("missing " + label);
        const proto = input.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
        setter?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      set("Full name", "Test Student");
      set("Mobile", "9876543210");
      set("Email", "test.student@task.gov.in");
      set("District", "Hyderabad");
      set("Course / Stream", "Engineering");
    });
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => location.pathname.includes("/dashboard"), {
      timeout: 15000,
    });
    if (page.url().includes("/dashboard")) ok("Register → dashboard");
    else fail("Register → dashboard", page.url());
    await shot(page, "02-dashboard-after-register");

    // Dashboard shows welcome
    const dash = await page.content();
    if (dash.includes("Welcome") && dash.includes("Test Student"))
      ok("Dashboard greets user");
    else fail("Dashboard greets user");

    // Enrol course
    await page.goto(BASE + "/courses/engineering", { waitUntil: "networkidle2" });
    await page.waitForSelector("table");
    // Search Java
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Search AutoCAD"]');
      if (!input) throw new Error("search missing");
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "Java");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForFunction(() => {
      const rows = [...document.querySelectorAll("tbody tr")];
      return rows.some((r) => r.textContent.includes("Java"));
    });
    ok("Course search filters Java");

    const enrolBefore = await page.$$eval("button", (btns) =>
      btns.filter((b) => b.textContent.trim() === "Enrol").length
    );
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "Enrol"
      );
      btn?.click();
    });
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some((b) =>
        b.textContent.includes("Enrolled")
      )
    );
    const flash = await page.evaluate(() =>
      document.body.innerText.includes("Enrolled:")
    );
    if (enrolBefore > 0 && flash) ok("Course enrol works");
    else fail("Course enrol works", `buttons=${enrolBefore} flash=${flash}`);
    await shot(page, "03-course-enrolled");

    // Apply job
    await page.goto(BASE + "/jobs", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "Apply now"
      );
      btn?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Applied:")
    );
    ok("Job apply works");
    await shot(page, "04-job-applied");

    // Mentorship
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
    ok("Mentorship request works");
    await shot(page, "05-mentorship");

    // Skill gap save
    await page.goto(BASE + "/skill-gap", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Save score")
      );
      btn?.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes("Saved."));
    ok("Skill score save works");
    await shot(page, "06-skill-gap");

    // Resume
    await page.goto(BASE + "/resume", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const labels = [...document.querySelectorAll("label")];
      const byText = (t) =>
        labels.find((l) => l.textContent.trim().startsWith(t));
      const set = (label, value) => {
        const input = byText(label)?.querySelector("input, textarea");
        const proto =
          input.tagName === "TEXTAREA"
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set("Headline", "Aspiring Cloud Engineer");
      set("Summary", "TASK registered engineering student focused on cloud.");
      set("Skills (comma separated)", "Java, SQL, Cloud");
      set("Education", "B.Tech CSE · Osmania University");
      set("Projects", "Campus placement portal prototype");
    });
    await page.click('button[type="submit"]');
    await page.waitForFunction(() =>
      document.body.innerText.includes("Resume saved")
    );
    ok("Resume builder saves");
    await shot(page, "07-resume");

    // Search
    await page.goto(BASE + "/search?q=python", { waitUntil: "networkidle2" });
    await page.waitForFunction(() =>
      document.body.innerText.toLowerCase().includes("python")
    );
    ok("Search finds Python");
    await shot(page, "08-search");

    // AI Help
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
      const send = [...document.querySelectorAll("button")].find((b) =>
        b.querySelector("svg")
      );
      // click last primary-looking send in chat
      const inputs = document.querySelector('input[placeholder*="Ask about"]');
      inputs?.parentElement?.querySelector("button")?.click();
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Skill Offerings")
    );
    ok("AI counsellor responds");
    await shot(page, "09-ai-chat");

    // Dashboard reflects activity
    await page.goto(BASE + "/dashboard", { waitUntil: "networkidle2" });
    const body = await page.evaluate(() => document.body.innerText);
    const checks = [
      ["courses enrolled count", /Courses enrolled[\s\S]*?[1-9]/],
      ["job applications", /Job applications[\s\S]*?[1-9]/],
      ["mentorship", /Mentorship requests[\s\S]*?[1-9]/],
      ["employability score", /Employability score[\s\S]*?\d{2}/],
    ];
    for (const [label, re] of checks) {
      if (re.test(body)) ok(`Dashboard shows ${label}`);
      else fail(`Dashboard shows ${label}`);
    }
    await shot(page, "10-dashboard-final");

    // Persistence after reload
    await page.reload({ waitUntil: "networkidle2" });
    const still = await page.evaluate(() => document.body.innerText);
    if (still.includes("Test Student") && /Courses enrolled[\s\S]*?[1-9]/.test(still))
      ok("Session persists after reload");
    else fail("Session persists after reload");

    // Sign out
    await page.goto(BASE + "/dashboard", { waitUntil: "networkidle2" });
    const signedIn = await page.evaluate(() =>
      [...document.querySelectorAll("button")].some((b) =>
        b.textContent.includes("Sign out")
      )
    );
    if (!signedIn) {
      fail("Sign out button visible");
    } else {
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
      if (signedOut) ok("Sign out returns home");
      else fail("Sign out returns home", page.url());
    }
    await shot(page, "11-signed-out");
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
  const summary = { passed, failed, results };
  fs.writeFileSync(
    "/opt/cursor/artifacts/e2e-results.json",
    JSON.stringify(summary, null, 2)
  );
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
