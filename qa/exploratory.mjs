import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";

function withBase(pathname) {
  return `${BASE_URL}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeText(s) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

async function gotoApp(page, pathname) {
  await page.goto(withBase(pathname), { waitUntil: "domcontentloaded" });
  // Vite dev server uses websockets; "networkidle" can hang.
  await page.waitForTimeout(300);
}

async function clickNavLink(page, label) {
  const link = page.getByRole("link", { name: label });
  await link.click();
  await page.waitForTimeout(250);
}

function categorizeConsoleMessage(msg) {
  const type = msg.type(); // log, info, warning, error, debug
  if (type === "warning") return "warning";
  if (type === "error") return "error";
  return "info";
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

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
  };

  // --- Routing via header nav (desktop) ---
  await gotoApp(page, "/");
  for (const { label, expectedPath } of [
    { label: "الرئيسية", expectedPath: "/" },
    { label: "المنتجات", expectedPath: "/products" },
    { label: "من نحن", expectedPath: "/about" },
    { label: "تواصل معنا", expectedPath: "/contact" },
  ]) {
    const before = new URL(page.url()).pathname;
    await clickNavLink(page, label);
    const after = new URL(page.url()).pathname;
    results.routing.push({
      label,
      from: before,
      to: after,
      ok: after === expectedPath,
      expectedPath,
    });
    await gotoApp(page, expectedPath);
  }

  // --- Home: featured products render + buttons navigate ---
  await gotoApp(page, "/");
  const featuredHeading = page.getByRole("heading", { name: /منتجاتنا.*المميزة/ });
  results.home.featuredHeadingVisible = await featuredHeading.isVisible().catch(() => false);

  const addToCartButtonsOnHome = await page
    .getByRole("button", { name: "أضف للسلة" })
    .count()
    .catch(() => 0);
  results.home.featuredProductCardCountEstimate = addToCartButtonsOnHome;

  await page.getByRole("link", { name: "تصفح المنتجات" }).click();
  await page.waitForTimeout(250);
  results.home.heroBrowseProductsNavigates = new URL(page.url()).pathname === "/products";

  await gotoApp(page, "/");
  await page.getByRole("link", { name: "من نحن" }).click();
  await page.waitForTimeout(250);
  results.home.heroAboutNavigates = new URL(page.url()).pathname === "/about";

  await gotoApp(page, "/");
  await page.getByRole("link", { name: "عرض جميع المنتجات" }).click();
  await page.waitForTimeout(250);
  results.home.featuredSeeAllNavigates = new URL(page.url()).pathname === "/products";

  // --- Products: category filter buttons + state updates ---
  await gotoApp(page, "/products");
  const productGridAddToCartCount = await page.getByRole("button", { name: "أضف للسلة" }).count();
  results.products.initialProductCountEstimate = productGridAddToCartCount;

  const categories = ["الكل", "عصائر", "نودلز", "كوري", "أوروبي", "وجبات سريعة"];
  results.products.categoryClicks = [];
  for (const category of categories) {
    const btn = page.getByRole("button", { name: category, exact: true });
    const exists = await btn.isVisible().catch(() => false);
    if (!exists) {
      results.products.categoryClicks.push({ category, ok: false, reason: "button not found" });
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
  }

  // --- Contact: validation (empty, invalid email), then success + reset ---
  await gotoApp(page, "/contact");
  const submitBtn = page.getByRole("button", { name: /إرسال الرسالة|جاري الإرسال/ });

  // Empty submit
  await submitBtn.click();
  await page.waitForTimeout(250);
  const expectedEmptyErrors = ["الاسم مطلوب", "البريد الإلكتروني مطلوب", "الموضوع مطلوب", "الرسالة مطلوبة"];
  const emptyErrorsPresent = {};
  for (const msg of expectedEmptyErrors) {
    emptyErrorsPresent[msg] = await page.getByText(msg, { exact: true }).isVisible().catch(() => false);
  }
  results.contact.emptySubmitErrors = emptyErrorsPresent;

  // Invalid email
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

  // Valid submit
  await page.getByLabel("البريد الإلكتروني").fill("test@example.com");
  await submitBtn.click();
  await page.waitForTimeout(350);

  const successText = "شكراً لتواصلك معنا! سنرد عليك قريباً.";
  results.contact.successMessageVisible = await page.getByText(successText, { exact: true }).isVisible().catch(() => false);

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

  // --- RTL checks ---
  await gotoApp(page, "/");
  results.rtl.documentDir = await page.evaluate(() => document.dir || document.documentElement.getAttribute("dir") || "").catch(() => "");
  results.rtl.rootComputedDirection = await page
    .evaluate(() => getComputedStyle(document.documentElement).direction)
    .catch(() => "");
  results.rtl.bodyComputedDirection = await page.evaluate(() => getComputedStyle(document.body).direction).catch(() => "");
  results.rtl.layoutDirAttributePresent = await page
    .evaluate(() => Boolean(document.querySelector('[dir="rtl"]')))
    .catch(() => false);

  // --- Responsive: narrow viewport, ensure header menu works ---
  const narrow = await browser.newContext({ viewport: { width: 375, height: 700 } });
  const narrowPage = await narrow.newPage();
  await gotoApp(narrowPage, "/");

  const header = narrowPage.locator("header");
  results.responsive.headerVisibleNarrow = await header.isVisible().catch(() => false);

  // Menu button: on < 640px, cart is hidden, so first header button should be hamburger.
  const menuBtn = header.getByRole("button").first();
  results.responsive.menuButtonVisible = await menuBtn.isVisible().catch(() => false);

  if (results.responsive.menuButtonVisible) {
    await menuBtn.click();
    await narrowPage.waitForTimeout(250);
    const productsLink = narrowPage.getByRole("link", { name: "المنتجات" });
    results.responsive.mobileMenuProductsLinkVisible = await productsLink.isVisible().catch(() => false);
    if (results.responsive.mobileMenuProductsLinkVisible) {
      await productsLink.click();
      await narrowPage.waitForTimeout(250);
      results.responsive.mobileMenuNavToProducts = new URL(narrowPage.url()).pathname === "/products";
    }
  }

  // --- Console summary (errors + warnings only) ---
  results.console.errors = consoleMessages.filter((m) => m.kind === "error").map((m) => ({ url: m.url, text: m.text }));
  results.console.warnings = consoleMessages.filter((m) => m.kind === "warning").map((m) => ({ url: m.url, text: m.text }));

  // Basic assertions for easy-to-spot regressions (keeps script honest).
  assert(results.routing.every((r) => r.ok), `Routing failed: ${JSON.stringify(results.routing, null, 2)}`);
  assert(results.home.featuredHeadingVisible, "Home featured heading not visible");
  assert(results.home.heroBrowseProductsNavigates, "Home 'تصفح المنتجات' did not navigate to /products");
  assert(results.home.heroAboutNavigates, "Home 'من نحن' did not navigate to /about");
  assert(results.contact.invalidEmailErrorVisible, "Contact invalid email validation not visible");
  assert(results.contact.successMessageVisible, "Contact success message not visible");

  console.log(JSON.stringify(results, null, 2));

  await narrow.close();
  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

