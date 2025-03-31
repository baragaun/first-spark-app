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
  import { userContextEvents, type MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext, onDestroy, onMount } from 'svelte';

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
  let unsubscribe: () => void;

  onMount(() => {
    // Subscribe to events from the context
    unsubscribe = userContextEvents.subscribe((event) => {
      if (!event) return;

      if (event.type === 'verification-success') {
        currentStep.set(2);
      } else if (event.type.startsWith('error:')) {
        errorMessage = event.message || 'An error occurred';
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  // Handle email submission from the RegisterEmailForm component
  const onEmailSubmit = async (email: string): Promise<void> => {
    loading = true;
    errorMessage = '';
    try {
      const response = await myUserContext.signUpUser(email);

      if (response === true) {
        currentStep.set(1);

        startEmailConfirmation(email).catch((error) => {
          console.error('Error starting email confirmation:', error);
          error = 'Failed to send verification email. Please try again.';
        });

        return;
      }

      errorMessage = response || 'Failed to sign up';
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

      if (!response) {
        errorMessage = 'Failed to send the verification token. Please try again.';
        return;
      }
      console.log('Email confirmation started:', response);
      currentStep.set(1);
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
      const result = await myUserContext.verifyMultiStepActionToken(code);

      if (result !== true) {
        errorMessage = result;
        return;
      }
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
    const response = await myUserContext.sendMultiStepActionNotification(email);

    if (response !== true) {
      errorMessage = response || 'We failed to send the verification token. Please try again.';
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
