import { expect, test } from "@playwright/test";

test("public pages load and navigation works", async ({ page }) => {
  await page.goto("/");
  const productsNavLink = page.getByRole("link", { name: "المنتجات", exact: true });
  await expect(productsNavLink).toBeVisible();

  await productsNavLink.click();
  await expect(page).toHaveURL(/\/products/);
  await expect(page.getByPlaceholder("ابحث عن منتج...")).toBeVisible();

  await page.getByRole("link", { name: "تواصل معنا" }).first().click();
  await expect(page).toHaveURL(/\/contact/);
  await expect(page.getByRole("link", { name: "افتح بخرائط جوجل" })).toBeVisible();
});

test("account actions navigate to login", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "حسابي" }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "القائمة" }).click();
  await page.getByRole("link", { name: "تسجيل الدخول" }).click();
  await expect(page).toHaveURL(/\/login/);
});
