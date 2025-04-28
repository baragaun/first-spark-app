import { goto } from '$app/navigation';
import { myUserContext } from '@/contexts/my-user-context.svelte';
import { MultiStepActionResult, MultiStepActionType } from '@baragaun/bg-node-client';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import SignInForm from '../../src/routes/signin/sign-in-form.svelte';
import { mockBrowserAPIs } from '../utils/test-setup';

// Mock navigation module
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

beforeEach(() => {
  // Spy on the real methods instead of mocking them
  vi.spyOn(myUserContext, 'signMeInWithPassword');
  vi.spyOn(myUserContext, 'signMeInWithToken');
  vi.spyOn(myUserContext, 'verifyMultiStepActionToken');
});

beforeAll(() => {
  mockBrowserAPIs();
});

describe('SignInForm Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Use vi.mocked to properly type the mock function
    vi.mocked(goto).mockResolvedValue(undefined);
  });

  it('renders the sign-in form with all UI elements', () => {
    const { getByText, getByLabelText, getByRole } = render(SignInForm, {
      props: {
        data: {
          form: {
            // Mock the superForm data structure
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

    // Check for form elements
    expect(getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(getByLabelText('Email or Username')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Sign in with token')).toBeInTheDocument();
    expect(getByText('Forgot your password?')).toBeInTheDocument();
  });

  it('submits the form with password and calls signMeInWithPassword', async () => {
    // Mock the return value for this specific test
    vi.mocked(myUserContext.signMeInWithPassword).mockResolvedValueOnce(true);

    const { getByLabelText, getByRole } = render(SignInForm, {
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

    // Fill in the form
    await fireEvent.input(getByLabelText('Email or Username'), {
      target: { value: 'test@example.com' },
    });

    await fireEvent.input(getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form - use a more specific selector
    const signInButton = getByRole('button', { name: 'Sign in' });
    await fireEvent.click(signInButton);

    // Verify the auth method was called with correct parameters
    await waitFor(() => {
      expect(myUserContext.signMeInWithPassword).toHaveBeenCalledWith(
        'test@example.com',
        'email',
        'password123',
      );
    });

    // Verify navigation after successful login
    expect(goto).toHaveBeenCalledWith('/');
  });

  it('switches to token authentication when clicking "Sign in with token"', async () => {
    // Mock the return value for this specific test
    vi.mocked(myUserContext.signMeInWithToken).mockResolvedValueOnce({
      object: {
        actionProgress: {
          actionId: 'test-action-id',
          userId: 'test-user-id',
          actionType: MultiStepActionType.resetPassword,
          result: MultiStepActionResult.unset,
          attemptCount: 0,
          id: 'progress-id',
          createdAt: new Date().toISOString(),
        },
        run: {
          addListener: () => 'mock-listener-id',
          removeListener: () => {},
          actionId: 'test-action-id',
          listeners: new Map(),
          pollingOptions: { enabled: true, interval: 1000, timeout: 10000 },
          onEventReceived: () => {},
          notifyListeners: () => {},
          abort: () => {},
          isStopped: () => false,
        },
        id: 'object-id',
        createdAt: new Date().toISOString(),
      },
    });

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
      target: { value: 'test@example.com' },
    });

    // Click "Sign in with token" button
    const tokenButton = getByText('Sign in with token');
    await fireEvent.click(tokenButton);

    // Verify token request was made
    await waitFor(() => {
      expect(myUserContext.signMeInWithToken).toHaveBeenCalledWith('test@example.com');
    });

    // Verify UI switched to OTP input
    await waitFor(async () => {
      // Use a more flexible text matcher function
      const verificationText = await findByText((content, element) => {
        return Boolean(
          content &&
            element &&
            element.textContent &&
            element.textContent.includes('verification code sent to'),
        );
      });
      expect(verificationText).toBeInTheDocument();

      // Look for the verify button by text content instead of ID
      const verifyButton = await findByText('Verify');
      expect(verifyButton).toBeInTheDocument();
    });
  });

  it('verifies token and completes sign-in process', async () => {
    // Mock token verification success
    vi.mocked(myUserContext.verifyMultiStepActionToken).mockResolvedValueOnce(true);

    const { findByText } = render(SignInForm, {
      props: {
        data: {
          form: {
            data: { ident: 'test@example.com', password: '', authType: 'token' },
            errors: {},
            constraints: {},
            id: 'signin-form',
            valid: false,
            posted: false,
          },
        },
      },
    });

    // Wait for the OTP input to be rendered
    await waitFor(async () => {
      const verificationText = await findByText((content, element) => {
        return Boolean(
          content &&
            element &&
            element.textContent &&
            element.textContent.includes('verification code sent to'),
        );
      });
      expect(verificationText).toBeInTheDocument();
    });

    // Enter verification code
    const otpInput = document.querySelector('#verification-code input');
    if (otpInput) {
      await fireEvent.input(otpInput, { target: { value: '666666' } });
    }

    // Submit the verification
    const verifyButton = await findByText('Verify');
    await fireEvent.click(verifyButton);

    // Verify navigation after successful verification
    expect(goto).toHaveBeenCalledWith('/');
  });

  it('shows validation errors for invalid inputs', async () => {
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
    expect(await findByText('Username or email is required')).toBeInTheDocument();
  });

  it('handles authentication failure', async () => {
    // Mock authentication failure
    vi.mocked(myUserContext.signMeInWithPassword).mockResolvedValueOnce('Invalid credentials');

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

    // Fill in the form with incorrect credentials
    await fireEvent.input(getByLabelText('Email or Username'), {
      target: { value: 'test@example.com' },
    });

    await fireEvent.input(getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    });

    // Submit the form
    const signInButton = getByRole('button', { name: 'Sign in' });
    await fireEvent.click(signInButton);

    // Verify error message is displayed
    expect(await findByText('Invalid credentials. Please try again.')).toBeInTheDocument();

    // Verify we didn't navigate
    expect(goto).not.toHaveBeenCalled();
  });

  it('handles token verification failure', async () => {
    const { findByText } = render(SignInForm, {
      props: {
        data: {
          form: {
            data: { ident: 'test@example.com', password: '', authType: 'token' },
            errors: {},
            constraints: {},
            id: 'signin-form',
            valid: false,
            posted: false,
          },
        },
      },
    });

    // Wait for the OTP input to be rendered
    await waitFor(async () => {
      const verificationText = await findByText((content, element) => {
        return Boolean(
          content &&
            element &&
            element.textContent &&
            element.textContent.includes('verification code sent to'),
        );
      });
      expect(verificationText).toBeInTheDocument();
    });

    // Enter verification code
    const otpInput = document.querySelector('#verification-code input');
    if (otpInput) {
      await fireEvent.input(otpInput, { target: { value: '123456' } });
    }

    // Submit the verification
    const verifyButton = await findByText('Verify');
    await fireEvent.click(verifyButton);

    // Verify error message is displayed
    expect(await findByText('Invalid verification code')).toBeInTheDocument();

    // Verify we didn't navigate
    expect(goto).not.toHaveBeenCalled();
  });
});
