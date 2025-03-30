<script lang="ts">
  import { MultiStepActionEventType, SidMultiStepActionProgress } from '@baragaun/bg-node-client';
  import {
    formSchema,
    schemaStep1,
    schemaStep2,
    schemaStep3,
    type FormSchema,
  } from './sign-up-form-schema';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zod, zodClient } from 'sveltekit-superforms/adapters';
  import { writable } from 'svelte/store';
  import RegisterEmailForm from '../components/register-email-form.svelte';
  import TokenForm from '@/components/token-form.svelte';
  import CredentialForm from '../components/credential-form.svelte';
  import { goto } from '$app/navigation';
  import ErrorAlert from '@/components/error-alert.svelte';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext } from 'svelte';

  const myUserContext = getContext<MyUserContext>('myUserContext');
  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    // onUpdated: ({ form: f }) => {
    //   if (f.valid) {
    //     toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
    //   } else {
    //     toast.error("Please fix the errors in the form.");
    //   }
    // }
  });

  const steps = {
    EMAIL: zod(schemaStep1),
    VERIFY: zod(schemaStep2),
    CREDENTIALS: zod(schemaStep3),
    SUCCESS: 'success',
  };

  // const steps = [
  //   zod(schemaStep1),
  //   zod(schemaStep2),
  //   zod(schemaStep3),
  //   'success',
  // ];

  // let currentStep = $state(steps[0]);
  // let currentStep = $state(steps.EMAIL);

  const { form: formData, enhance } = form;
  let currentStep = writable(0);
  let email = $state('');
  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let actionId = $state('');
  let emailSent = $state(false);

  // Handle email submission from the RegisterEmailForm component
  const onEmailSubmit = async (email: string): Promise<void> => {
    loading = true;
    errorMessage = '';
    try {
      const response = await myUserContext.signUpUser(email);

      if (response.error || !response.myUser?.id) {
        errorMessage = response.error || 'Failed to sign up';
        return;
      }

      // todo: Verify that the sign up was successful

      currentStep.set(1);

      startEmailConfirmation(email).catch((error) => {
        console.error('Error starting email confirmation:', error);
        error = 'Failed to send verification email. Please try again.';
      });
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      console.error('Error signing up:', err);
    } finally {
      loading = false;
    }
  };

  const startEmailConfirmation = async (email: string) => {
    loading = true;
    errorMessage = '';
    try {
      console.log('Email submitted:', email);

      const response = await myUserContext.verifyMyEmail(email);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        errorMessage = 'Failed to send the verification token. Please try again.';
        return;
      }
      console.log('Email confirmation started:', response);
      actionId = response?.object.actionProgress?.actionId;
      currentStep.set(1);

      response.object.run.addListener({
        id: 'SignUpForm',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            console.error(
              'SignUpPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );
            errorMessage =
              'We could not send the verification token to your email. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              'SignUpPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            emailSent = true;
            // todo: Show the verification code input to the user.
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'SignUpPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'SignUpPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            errorMessage = 'The verification token has expired. Please request a new one.';
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error('SignUpPage.multiStepActionListener: error.', action.notificationResult);
            errorMessage = 'A system error has occurred. Please try again later.';
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log('SignUpPage.multiStepActionListener: success.', action.notificationResult);
            currentStep.set(2);
          }
        },
      });
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      console.error('Error signing up:', err);
    } finally {
      loading = false;
    }
  };

  // Handle verification callback
  const handleEmailVerificationSubmit = async (code: string) => {
    loading = true;
    errorMessage = '';
    try {
      const result = await myUserContext.verifyMultiStepActionToken(actionId, code);

      if (!result) {
        errorMessage = 'Verification failed';
        return;
      }

      console.log('Verification successful, moving to credentials step');
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Failed to verify code';
      console.error('Error verifying code:', err);
    } finally {
      loading = false;
    }
  };

  // Handle back button from the RegisterEmailForm component
  const handleBack = () => {
    if ($currentStep > 0) {
      currentStep.set($currentStep - 1);
    }
  };

  // Handle skip verification
  const handleSkip = () => {
    currentStep.set(2);
  };

  // Handle final signup
  const handleSignupSubmit = async (
    credentials?: { username: string; password: string },
    e?: SubmitEvent,
  ) => {
    if (e) e.preventDefault();
    loading = true;
    errorMessage = '';
    try {
      const { error } = await myUserContext.updateMyUser({
        userHandle: credentials?.username || username,
        newPassword: credentials?.password || password,
      });

      if (error) {
        errorMessage = error;
        return;
      }

      await goto('/');
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      console.error('Error creating account:', error);
    } finally {
      loading = false;
    }
  };

  const handleResend = async () => {
    const response = await myUserContext.sendMultiStepActionNotification(actionId, email);

    if (!response || response.error) {
      errorMessage = 'We failed to send the verification token. Please try again.';
      return;
    }
  };
</script>

<form method="POST" use:enhance>
  <div class="mx-auto max-w-sm">
    {#if $currentStep === 0}
      <RegisterEmailForm bind:email={$formData.email} {onEmailSubmit} />
    {:else if $currentStep === 1}
      <TokenForm
        ident={$formData.email}
        onSubmit={handleEmailVerificationSubmit}
        onResend={handleResend}
        onBack={handleBack}
      />
    {:else if $currentStep === 2}
      <CredentialForm email={$formData.email} onSubmit={handleSignupSubmit} onBack={handleBack} />
    {/if}
    <!-- Alert for errors -->
    {#if errorMessage}
      <ErrorAlert bind:errorMessage />
    {/if}
  </div>

  <!-- <SuperDebug data={form} /> -->
</form>
