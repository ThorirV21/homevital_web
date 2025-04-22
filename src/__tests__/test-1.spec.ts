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
