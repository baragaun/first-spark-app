<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import * as Switch from '$lib/components/ui/switch';
	import { authStore } from '$lib/components/nav-bar.svelte';
	import { PasswordInput } from '$lib/components/ui/password-input';
	import EmailVerification from '$lib/components/email-verification.svelte';

	// Step management
	const STEPS = {
		EMAIL: 'email',
		VERIFY: 'verify',
		CREDENTIALS: 'credentials'
	};

	let currentStep = writable(STEPS.EMAIL);
	let email = '';
	let verificationCode = '';
	let username = '';
	let password = '';
	let loading = false;
	let isAgeConfirmed = false;

	// Handle email submission from the EmailVerification component
	const handleEmailSubmit = (event: CustomEvent<{ email: string }>) => {
		email = event.detail.email;
	};

	// Handle verification from the EmailVerification component
	const handleVerify = (event: CustomEvent<{ code: string }>) => {
		verificationCode = event.detail.code;
		// If verification is successful, move to credentials step
		currentStep.set(STEPS.CREDENTIALS);
	};

	// Handle resend from the EmailVerification component
	const handleResend = (event: CustomEvent<{ email: string }>) => {
		// Any additional logic for resending
		console.log('Resending code to:', event.detail.email);
	};

	// Handle back button from the EmailVerification component
	const handleBack = (event: CustomEvent) => {
		// Any additional logic when going back
	};

	// Handle skip verification
	const handleSkip = () => {
		currentStep.set(STEPS.CREDENTIALS);
	};

	// Handle final signup
	const handleSignupSubmit = async () => {
		loading = true;
		try {
			// TODO: Implement your signup logic here
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
			localStorage.setItem('authToken', 'your-auth-token');
			authStore.set({ isAuthenticated: true }); // Update auth store
			await goto('/');
		} catch (error) {
			console.error('Error creating account:', error);
		} finally {
			loading = false;
		}
	};
</script>

<div class="relative mx-auto flex h-screen items-center justify-center">
	<div class="relative w-full max-w-md px-4">
		{#if $currentStep !== STEPS.EMAIL}
			<Button
				variant="ghost"
				size="sm"
				class="absolute -top-12 left-0"
				onclick={() => currentStep.set($currentStep === STEPS.VERIFY ? STEPS.EMAIL : STEPS.VERIFY)}
			>
				← Back
			</Button>
		{/if}

		{#if $currentStep === STEPS.EMAIL || $currentStep === STEPS.VERIFY}
			<Card>
				<CardHeader>
					<CardTitle class="text-2xl">
						{$currentStep === STEPS.EMAIL ? 'Sign Up' : 'Verify your email'}
					</CardTitle>
					<CardDescription>
						{#if $currentStep === STEPS.EMAIL}
							By continuing, you agree to our User Agreement and acknowledge that you understand the
							Privacy Policy.
						{:else if $currentStep === STEPS.VERIFY}
							Enter the six digit code we sent to {email}
						{/if}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<EmailVerification
						bind:email
						initialStep={$currentStep === STEPS.EMAIL ? 'email' : 'verify'}
						buttonText="Continue"
						verifyButtonText="Verify"
						loadingText="Sending..."
						verifyingText="Verifying..."
						showSkipButton={true}
						on:emailSubmit={handleEmailSubmit}
						on:verify={handleVerify}
						on:resend={handleResend}
						on:back={handleBack}
						on:skip={handleSkip}
					/>

					{#if $currentStep === STEPS.EMAIL}
						<div class="mt-4 text-center text-sm">
							<span class="text-muted-foreground">Already a firstSparker?</span>
							{' '}
							<Button variant="link" class="px-1 font-normal" href="/signin">Log In</Button>
						</div>
					{/if}
				</CardContent>
			</Card>
		{:else if $currentStep === STEPS.CREDENTIALS}
			<Card>
				<CardHeader>
					<CardTitle class="text-2xl">Create your username and password</CardTitle>
					<CardDescription>
						First Spark is anonymous, so your username is what you'll go by here. Choose
						wisely—because once you get a name, you can't change it.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form on:submit|preventDefault={handleSignupSubmit} class="space-y-4">
						<div class="space-y-2">
							<Input
								type="text"
								placeholder="Username (e.g., CosmoExplorer, PixelPioneer)"
								bind:value={username}
								required
							/>
							<p class="text-xs text-muted-foreground">
								Suggestions: {email.split('@')[0]}Spark, Creative{Math.floor(Math.random() * 1000)},
								Spark{Math.floor(Math.random() * 10000)}
							</p>
						</div>
						<div class="relative space-y-2">
							<PasswordInput bind:value={password} placeholder="Password" required />
							<p class="text-xs text-muted-foreground">
								Use at least 8 characters with a mix of letters, numbers & symbols
							</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between space-x-2">
								<label for="age-confirmation" class="text-sm font-medium">
									I confirm that I am at least 18 years of age.
								</label>
								<Switch.Root bind:checked={isAgeConfirmed} id="age-confirmation" />
							</div>
							{#if !isAgeConfirmed}
								<p class="text-xs text-destructive">
									You must confirm you are at least 18 years old to continue.
								</p>
							{/if}
						</div>
						<Button type="submit" class="w-full" disabled={loading || !isAgeConfirmed}>
							{loading ? 'Creating account...' : 'Create Account'}
						</Button>
					</form>
				</CardContent>
			</Card>
		{/if}
	</div>
</div>
