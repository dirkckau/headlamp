import { expect, Page } from '@playwright/test';

export class HeadlampAppPage {
  constructor(private page: Page) {}

  // TESTS FOR NAVIGATION FOR FRONTEND ONLY
  async navHomepage() {
    await this.page.goto('http://localhost:3000/');
    await expect(this.page.getByRole('button', { name: 'Home' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Home' }).click();
  }

  async navNotifactions() {
    await this.page.goto('http://localhost:3000/');
    await expect(this.page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Notifications' }).click();
    await expect(this.page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  }

  // TEST FOR IN CLUSTER

  async authenticate() {
    await this.page.goto('/');
    await this.page.waitForSelector('h1:has-text("Authentication")');

    // Expects the URL to contain c/main/token
    this.hasURLContaining(/.*token/);

    const token = process.env.HEADLAMP_TOKEN || '';
    this.hasToken(token);

    // Fill in the token
    await this.page.locator('#token').fill(token);

    // Click on the "Authenticate" button and wait for navigation
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click('button:has-text("Authenticate")'),
    ]);
  }
  async hasURLContaining(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  async hasTitleContaining(pattern: RegExp) {
    await expect(this.page).toHaveTitle(pattern);
  }

  async hasToken(token: string) {
    expect(token).not.toBe('');
  }
}
