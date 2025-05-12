import { test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1234567890");
  await page.getByRole("textbox", { name: "Kennitala" }).press("Enter");
  await page.getByRole("button", { name: "Innskrá" }).click();
  await page.getByRole("link", { name: "Stillingar Stillingar" }).click();
  await page.getByRole("button", { name: "Bæta við starfsfólki" }).click();
  await page.getByRole("textbox", { name: "Nafn" }).click();
  await page.getByRole("textbox", { name: "Nafn" }).fill("ToBeDeleted");
  await page.getByRole("textbox", { name: "Nafn" }).press("Tab");
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1122334455");
  await page.getByRole("textbox", { name: "Símanúmer" }).click();
  await page.getByRole("textbox", { name: "Símanúmer" }).fill("5812345");
  await page
    .locator("div")
    .filter({ hasText: /^Teymi$/ })
    .locator("div")
    .nth(2)
    .click();
  await page.getByRole("option", { name: "Sárateymi" }).click();
  await page.getByRole("dialog", { name: "Starfsmaður" }).click();
  await page.getByRole("button", { name: "Vista" }).click();
  await page.goto("http://localhost:3000/dashboard/settings");
  await page.getByRole("button", { name: "Útskrá Útskrá" }).click();
});
