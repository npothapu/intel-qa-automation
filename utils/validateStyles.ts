import { Page, expect } from '@playwright/test';

type StyleExpectations = Record<string, string>;

export async function validateComputedStyles(
  page: Page,
  selector: string,
  expectedStyles: StyleExpectations
) {
  const styles = await page.$eval(selector, (el, expected) => {
    const computed = window.getComputedStyle(el);
    const result: Record<string, string> = {};
    for (const prop in expected) {
      result[prop] = computed.getPropertyValue(prop).trim();
    }
    return result;
  }, expectedStyles);

  for (const [prop, expectedValue] of Object.entries(expectedStyles)) {
    expect(styles[prop]).toBe(expectedValue);
  }
}
