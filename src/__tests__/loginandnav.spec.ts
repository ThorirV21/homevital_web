import { test, expect } from "@playwright/test";

test("Login displays error when incorrect id number is entered", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("11111");
  await page.getByRole("button", { name: "Innskrá" }).click();
  await expect(page.getByText("Sláðu inn gilda kennitölu")).toBeVisible();
});
test("Login success", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1234567890");
  await page.getByRole("button", { name: "Innskrá" }).click();

  await expect(page.getByText("Skjólstæðingar")).toBeVisible({
    timeout: 10_000,
  });
});
test("Navigation", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Kennitala" }).click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1234567890");
  await page.getByRole("button", { name: "Innskrá" }).click();
  await page.getByRole("img", { name: "HomeVital logo" }).click();
  // Expect redirect to dashboard page
  await expect(page).toHaveURL("http://localhost:3000/dashboard/clients/list");

  await page.getByRole("link", { name: "Stillingar Stillingar" }).click();
  //Expect redirect to settings page
  await expect(page).toHaveURL("http://localhost:3000/dashboard/settings");

  await page.getByRole("link", { name: "Leiðbeiningar Leiðbeiningar" }).click();
  //Expect redirect to guidelines
  await expect(page).toHaveURL("http://localhost:3000/dashboard/guidelines");

  await page.getByRole("link", { name: "Viðvaranir Viðvaranir" }).click();
  //Expect redirect to warnings
  await expect(page).toHaveURL("http://localhost:3000/dashboard/warnings");

  //Feature not implemented yet
  //await page.getByRole("img", { name: "HomeVital logo" }).click();
  // Expect redirect to dashboard page
  //await expect(page).toHaveURL("http://localhost:3000/dashboard/clients/list");
});

test("Logout", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page
    .locator("div")
    .filter({ hasText: "KennitalaSláðu inn kennitö" })
    .first()
    .click();
  await page.getByText("KennitalaSláðu inn kennitölu").click();
  await page.getByRole("textbox", { name: "Kennitala" }).fill("1234567890");
  await page.getByRole("button", { name: "Innskrá" }).click();
  await page.getByRole("button", { name: "Útskrá Útskrá" }).click();
  // Expect redirect to login page
  await expect(page).toHaveURL("http://localhost:3000/login");

  //Expect error message to be visible

  await page.goto("http://localhost:3000/dashboard/clients/list");
  await expect(page.getByText("Error: No token found")).toBeVisible({
    timeout: 10_000,
  });
});
