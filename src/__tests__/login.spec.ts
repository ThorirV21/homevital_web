import { test, expect } from "@playwright/test";

test("Login function", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1111111111");
  await page.getByRole("button", { name: "Innskrá" }).click();

  await expect(
    page.getByRole("paragraph").filter({ hasText: "Skjólstæðingar" })
  ).toBeVisible();
});
