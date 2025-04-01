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
  import { type MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext } from 'svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';

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
  let mfaActionId: string | undefined; // <- no need to make it a state variable

  // Handle email submission from the RegisterEmailForm component
  const onEmailSubmit = async (email: string): Promise<void> => {
    try {
      loading = true;
      errorMessage = '';

      const signUpResponse = await myUserContext.signUpUser(email);

      if (signUpResponse !== true) {
        console.error('SignUpForm.onEmailSubmit: signUpUser failed.', { signUpResponse });
        errorMessage = signUpResponse; // <-- might have to translate this
        return;
      }

      const verifyMyEmailResponse = await myUserContext.verifyMyEmail(email);

      if (
        !verifyMyEmailResponse ||
        verifyMyEmailResponse?.error ||
        !verifyMyEmailResponse.object ||
        verifyMyEmailResponse.object.error ||
        !verifyMyEmailResponse?.object.actionProgress?.actionId ||
        !verifyMyEmailResponse?.object.run
      ) {
        console.error('SignUpForm.onEmailSubmit: verifyMyEmail failed.', { signUpResponse });
        errorMessage = verifyMyEmailResponse.error || AppUiMessage.systemError; // todo: translate?
        return;
      }

      console.log('Email confirmation started:', verifyMyEmailResponse);
      mfaActionId = verifyMyEmailResponse?.object.actionProgress?.actionId;
      currentStep.set(1);

      verifyMyEmailResponse.object.run.addListener({
        id: 'SignUpForm',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            console.error(
              'SignUpPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );

            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              // We can ignore the failure to send the email in development.
              currentStep.set(1);
              return;
            }

            errorMessage =
              'We could not send the verification token to your email. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            console.log(
              'SignUpPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            currentStep.set(1);
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
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const handleEmailVerificationSubmit = async (code: string) => {
    try {
      loading = true;
      errorMessage = '';

      if (!mfaActionId) {
        console.error('SignUpForm.handleEmailVerificationSubmit: no mfaActionId.');
        errorMessage = translate(AppUiMessage.systemError);
        return;
      }

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, code);

      if (response !== true) {
        console.error(
          'SignUpForm.handleEmailVerificationSubmit: verifyMultiStepActionToken failed.',
          {
            result: response,
          },
        );
        errorMessage = response; // <-- might have to translate this
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  // Handle back button from the RegisterEmailForm component
  const handleBack = () => {
    if ($currentStep > 0) {
      currentStep.set($currentStep - 1);
    } else {
      currentStep.set(0);
    }
    errorMessage = '';
  };

  // Handle skip verification
  // (currently not supported?)
  // const handleSkip = () => {
  //   currentStep.set(2);
  // };

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
      console.error('Error creating account:', error);
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const handleResend = async () => {
    if (!mfaActionId) {
      console.error('SignUpForm.handleResend: no mfaActionId.');
      errorMessage = translate(AppUiMessage.systemError);
      return;
    }

    const response = await myUserContext.sendMultiStepActionNotification(mfaActionId, email);

    if (response !== true) {
      errorMessage = response; // <-- might have to translate this
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
