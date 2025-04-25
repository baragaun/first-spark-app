import type { Page } from '@playwright/test';

/**
 * Deletes a test account using the myUserContext exposed on the window
 * @param page The Playwright page object
 * @param reason Optional reason for deletion (defaults to 'e2e-test-cleanup')
 * @param description Optional description (defaults to 'Automated cleanup after e2e test')
 * @returns Promise<boolean> indicating success or failure
 */
export async function deleteTestAccount(
  page: Page,
  reason = 'e2e-test-cleanup',
  description = 'Automated cleanup after e2e test',
): Promise<boolean> {
  return await page.evaluate(
    async ({ reason, description }) => {
      try {
        // Access myUserContext through the window's global scope
        const myUserContext = (window as any).__myUserContext;
        if (myUserContext && typeof myUserContext.deleteMyAccount === 'function') {
          // Call the deleteMyAccount method with parameters for physical deletion
          const result = await myUserContext.deleteMyAccount(reason, description, true);

          if (result === true) {
            console.log('Test account successfully deleted');
            return true;
          } else {
            console.error('Failed to delete test account:', result);
            return false;
          }
        } else {
          console.error('myUserContext.deleteMyAccount is not available');
          return false;
        }
      } catch (error) {
        console.error('Failed to delete test account:', error);
        return false;
      }
    },
    { reason, description },
  );
}
