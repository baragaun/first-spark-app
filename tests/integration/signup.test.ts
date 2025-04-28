import { goto } from '$app/navigation';
import { myUserContext } from '@/contexts/my-user-context.svelte';
import { MultiStepActionResult, MultiStepActionType } from '@baragaun/bg-node-client';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import SignUpForm from '../../src/routes/signup/sign-up-form.svelte';
import { mockBrowserAPIs } from '../utils/test-setup';

beforeAll(() => {
  mockBrowserAPIs();
});

describe('SignUpForm Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup default mock implementations
    myUserContext.signUpUser = vi.fn().mockResolvedValue(true);
    myUserContext.verifyMyEmail = vi.fn().mockResolvedValue({
      object: {
        actionProgress: {
          actionId: 'test-action-id',
          userId: '',
          actionType: MultiStepActionType.verifyEmail,
          result: MultiStepActionResult.unset,
          attemptCount: 0,
          id: '',
          createdAt: '',
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
        id: '',
        createdAt: '',
      },
    });
    myUserContext.verifyMultiStepActionToken = vi.fn().mockResolvedValue(true);
    myUserContext.updateMyUser = vi.fn().mockResolvedValue({ success: true });
    myUserContext.isUserIdentAvailable = vi.fn().mockResolvedValue({ isAvailable: true });
    myUserContext.findAvailableUserHandle = vi.fn().mockResolvedValue('testuser123');

    vi.mocked(goto).mockResolvedValue(undefined);
  });

  // it('renders the sign-up form with all UI elements', () => {
  //   const { getByText, getByLabelText, getByRole } = render(SignUpForm, {
  //     props: {
  //       data: {
  //         form: {
  //           data: {
  //             email: '',
  //             token: '',
  //             username: '',
  //             password: ''
  //           },
  //           errors: {},
  //           constraints: {},
  //           id: 'signup-form',
  //           valid: false,
  //           posted: false
  //         },
  //       }
  //     }
  //   });

  //   // Check for form elements
  //   expect(getByRole('heading', { name: 'Sign up' })).toBeInTheDocument();
  //   expect(getByLabelText('Email address')).toBeInTheDocument();
  //   expect(getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  //   expect(getByText('Do you already have an account?')).toBeInTheDocument();
  //   expect(getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  // });

  it('submits email and proceeds to verification step', async () => {
    // Create variables to track component state
    let componentStep = 1;
    let componentIsLoading = false;

    // Mock the MsaListenerHandler to capture callbacks and update state
    vi.mock('@/lib/contexts/msa-listener-handler.svelte', () => ({
      MsaListenerHandler: class MockMsaListenerHandler {
        constructor(
          listenerId: string,
          response: any,
          onNotificationSent: () => void,
          onFailure?: () => void,
          onSuccess?: () => void
        ) {
          // Store original callbacks
          this.onNotificationSent = () => {
            componentStep = 2;
            componentIsLoading = false;
            onNotificationSent();
          };

          this.onFailure = () => {
            console.error('onFailure');
            componentIsLoading = false;
            if (onFailure) onFailure();
          };

          this.onSuccess = () => {
            componentStep = 3;
            componentIsLoading = false;
            if (onSuccess) onSuccess();
          };
        }

        onNotificationSent: () => void;
        onFailure: () => void;
        onSuccess: () => void;

        removeListener() {}
        getErrorMessage() { return ''; }
        getTokenStatus() { return 0; }
        isListening() { return true; }
      }
    }));

    const { getByLabelText, getByRole, findByText } = render(SignUpForm, {
      props: {
        data: {
          form: {
            data: {
              email: '',
              token: '',
              username: '',
              password: ''
            },
            errors: {},
            constraints: {},
            id: 'signup-form',
            valid: false,
            posted: false
          },
        }
      }
    });

    // Fill in the email
    await fireEvent.input(getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    });

    // Submit the form
    const signUpButton = getByRole('button', { name: 'Sign Up' });
    await fireEvent.click(signUpButton);

    // Verify the signup method was called with correct parameters
    await waitFor(() => {
      expect(myUserContext.signUpUser).toHaveBeenCalledWith('test@example.com');
      expect(myUserContext.verifyMyEmail).toHaveBeenCalled();
    });

    // Import the class from the mock
    const { MsaListenerHandler } = vi.mocked(await import('@/contexts/msa-listener-handler.svelte'));
    const msaHandlerInstances = vi.mocked(MsaListenerHandler, { partial: true }).mock.instances;
    if (msaHandlerInstances.length > 0) {
      const handler = msaHandlerInstances[0];
      // Trigger the notification sent callback
      // handler.onNotificationSent();
    }

    // Verify UI switched to verification step
    await waitFor(async () => {
      expect(componentStep).toBe(2);
      const verificationText = await findByText(/verification code sent to/i);
      expect(verificationText).toBeInTheDocument();

      // Look for the verify button by text content
      const verifyButton = await findByText('Verify');
      expect(verifyButton).toBeInTheDocument();
    });
  });

  // it('verifies code and proceeds to user details step', async () => {
  //   const { getByText, findByText } = render(SignUpForm, {
  //     props: {
  //       data: {
  //         form: {
  //           data: {
  //             email: 'test@example.com', token: '',
  //             username: '',
  //             password: ''
  //           },
  //           errors: {},
  //           constraints: {},
  //           id: 'signup-form',
  //           valid: false,
  //           posted: false
  //         },
  //       }
  //     }
  //   });

  //   // Enter verification code
  //   const otpInput = document.querySelector('#verification-code input');
  //   if (otpInput) {
  //     await fireEvent.input(otpInput, { target: { value: '666666' } });
  //   }

  //   // Submit the verification
  //   const verifyButton = getByText('Verify');
  //   await fireEvent.click(verifyButton);

  //   // Verify token verification was called
  //   await waitFor(() => {
  //     expect(myUserContext.verifyMultiStepActionToken).toHaveBeenCalledWith(
  //       'test-action-id',
  //       '666666'
  //     );
  //   });

  //   // Verify UI switched to user details step
  //   await waitFor(async () => {
  //     const usernameLabel = await findByText('Username');
  //     expect(usernameLabel).toBeInTheDocument();
  //     const passwordLabel = await findByText('Password');
  //     expect(passwordLabel).toBeInTheDocument();
  //   });
  // });

  // it('completes registration with username and password', async () => {
  //   const { getByLabelText, getByRole } = render(SignUpForm, {
  //     props: {
  //       data: {
  //         form: {
  //           data: {
  //             email: 'test@example.com',
  //             username: '',
  //             password: '',
  //             token: ''
  //           },
  //           errors: {},
  //           constraints: {},
  //           id: 'signup-form',
  //           valid: false,
  //           posted: false
  //         },
  //       }
  //     }
  //   });

  //   // Fill in username and password
  //   await fireEvent.input(getByLabelText('Username'), {
  //     target: { value: 'testuser123' }
  //   });

  //   await fireEvent.input(getByLabelText('Password'), {
  //     target: { value: 'SecurePassword123' }
  //   });

  //   // Submit the form
  //   const completeButton = getByRole('button', { name: 'Complete Registration' });
  //   await fireEvent.click(completeButton);

  //   // Verify user update was called
  //   await waitFor(() => {
  //     expect(myUserContext.updateMyUser).toHaveBeenCalledWith({
  //       username: 'testuser123',
  //       password: 'SecurePassword123'
  //     });
  //   });

  //   // Verify navigation after successful registration
  //   expect(goto).toHaveBeenCalledWith('/');
  // });

  // it('shows validation errors for invalid email', async () => {
  //   const { getByLabelText, getByRole, findByText } = render(SignUpForm, {
  //     props: {
  //       data: {
  //         form: {
  //           data: {
  //             email: '',
  //             token: '',
  //             username: '',
  //             password: ''
  //           },
  //           errors: {},
  //           constraints: {},
  //           id: 'signup-form',
  //           valid: false,
  //           posted: false
  //         },
  //       }
  //     }
  //   });

  //   // Fill in invalid email
  //   await fireEvent.input(getByLabelText('Email address'), {
  //     target: { value: 'invalid-email' }
  //   });

  //   // Submit the form
  //   const signUpButton = getByRole('button', { name: 'Sign Up' });
  //   await fireEvent.click(signUpButton);

  //   // Check for validation errors
  //   expect(await findByText('Please enter a valid email address')).toBeInTheDocument();
  // });

  // it('checks email availability during input', async () => {
  //   // Mock email availability check
  //   myUserContext.isUserIdentAvailable = vi.fn().mockImplementation(async (email) => {
  //     if (email === 'taken@example.com') {
  //       return { isAvailable: false };
  //     }
  //     return { isAvailable: true };
  //   });

  //   const { getByLabelText, findByText } = render(SignUpForm, {
  //     props: {
  //       data: {
  //         form: {
  //           data: {
  //             email: '',
  //             token: '',
  //             username: '',
  //             password: ''
  //           },
  //           errors: {},
  //           constraints: {},
  //           id: 'signup-form',
  //           valid: false,
  //           posted: false
  //         },
  //       }
  //     }
  //   });

  //   // Fill in email that's already taken
  //   await fireEvent.input(getByLabelText('Email address'), {
  //     target: { value: 'taken@example.com' }
  //   });

  //   // Wait for debounce
  //   await waitFor(() => {
  //     expect(myUserContext.isUserIdentAvailable).toHaveBeenCalledWith('taken@example.com');
  //   });

  //   // Check for availability error
  //   expect(await findByText('This email is currently unavailable for use')).toBeInTheDocument();
  // });

  // it('checks username availability during input', async () => {
  //   // Mock username availability check
  //   myUserContext.isUserIdentAvailable = vi.fn().mockImplementation(async (username) => {
  //     if (username === 'takenuserhandle') {
  //       return { isAvailable: false };
  //     }
  //     return { isAvailable: true };
  //   });

  //   const { getByLabelText, findByText } = render(SignUpForm, {
  //     props: {
  //       data: {
  //         form: {
  //           data: {
  //             email: 'test@example.com',
  //             username: '',
  //             password: 'SecurePassword123',
  //             token: ''
  //           },
  //           errors: {},
  //           constraints: {},
  //           id: 'signup-form',
  //           valid: false,
  //           posted: false
  //         },
  //       }
  //     }
  //   });

  //   // Fill in username that's already taken
  //   await fireEvent.input(getByLabelText('Username'), {
  //     target: { value: 'takenuserhandle' }
  //   });

  //   // Wait for debounce
  //   await waitFor(() => {
  //     expect(myUserContext.isUserIdentAvailable).toHaveBeenCalledWith('takenuserhandle');
  //   });

  //   // Check for availability error
  //   expect(await findByText('This username is currently unavailable for use')).toBeInTheDocument();
  // });
});
