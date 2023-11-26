import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Page title", async ({ page }) => {
  await expect(page).toHaveTitle(/Pile Coding Challenge/);
});

test("Successful transfer", async ({ page }) => {
  await page.getByRole("button", { name: "Please select an account" }).click();
  await page
    .getByRole("option", { name: "DE56530041836982318248 (auu9v) €" })
    .click();
  await page.getByLabel("Amount (EUR)").fill("2000");
  await page.getByLabel("IBAN").fill("DE20214577582752901028");
  await page.getByLabel("BIC").fill("DEUBNK123");
  await page.getByLabel("Recipient's Name").fill("John Smith");
  await page.getByLabel("Reference").fill("Ref. 123");
  await page.getByRole("button", { name: "Transfer" }).click();
  const dialogDismissButton = page.getByRole("button", {
    name: "Done",
  });
  await dialogDismissButton.click();

  await expect(dialogDismissButton).not.toBeVisible();
});

test("Require source account", async ({ page }) => {
  await page.getByLabel("Amount (EUR)").fill("2000");
  await page.getByLabel("IBAN").fill("DE20214577582752901028");
  await page.getByLabel("BIC").fill("DEUBNK123");
  await page.getByLabel("Recipient's Name").fill("John Smith");
  await page.getByLabel("Reference").fill("Ref. 123");
  await page.getByRole("button", { name: "Transfer" }).click();

  await expect(page.getByText("Source account required")).toBeVisible();
});
