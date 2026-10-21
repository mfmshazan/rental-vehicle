import { test, expect } from "@playwright/test";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

test("search, filters, empty state, saved vehicles, demo contact, and mobile layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A better ride. A bigger adventure." }),
  ).toBeVisible();
  await expect(page.locator(".vehicle-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Events & Functions", exact: true })
    .click();
  await expect(page.locator(".vehicle-card")).toHaveCount(4);
  await page.getByRole("button", { name: "All services", exact: true }).click();
  await expect(page.locator(".vehicle-card")).toHaveCount(6);
  await page.getByLabel("Where are you headed?").selectOption("Kandy");
  await page
    .getByRole("button", { name: "Find a vehicle", exact: true })
    .click();
  await expect(page.locator(".vehicle-card")).toHaveCount(1);
  await expect(page.locator(".card-title")).toHaveText("Honda CR-V");
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByLabel("Vehicle type").selectOption("Hatchback");
  await expect(page.locator(".card-title")).toHaveText("Fiat 500");
  await page.getByRole("button", { name: "Save vehicle", exact: true }).click();
  await page.goto("/saved");
  await expect(page.locator(".vehicle-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".card-title")).toHaveText("Fiat 500");
  await page
    .getByRole("button", { name: "Remove from saved vehicles" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next adventure is waiting." }),
  ).toBeVisible();
  await page.goto("/");
  await page.getByLabel("Search vehicles", { exact: true }).fill("no-such-car");
  await expect(
    page.getByRole("heading", { name: "No rides found this time." }),
  ).toBeVisible();
  await page.getByLabel("Search vehicles", { exact: true }).clear();
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByLabel("Daily budget").selectOption("10000");
  await expect(page.locator(".card-title")).toHaveText("Fiat 500");
  await page.getByRole("link", { name: "Fiat 500", exact: true }).click();
  await expect(page.locator(".demo-contact")).toContainText(
    "This vehicle cannot be rented or contacted",
  );
  await expect(page.locator('a[href^="https://wa.me"]')).toHaveCount(0);
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/roam-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
  });
  await page.screenshot({
    path: "test-results/roam-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("owner registration, publish, inquiry, ownership checks, edit and pause", async ({
  page,
  browser,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email address").fill("missing@example.invalid");
  await page
    .getByLabel("Password", { exact: true })
    .fill("Incorrect-password-123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator(".form-message.error")).toContainText(
    "Email or password is incorrect",
  );
  await page.goto("/register");
  await page.getByLabel("Your name", { exact: true }).fill("Test Owner");
  await page.getByLabel("Email address").fill("owner@test.invalid");
  await page.getByLabel("Mobile number").fill("0771234567");
  await page
    .getByLabel("Password", { exact: true })
    .fill("Roam-test-password-123");
  await page
    .getByRole("button", { name: "Create owner account", exact: true })
    .click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("link", { name: "List your first vehicle" }).click();
  await page.getByLabel("Listing title").fill("Toyota Aqua Test Ride");
  await page.getByLabel("Brand", { exact: true }).fill("Toyota");
  await page.getByLabel("Model", { exact: true }).fill("Aqua");
  await page.getByLabel("Daily rate (LKR)").fill("7500");
  await page
    .getByLabel("About your vehicle")
    .fill(
      "Comfortable city car with air conditioning. Contact me for pickup and rental terms.",
    );
  await page
    .locator('input[name="photo"]')
    .setInputFiles({
      name: "fake.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("This is not an image."),
    });
  await page.getByRole("button", { name: "Publish your vehicle" }).click();
  await expect(page.locator(".form-message.error")).toContainText(
    "Please upload a JPEG, PNG, or WebP photo",
  );
  await expect(page.getByLabel("Listing title")).toHaveValue(
    "Toyota Aqua Test Ride",
  );
  await page
    .locator('input[name="photo"]')
    .setInputFiles(path.join(process.cwd(), "public/images/hatchback.jpg"));
  await page.getByRole("button", { name: "Publish your vehicle" }).click();
  await expect(page).toHaveURL(/\/dashboard\?published=1/);
  await expect(page.locator(".dashboard-vehicle")).toContainText(
    "Toyota Aqua Test Ride",
  );
  const href = await page
    .locator(".dashboard-vehicle")
    .getByRole("link", { name: "View", exact: true })
    .getAttribute("href");
  expect(href).toBeTruthy();
  const id = href!.split("/").pop()!;
  const customer = await browser.newContext();
  const customerPage = await customer.newPage();
  await customerPage.goto(`http://localhost:3100${href}`);
  await expect(
    customerPage.getByRole("link", { name: /Chat on WhatsApp/ }),
  ).toHaveAttribute("href", /^https:\/\/wa.me\/94771234567\?/);
  const photo = customerPage.locator(".detail-photo img");
  await expect(photo).toHaveJSProperty("complete", true);
  expect(
    await photo.evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
  await customerPage
    .getByRole("button", { name: "Prefer to send an inquiry?" })
    .click();
  await customerPage
    .getByLabel("Your name", { exact: true })
    .fill("Test Renter");
  await customerPage
    .getByLabel("Email", { exact: true })
    .fill("renter@test.invalid");
  await customerPage
    .getByLabel("Mobile number", { exact: true })
    .fill("0712345678");
  const start = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const end = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
  await customerPage.getByLabel("Pickup date").fill(end);
  await customerPage.getByLabel("Return date").fill(start);
  await customerPage
    .getByLabel("Your message")
    .fill("Hello! Is your vehicle available for our weekend trip?");
  await customerPage
    .getByRole("button", { name: "Send inquiry", exact: true })
    .click();
  await expect(customerPage.locator(".form-message.error")).toContainText(
    "Return date must be on or after pickup",
  );
  await expect(
    customerPage.getByLabel("Your name", { exact: true }),
  ).toHaveValue("Test Renter");
  await customerPage.getByLabel("Pickup date").fill(start);
  await customerPage.getByLabel("Return date").fill(end);
  await customerPage
    .getByRole("button", { name: "Send inquiry", exact: true })
    .click();
  await expect(customerPage.getByRole("status")).toContainText("owner's inbox");
  await page.reload();
  await expect(page.locator(".inquiry-card")).toContainText("Test Renter");
  await page.getByRole("button", { name: "Mark as read" }).click();
  await expect(page.locator(".inquiry-card.unread")).toHaveCount(0);
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await page.getByLabel("Daily rate (LKR)").fill("8000");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".dashboard-vehicle")).toContainText("8,000");
  // Owner blocks an upcoming date range as unavailable.
  const blockStart = new Date(Date.now() + 10 * 86400000)
    .toISOString()
    .slice(0, 10);
  const blockEnd = new Date(Date.now() + 12 * 86400000)
    .toISOString()
    .slice(0, 10);
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await page.getByLabel("Unavailable from").fill(blockStart);
  await page.getByLabel("Unavailable to").fill(blockEnd);
  await page.getByRole("button", { name: "Block these dates" }).click();
  await expect(page.locator(".blocked-list li")).toHaveCount(1);
  await page.goto("http://localhost:3100/dashboard");
  // Customer sees the unavailable days on the listing and is warned on overlap.
  await customerPage.goto(`http://localhost:3100${href}`);
  await expect(
    customerPage.locator(".calendar-cell.blocked").first(),
  ).toBeVisible();
  await customerPage
    .getByRole("button", { name: "Prefer to send an inquiry?" })
    .click();
  await customerPage.getByLabel("Pickup date").fill(blockStart);
  await customerPage.getByLabel("Return date").fill(blockEnd);
  await expect(customerPage.locator(".form-message.warn")).toBeVisible();
  await customerPage.goto("http://localhost:3100/register");
  await customerPage
    .getByLabel("Your name", { exact: true })
    .fill("Other Owner");
  await customerPage.getByLabel("Email address").fill("other@test.invalid");
  await customerPage.getByLabel("Mobile number").fill("0773333333");
  await customerPage
    .getByLabel("Password", { exact: true })
    .fill("Another-test-password");
  await customerPage
    .getByRole("button", { name: "Create owner account", exact: true })
    .click();
  await expect(customerPage).toHaveURL(/\/dashboard$/);
  await expect(customerPage.locator(".inquiry-card")).toHaveCount(0);
  const response = await customerPage.goto(
    `http://localhost:3100/dashboard/vehicles/${id}/edit`,
  );
  // Next may stream a not-found boundary after sending response headers.
  expect([200, 404]).toContain(response?.status());
  await expect(
    customerPage.getByRole("heading", { name: "This road ends here." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.locator(".dashboard-vehicle")).toContainText("Paused");
  await customerPage.goto(`http://localhost:3100${href}`);
  await expect(
    customerPage.getByRole("heading", { name: "This road ends here." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page.locator(".dashboard-vehicle")).toContainText("Published");
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page.goto("/login");
  await page.getByLabel("Email address").fill("owner@test.invalid");
  await page
    .getByLabel("Password", { exact: true })
    .fill("Roam-test-password-123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator(".dashboard-vehicle")).toContainText(
    "Toyota Aqua Test Ride",
  );
  const database = new PrismaClient({ datasourceUrl: "file:./roam-test.db" });
  const owner = await database.user.findUnique({
    where: { email: "owner@test.invalid" },
  });
  expect(owner?.passwordHash).toMatch(/^\$2/);
  expect(owner?.passwordHash).not.toContain("Roam-test-password");
  await database.$disconnect();
  await customer.close();
});
