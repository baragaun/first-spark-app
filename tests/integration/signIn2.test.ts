import { goto } from '$app/navigation';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import SignInForm from '../../src/routes/signin/sign-in-form.svelte';
import { mockBrowserAPIs } from '../utils/test-setup';
import { myUserContext } from '@/contexts/my-user-context.svelte';
import MyUserProvider from '@/contexts/my-user-provider.svelte';
import type { Snippet } from 'svelte';

// We're not mocking the myUserContext methods in this test
// Instead, we'll use the real implementations

// Mock navigation module since we can't navigate in tests
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn(),
  disableScrollHandling: vi.fn(),
  onNavigate: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadData: vi.fn(),
  preloadCode: vi.fn(),
}));

beforeAll(() => {
  mockBrowserAPIs();
});

// Helper function to render components with MyUserProvider
function renderWithProvider(component: any, props = {}) {
  return render(MyUserProvider, {
    props: {
      children: () => component,
    }
  });
}

describe('SignInForm Integration Tests with Real Client Functions', () => {

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(goto).mockResolvedValue(undefined);
  });

  it('renders the sign-in form with all UI elements', () => {
    const { getByText, getByLabelText, getByRole } = renderWithProvider(SignInForm, {
      data: {
        form: {
          data: { ident: '', password: '', authType: 'password' },
          errors: {},
          constraints: {},
          id: 'signin-form',
          valid: false,
          posted: false,
        },
      },
    });

    // Check for form elements
    expect(getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(getByLabelText('Email or Username')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Sign in with token')).toBeInTheDocument();
    expect(getByText('Forgot your password?')).toBeInTheDocument();
  });

  it('submits the form with password and attempts real sign-in', async () => {
    // We're using a test account that won't actually authenticate
    // but we can verify the form submission works correctly

    const { getByLabelText, getByRole, findByText } = render(SignInForm, {
      props: {
        data: {
          form: {
            data: { ident: '', password: '', authType: 'password' },
            errors: {},
            constraints: {},
            id: 'signin-form',
            valid: false,
            posted: false,
          },
        },
      },
    });

    // Fill in the form with test credentials
    await fireEvent.input(getByLabelText('Email or Username'), {
      target: { value: 'test@example.com' },
    });

    await fireEvent.input(getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    const signInButton = getByRole('button', { name: 'Sign in' });
    await fireEvent.click(signInButton);

    // Add debugging to see what's happening
    console.log('Before calling signMeInWithPassword');
    const signInSpy = vi.spyOn(myUserContext, 'signMeInWithPassword');

    // Wait for the method to be called
    await waitFor(() => {
      expect(signInSpy).toHaveBeenCalled();
      console.log('signMeInWithPassword was called');
      console.log('Call arguments:', signInSpy.mock.calls[0]);
      console.log('Return value:', signInSpy.mock.results[0]?.value);
    });

    // Verify the auth method was called with correct parameters
    await waitFor(() => {
      expect(myUserContext.signMeInWithPassword).toHaveBeenCalledWith(
        'test@example.com',
        'email',
        'password123',
      );
    });

    // Since we're using real functions, we expect an error message
    // for invalid credentials
    const errorMessage = await findByText(/Invalid credentials/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  it('handles form validation correctly', async () => {
    const { getByRole, findByText } = render(SignInForm, {
      props: {
        data: {
          form: {
            data: { ident: '', password: '', authType: 'password' },
            errors: {},
            constraints: {},
            id: 'signin-form',
            valid: false,
            posted: false,
          },
        },
      },
    });

    // Submit without filling anything
    const signInButton = getByRole('button', { name: 'Sign in' });
    await fireEvent.click(signInButton);

    // Check for validation errors
    const validationError = await findByText(/username or email is required/i);
    expect(validationError).toBeInTheDocument();
  });

  it('switches to token authentication mode correctly', async () => {
    const { getByLabelText, getByText, findByText } = render(SignInForm, {
      props: {
        data: {
          form: {
            data: { ident: '', password: '', authType: 'password' },
            errors: {},
            constraints: {},
            id: 'signin-form',
            valid: false,
            posted: false,
          },
        },
      },
    });

    // Fill in email
    await fireEvent.input(getByLabelText('Email or Username'), {
      target: { value: 'integration-test@example.com' },
    });

    // Click "Sign in with token" button
    const tokenButton = getByText('Sign in with token');
    await fireEvent.click(tokenButton);

    // Since we're using real functions with a non-existent email,
    // we expect to see an error message
    try {
      const errorMessage = await findByText(/failed to send verification code/i, {}, { timeout: 3000 });
      expect(errorMessage).toBeInTheDocument();
    } catch (e) {
      // If no error message is shown, we should at least see the verification UI
      const verificationText = await findByText(/verification code/i, {}, { timeout: 3000 });
      expect(verificationText).toBeInTheDocument();
    }
  });

  // Test for "Forgot your password?" functionality
  it('navigates to password reset page when clicking "Forgot your password?"', async () => {
    const { getByText } = render(SignInForm, {
      props: {
        data: {
          form: {
            data: { ident: '', password: '', authType: 'password' },
            errors: {},
            constraints: {},
            id: 'signin-form',
            valid: false,
            posted: false,
          },
        },
      },
    });

    // Click "Forgot your password?" link
    const forgotPasswordLink = getByText('Forgot your password?');
    await fireEvent.click(forgotPasswordLink);

    // Verify navigation to password reset page
    expect(goto).toHaveBeenCalledWith('/reset-password');
  });
});
