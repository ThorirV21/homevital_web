import { test, expect } from "@playwright/test";

test("createWorker", async ({ browser }) => {
  const context = await browser.newContext({
    bypassCSP: true,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  await page.goto("http://localhost:3000/login");
  await page.waitForTimeout(100);
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1234567890");
  await page.waitForTimeout(100);
  await page.getByRole("button", { name: "Innskrá" }).click();
  await page.waitForURL("http://localhost:3000/dashboard/clients/list");
  await page.goto("http://localhost:3000/dashboard/clients/list");
  await page.getByRole("link", { name: "Stillingar Stillingar" }).click();
  await page.getByRole("button", { name: "Bæta við starfsfólki" }).click();
  await page.getByRole("textbox", { name: "Nafn" }).click();
  await page.getByRole("textbox", { name: "Nafn" }).fill("Gunnar Gunnarsson");
  await expect(page.getByRole("textbox", { name: "Nafn" })).toHaveValue(
    "Gunnar Gunnarsson"
  );
  await page.waitForTimeout(300);
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("2011913192");
  await expect(page.getByRole("textbox", { name: "Kennitala" })).toHaveValue(
    "2011913192"
  );
  await page.waitForTimeout(300);

  await page.getByRole("textbox", { name: "Símanúmer" }).click();
  await page.getByRole("textbox", { name: "Símanúmer" }).fill("8454656");
  await expect(page.getByRole("textbox", { name: "Símanúmer" })).toHaveValue(
    "8454656"
  );
  await page.waitForTimeout(300);

  await page.waitForTimeout(300);
  await page.getByPlaceholder("Veldu teymi").click();
  await page.waitForTimeout(300);
  await page.getByRole("option", { name: "Team A" }).click();

  await page.waitForTimeout(100);
  await page.getByRole("option", { name: "Team B" }).click();
  await page.waitForTimeout(100);

  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Vista" }).click();

  await expect(
    page.getByRole("row", { name: "Gunnar Gunnarsson 8454656" })
  ).toBeVisible();
});
