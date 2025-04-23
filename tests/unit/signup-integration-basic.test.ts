import { myUserContext } from '@/contexts/my-user-context.svelte';
import { MultiStepActionResult, MultiStepActionType } from '@baragaun/bg-node-client';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { SuperValidated } from 'sveltekit-superforms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SignUpFormSchema } from '../../src/routes/signup/schema';
import SignUpForm from '../../src/routes/signup/sign-up-form.svelte';

// Mock only the API context
vi.mock('@/contexts/my-user-context.svelte', () => ({
  myUserContext: {
    isUserIdentAvailable: vi.fn(),
    signUpUser: vi.fn(),
    verifyMyEmail: vi.fn(),
    verifyMultiStepActionToken: vi.fn(),
    updateMyUser: vi.fn(),
  },
}));

describe('SignUp Form Validation Tests', () => {
  let mockFormData: { form: SuperValidated<SignUpFormSchema> };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset form data before each test
    mockFormData = {
      form: {
        data: {
          email: '',
          token: '',
          username: '',
          password: '',
        },
        errors: {},
        constraints: {},
        id: `test-form-${Math.random().toString(36).slice(2)}`,
        valid: true,
        posted: false,
      } as SuperValidated<SignUpFormSchema>,
    };
  });

  describe('Step 1: Email Validation', () => {
    it('should validate email format', async () => {
      render(SignUpForm, { props: { data: mockFormData } });

      const emailInput = screen.getByPlaceholderText(
        /e.g. 'student@example.com'/i,
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      // Test invalid email
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
      });

      // Test valid email
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'test@example.com');

      vi.mocked(myUserContext.isUserIdentAvailable).mockResolvedValueOnce({
        isAvailable: true,
      });

      vi.mocked(myUserContext.signUpUser).mockResolvedValueOnce(true);
      vi.mocked(myUserContext.verifyMyEmail).mockResolvedValueOnce({
        object: {
          actionProgress: {
            actionId: 'test-id',
            userId: '',
            actionType: MultiStepActionType.resetPassword,
            result: MultiStepActionResult.confirmTokenMismatch,
            attemptCount: 0,
            id: '',
            createdAt: '',
          },
          run: {
            actionId: 'test-id',
            listeners: new Map(),
            pollingOptions: { enabled: true, interval: 1000, timeout: 10000 },
            addListener: vi.fn(),
            removeListener: vi.fn(),
            onEventReceived: vi.fn(),
            notifyListeners: vi.fn(),
            abort: vi.fn(),
            isStopped: vi.fn().mockReturnValue(false),
          },
          id: '',
          createdAt: '',
        },
      });

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(myUserContext.signUpUser).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should validate email availability', async () => {
      render(SignUpForm, { props: { data: mockFormData } });

      const emailInput = screen.getByPlaceholderText(
        /e.g. 'student@example.com'/i,
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      // Test unavailable email
      vi.mocked(myUserContext.isUserIdentAvailable).mockResolvedValueOnce({
        isAvailable: false,
      });

      await userEvent.type(emailInput, 'taken@example.com');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('This email is currently unavailable for use.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Step 2: OTP Validation', () => {
    it('should validate OTP length', async () => {
      // Setup form in OTP step
      mockFormData.form.data.email = 'test@example.com';
      render(SignUpForm, { props: { data: mockFormData } });

      const otpInput = screen.getByTestId('token-input');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test invalid OTP
      await userEvent.type(otpInput, '12345'); // Too short
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Your one-time password must be at least 6 characters.'),
        ).toBeInTheDocument();
      });

      // Test valid OTP
      await userEvent.clear(otpInput);
      await userEvent.type(otpInput, '123456');

      vi.mocked(myUserContext.verifyMultiStepActionToken).mockResolvedValueOnce(true);

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(myUserContext.verifyMultiStepActionToken).toHaveBeenCalledWith('test-id', '123456');
      });
    });
  });

  describe('Step 3: Username and Password Validation', () => {
    it('should validate username and password requirements', async () => {
      // Setup form in final step
      mockFormData.form.data.email = 'test@example.com';
      mockFormData.form.data.token = '123456';
      render(SignUpForm, { props: { data: mockFormData } });

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      // Test invalid username
      await userEvent.type(usernameInput, 'ab'); // Too short
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('A username must be at least 3 characters.')).toBeInTheDocument();
      });

      // Test invalid password
      await userEvent.clear(usernameInput);
      await userEvent.type(usernameInput, 'validuser');
      await userEvent.type(passwordInput, 'short'); // Too short
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Your password must be at least 8 characters.'),
        ).toBeInTheDocument();
      });

      // Test valid credentials
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, 'validpassword123');

      vi.mocked(myUserContext.updateMyUser).mockResolvedValueOnce({ error: undefined });

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(myUserContext.updateMyUser).toHaveBeenCalledWith({
          userHandle: 'validuser',
          newPassword: 'validpassword123',
        });
      });
    });
  });
});
