import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";

function normalizeText(s) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function categorizeConsoleMessage(msg) {
  const type = msg.type(); // log, info, warning, error, debug
  if (type === "warning") return "warning";
  if (type === "error") return "error";
  return "info";
}

test("exploratory QA (routing, console, products, contact, RTL, responsive)", async ({
  page,
  browser,
}) => {
  const consoleMessages = [];
  const pageErrors = [];
  const requestFailures = [];

  page.on("console", (msg) => {
    consoleMessages.push({
      kind: categorizeConsoleMessage(msg),
      type: msg.type(),
      text: msg.text(),
      url: page.url(),
    });
  });

  page.on("pageerror", (err) => {
    pageErrors.push({ message: String(err?.message ?? err), url: page.url() });
  });

  page.on("requestfailed", (req) => {
    const failure = req.failure();
    requestFailures.push({
      url: page.url(),
      requestUrl: req.url(),
      method: req.method(),
      failure: failure?.errorText ?? "unknown",
    });
  });

  const results = {
    baseUrl: BASE_URL,
    routing: [],
    home: {},
    products: {},
    contact: {},
    rtl: {},
    responsive: {},
    console: { errors: [], warnings: [] },
    pageErrors,
    requestFailures,
    criticalFailures: [],
  };

  async function gotoApp(pathname) {
    await page.goto(`${BASE_URL}${pathname}`, { waitUntil: "domcontentloaded" });
    // Vite dev server uses websockets; "networkidle" can hang.
    await page.waitForTimeout(300);
  }

  async function clickNavLink(label) {
    await page
      .locator("header")
      .getByRole("navigation")
      .getByRole("link", { name: label, exact: true })
      .click();
    await page.waitForTimeout(250);
  }

  // --- Routing via header nav (desktop) ---
  await gotoApp("/");
  for (const { label, expectedPath } of [
    { label: "الرئيسية", expectedPath: "/" },
    { label: "المنتجات", expectedPath: "/products" },
    { label: "من نحن", expectedPath: "/about" },
    { label: "تواصل معنا", expectedPath: "/contact" },
  ]) {
    const before = new URL(page.url()).pathname;
    await clickNavLink(label);
    const after = new URL(page.url()).pathname;
    const ok = after === expectedPath;
    results.routing.push({ label, from: before, to: after, expectedPath, ok });
    if (!ok) results.criticalFailures.push(`Routing: '${label}' expected ${expectedPath} got ${after}`);
    await gotoApp(expectedPath);
  }

  // --- Home: featured products render + buttons navigate ---
  await gotoApp("/");
  results.home.featuredHeadingVisible = await page
    .getByRole("heading", { name: /منتجاتنا.*المميزة/ })
    .isVisible()
    .catch(() => false);
  if (!results.home.featuredHeadingVisible) results.criticalFailures.push("Home: featured section heading not visible");

  results.home.featuredProductCardCountEstimate = await page
    .getByRole("button", { name: "أضف للسلة" })
    .count()
    .catch(() => 0);

  await page.locator("main").getByRole("link", { name: "تصفح المنتجات", exact: true }).click();
  await page.waitForTimeout(250);
  results.home.heroBrowseProductsNavigates = new URL(page.url()).pathname === "/products";
  if (!results.home.heroBrowseProductsNavigates) results.criticalFailures.push("Home: 'تصفح المنتجات' did not navigate to /products");

  await gotoApp("/");
  await page.locator("main").getByRole("link", { name: "من نحن", exact: true }).click();
  await page.waitForTimeout(250);
  results.home.heroAboutNavigates = new URL(page.url()).pathname === "/about";
  if (!results.home.heroAboutNavigates) results.criticalFailures.push("Home: 'من نحن' did not navigate to /about");

  await gotoApp("/");
  await page.locator("main").getByRole("link", { name: "عرض جميع المنتجات", exact: true }).click();
  await page.waitForTimeout(250);
  results.home.featuredSeeAllNavigates = new URL(page.url()).pathname === "/products";
  if (!results.home.featuredSeeAllNavigates) results.criticalFailures.push("Home: 'عرض جميع المنتجات' did not navigate to /products");

  // --- Products: category filter buttons + state updates ---
  await gotoApp("/products");
  results.products.initialProductCountEstimate = await page.getByRole("button", { name: "أضف للسلة" }).count();

  const categories = ["الكل", "عصائر", "نودلز", "كوري", "أوروبي", "وجبات سريعة"];
  results.products.categoryClicks = [];
  for (const category of categories) {
    const btn = page.getByRole("button", { name: category, exact: true });
    const exists = await btn.isVisible().catch(() => false);
    if (!exists) {
      results.products.categoryClicks.push({ category, ok: false, reason: "button not found" });
      results.criticalFailures.push(`Products: category button not found: ${category}`);
      continue;
    }
    await btn.click();
    await page.waitForTimeout(250);

    const className = await btn.evaluate((el) => el.className).catch(() => "");
    const looksActive =
      String(className).includes("text-white") ||
      String(className).includes("bg-gradient-to-l") ||
      String(className).includes("bg-primary");
    const countAfter = await page.getByRole("button", { name: "أضف للسلة" }).count();
    results.products.categoryClicks.push({
      category,
      ok: looksActive,
      activeHeuristic: looksActive,
      productCountEstimate: countAfter,
    });
    if (!looksActive) results.criticalFailures.push(`Products: category '${category}' did not look active after click`);
  }

  // --- Contact: validation (empty, invalid email), then success + reset ---
  await gotoApp("/contact");
  const submitBtn = page.getByRole("button", { name: /إرسال الرسالة|جاري الإرسال/ });

  await submitBtn.click();
  await page.waitForTimeout(250);
  const expectedEmptyErrors = ["الاسم مطلوب", "البريد الإلكتروني مطلوب", "الموضوع مطلوب", "الرسالة مطلوبة"];
  const emptyErrorsPresent = {};
  for (const msg of expectedEmptyErrors) {
    emptyErrorsPresent[msg] = await page.getByText(msg, { exact: true }).isVisible().catch(() => false);
  }
  results.contact.emptySubmitErrors = emptyErrorsPresent;
  for (const msg of expectedEmptyErrors) {
    if (!emptyErrorsPresent[msg]) results.criticalFailures.push(`Contact: missing empty-submit error message: ${msg}`);
  }

  await page.getByLabel("الاسم الكامل").fill("اختبار");
  await page.getByLabel("البريد الإلكتروني").fill("invalid-email");
  await page.getByLabel("الموضوع").fill("استفسار");
  await page.getByLabel("الرسالة").fill("هذه رسالة اختبار.");
  await submitBtn.click();
  await page.waitForTimeout(250);
  results.contact.invalidEmailErrorVisible = await page
    .getByText("البريد الإلكتروني غير صالح", { exact: true })
    .isVisible()
    .catch(() => false);
  if (!results.contact.invalidEmailErrorVisible) results.criticalFailures.push("Contact: invalid email validation not visible");

  await page.getByLabel("البريد الإلكتروني").fill("test@example.com");
  await submitBtn.click();
  await page.waitForTimeout(350);

  const successText = "شكراً لتواصلك معنا! سنرد عليك قريباً.";
  results.contact.successMessageVisible = await page.getByText(successText, { exact: true }).isVisible().catch(() => false);
  if (!results.contact.successMessageVisible) results.criticalFailures.push("Contact: success message not visible");

  const formValuesAfter = {
    name: normalizeText(await page.getByLabel("الاسم الكامل").inputValue().catch(() => "")),
    email: normalizeText(await page.getByLabel("البريد الإلكتروني").inputValue().catch(() => "")),
    subject: normalizeText(await page.getByLabel("الموضوع").inputValue().catch(() => "")),
    message: normalizeText(await page.getByLabel("الرسالة").inputValue().catch(() => "")),
  };
  results.contact.formReset = {
    values: formValuesAfter,
    ok:
      formValuesAfter.name === "" &&
      formValuesAfter.email === "" &&
      formValuesAfter.subject === "" &&
      formValuesAfter.message === "",
  };
  if (!results.contact.formReset.ok) results.criticalFailures.push("Contact: form did not reset after successful submit");

  // --- RTL checks ---
  await gotoApp("/");
  results.rtl.documentDir = await page.evaluate(() => document.dir || document.documentElement.getAttribute("dir") || "").catch(() => "");
  results.rtl.rootComputedDirection = await page.evaluate(() => getComputedStyle(document.documentElement).direction).catch(() => "");
  results.rtl.bodyComputedDirection = await page.evaluate(() => getComputedStyle(document.body).direction).catch(() => "");
  results.rtl.layoutDirAttributePresent = await page.evaluate(() => Boolean(document.querySelector('[dir="rtl"]'))).catch(() => false);

  // --- Responsive: narrow viewport, ensure header menu works ---
  const narrow = await browser.newContext({ viewport: { width: 375, height: 700 } });
  const narrowPage = await narrow.newPage();
  await narrowPage.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await narrowPage.waitForTimeout(300);

  const header = narrowPage.locator("header");
  results.responsive.headerVisibleNarrow = await header.isVisible().catch(() => false);
  const menuBtn = header.getByRole("button").first();
  results.responsive.menuButtonVisible = await menuBtn.isVisible().catch(() => false);

  if (!results.responsive.headerVisibleNarrow) results.criticalFailures.push("Responsive: header not visible at narrow viewport");
  if (!results.responsive.menuButtonVisible) results.criticalFailures.push("Responsive: mobile menu button not visible at narrow viewport");

  if (results.responsive.menuButtonVisible) {
    await menuBtn.click();
    await narrowPage.waitForTimeout(250);
    const productsLink = narrowPage.getByRole("link", { name: "المنتجات" });
    results.responsive.mobileMenuProductsLinkVisible = await productsLink.isVisible().catch(() => false);
    if (!results.responsive.mobileMenuProductsLinkVisible) results.criticalFailures.push("Responsive: products link not visible in mobile menu");

    if (results.responsive.mobileMenuProductsLinkVisible) {
      await productsLink.click();
      await narrowPage.waitForTimeout(250);
      results.responsive.mobileMenuNavToProducts = new URL(narrowPage.url()).pathname === "/products";
      if (!results.responsive.mobileMenuNavToProducts) results.criticalFailures.push("Responsive: mobile menu nav to /products failed");
    }
  }

  await narrow.close();

  // --- Console summary (errors + warnings only) ---
  results.console.errors = consoleMessages.filter((m) => m.kind === "error").map((m) => ({ url: m.url, text: m.text }));
  results.console.warnings = consoleMessages.filter((m) => m.kind === "warning").map((m) => ({ url: m.url, text: m.text }));

  // Emit one machine-readable line for parsing.
  // eslint-disable-next-line no-console
  console.log(`QA_RESULTS_JSON=${JSON.stringify(results)}`);

  expect(results.criticalFailures, `Critical failures: ${results.criticalFailures.join(" | ")}`).toEqual([]);
});

