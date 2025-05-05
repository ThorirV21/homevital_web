import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("234567890");
  await page.getByRole("textbox", { name: "Kennitala" }).press("Enter");
  await page.getByRole("button", { name: "Innskrá" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1234567890");
  await page.getByRole("button", { name: "Innskrá" }).click();
  await page.goto("http://localhost:3000/dashboard/clients/list");
  await page.getByRole("link", { name: "Viðvaranir Viðvaranir" }).click();
  await expect(page.locator("td:nth-child(2)").first()).toBeVisible();
});
