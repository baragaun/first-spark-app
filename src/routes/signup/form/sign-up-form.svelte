<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form/index';
  import * as InputOTP from '$lib/components/ui/input-otp/index.js';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import {
    formSchema,
    schemaStep1,
    schemaStep2,
    schemaStep3,
    type FormSchema,
  } from './sign-up-form-schema';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zod, zodClient } from 'sveltekit-superforms/adapters';

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
  let currentStep = $state(1);

  // const { form, errors, message, enhance, validateForm, options } = superForm(data.form, {
  // 	// No need for hidden fields with dataType: 'json'
  // 	dataType: 'json',
  //   validators: zodClient(formSchema),
  // 	async onSubmit({ cancel }) {
  // 		// If on last step, make a normal request
  // 		if (currentStep == steps.length) return;
  // 		else cancel();

  // 		// Make a manual client-side validation, since we have cancelled
  // 		const result = await validateForm({ update: true });
  // 		if (result.valid) currentStep = currentStep + 1;
  // 	},

  // 	async onUpdated({ form }) {
  // 		if (form.valid) currentStep = 1;
  // 	}
  // });

  const { form: formData, enhance } = form;
  let email = $state('');
  let username = $state('');
  let identIsAvailable = $state(true);
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');

  const validateEmail = async (email: string) => {
    const validFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (validFormat) {
      identIsAvailable =
        (await myUserContext.isUserIdentAvailable(email, UserIdentType.email)) || false;
    }
    return identIsAvailable;
  };

  // This is not necessarily complete or correct, but takes into account the updated return value from `signup`
  const onSubmitEmail = async () => {
    errorMessage = '';

    // if (!validateEmail(email)) {
    //   errorMessage = 'Please enter a valid email address.';
    //   return;
    // }

    loading = true;

    try {
      console.log('calling signup without data');

      // Actually sign up the User, then verify their email
      // const { myUser, error } = await myUserContext.signUp(email);

      // if (!myUser) {
      //   throw new Error(error || 'Failed to create account');
      // }

      // TODO: we should be going to the email verication flow
      // await goto('/');
      // currentStep = steps.VERIFY;
      currentStep = 2;
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      loading = false;
    }
  };

  const onSubmitEmailOtp = async () => {
    errorMessage = '';

    // if (!validateEmail(email)) {
    //   errorMessage = 'Please enter a valid email address.';
    //   return;
    // }

    loading = true;

    try {
      console.log('trying onSignUp');

      // TODO: currently non functional until the flow is in place

      // Actually sign up the User, then verify their email
      // const { myUser, error } = await myUserContext.signUp(email);

      // if (!myUser) {
      //   throw new Error(error || 'Failed to create account');
      // }

      // TODO: we should be going to the username and password step
      // currentStep = steps.CREDENTIALS;
      currentStep = 3;
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      loading = false;
    }
  };

  // // Handle verification callback
  // const handleVerify = async ({ email, code }: { email: string; code: string }) => {
  //   // verificationCode = code;
  //   // If verification is successful, move to credentials step
  //   currentStep.set(STEPS.CREDENTIALS);
  // };

  // // Handle resend from the EmailVerification component
  // const handleResend = (event: CustomEvent<{ email: string }>) => {
  //   // Any additional logic for resending
  //   console.log('Resending code to:', event.detail.email);
  // };

  // // Handle back button from the EmailVerification component
  // const handleBack = (event: CustomEvent) => {
  //   // Any additional logic when going back
  // };

  // // Handle skip verification
  // const handleSkip = () => {
  //   currentStep.set(STEPS.CREDENTIALS);
  // };

  // Handle final signup
  // const handleSignupSubmit = async () => {
  //   loading = true;
  //   try {
  //     // TODO: Implement your signup logic here
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  //     localStorage.setItem('authToken', 'your-auth-token');
  //     // authStore.set({ isAuthenticated: true }); // Update auth store
  //     await goto('/');
  //   } catch (error) {
  //     console.error('Error creating account:', error);
  //   } finally {
  //     loading = false;
  //   }
  // };
</script>

<form method="POST" use:enhance>
  <Card.Root class="mx-auto max-w-md">
    {#if currentStep === 1}
      <Card.Header>
        <Card.Title class="text-2xl">Sign Up</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <Form.Field {form} name="email">
            <Form.Control>
              {#snippet children({ props })}
                <Input
                  {...props}
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  bind:value={$formData.email}
                />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Card.Description>
            By continuing, you agree to our User Agreement and acknowledge that you understand the
            Privacy Policy.
          </Card.Description>
          <Form.Button
            type="button"
            class="w-full"
            onclick={onSubmitEmail}
            disabled={!$formData.email}
          >
            Continue
          </Form.Button>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <a href="/signin" class="underline"> Sign in </a>
          </div>
        </div>
      </Card.Content>
    {:else if currentStep === 2}
      <Card.Header>
        <Card.Title class="text-2xl">Sign Up</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <Form.Field {form} name="emailOtp">
            <Form.Control>
              {#snippet children({ props })}
                <InputOTP.Root
                  {...props}
                  id="emailOtp"
                  maxlength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  required
                  bind:value={$formData.emailOtp}
                >
                  {#snippet children({ cells })}
                    <InputOTP.Group>
                      {#each cells as cell (cell)}
                        <InputOTP.Slot {cell} />
                      {/each}
                    </InputOTP.Group>
                  {/snippet}
                </InputOTP.Root>
              {/snippet}
            </Form.Control>
            <Form.Description>Enter the six digit code sent to your email.</Form.Description>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Button
            type="button"
            class="w-full"
            onclick={onSubmitEmailOtp}
            disabled={!$formData.emailOtp}
          >
            Continue
          </Form.Button>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <a href="/signin" class="underline"> Sign in </a>
          </div>
        </div>
      </Card.Content>
    {/if}
  </Card.Root>

  <!-- <SuperDebug data={form} /> -->
</form>
