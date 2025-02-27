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
	import { Copy } from 'lucide-svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';

	// Step management
	const STEPS = {
		EMAIL: 'email',
		VERIFY: 'verify',
		CREDENTIALS: 'credentials',
		SUCCESS: 'success'
	};

	let currentStep = writable(STEPS.EMAIL);
	let email = '';
	let username = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let isAgeConfirmed = false;
	let recoveryCodes: string[] = [];
	let isRecoveryCodesGenerated = false;
	let isRecoveryCodesAcknowledged = false;
	let showCopyAlert = false;

	// Handle email submission from the EmailVerification component
	const handleEmailSubmit = (event: CustomEvent<{ email: string }>) => {
		email = event.detail.email;
	};

	// Handle verification callback
	const handleVerify = async ({ email, code }: { email: string; code: string }) => {
		// verificationCode = code;
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
		if (!isRecoveryCodesGenerated || !isRecoveryCodesAcknowledged) {
			return;
		}

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

	const validatePassword = (password: string) => {
		const minLength = password.length >= 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		return {
			isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol,
			minLength,
			hasUpperCase,
			hasLowerCase,
			hasNumber,
			hasSymbol
		};
	};

	const getPasswordError = (password: string) => {
		if (!password) return '';
		const validation = validatePassword(password);

		if (!validation.minLength) {
			return 'Password must be at least 8 characters long';
		}
		if (
			!(
				validation.hasUpperCase &&
				validation.hasLowerCase &&
				validation.hasNumber &&
				validation.hasSymbol
			)
		) {
			return 'Password must include uppercase, lowercase, number and special character';
		}
		return '';
	};

	const generateRecoveryCodes = () => {
		// Generate 8 random recovery codes
		const codes = Array.from({ length: 8 }, () => {
			return Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6)).join('-');
		});
		recoveryCodes = codes;
		isRecoveryCodesGenerated = true;
	};

	const copyRecoveryCodes = async () => {
		try {
			await navigator.clipboard.writeText(recoveryCodes.join(', '));
			showCopyAlert = true;
			setTimeout(() => {
				showCopyAlert = false;
			}, 3000); // Hide alert after 3 seconds
		} catch (err) {
			console.error('Failed to copy recovery codes:', err);
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
						onEmailSubmit={() => handleEmailSubmit}
						onVerify={handleVerify}
						onResend={() => handleResend}
						onBack={() => handleBack}
						onSkip={handleSkip}
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
					<form on:submit|preventDefault={() => currentStep.set(STEPS.SUCCESS)} class="space-y-4">
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
							{#if password}
								<div class="space-y-2 text-xs">
									<p class="text-muted-foreground">Password requirements:</p>
									<ul class="list-inside list-disc space-y-1 pl-2">
										<li
											class:text-destructive={password.length < 8}
											class:text-green-500={password.length >= 8}
										>
											At least 8 characters
										</li>
										<li
											class:text-destructive={!/[A-Z]/.test(password)}
											class:text-green-500={/[A-Z]/.test(password)}
										>
											One uppercase letter
										</li>
										<li
											class:text-destructive={!/[a-z]/.test(password)}
											class:text-green-500={/[a-z]/.test(password)}
										>
											One lowercase letter
										</li>
										<li
											class:text-destructive={!/[0-9]/.test(password)}
											class:text-green-500={/[0-9]/.test(password)}
										>
											One number
										</li>
										<li
											class:text-destructive={!/[!@#$%^&*(),.?":{}|<>]/.test(password)}
											class:text-green-500={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
										>
											One special character
										</li>
									</ul>
								</div>
							{/if}
							{#if password && getPasswordError(password)}
								<p class="text-xs text-destructive">{getPasswordError(password)}</p>
							{/if}
						</div>
						<div class="relative space-y-2">
							<PasswordInput bind:value={confirmPassword} placeholder="Confirm password" required />
							{#if password && confirmPassword && password !== confirmPassword}
								<p class="text-xs text-destructive">Passwords do not match</p>
							{/if}
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
						<Button
							type="submit"
							class="w-full"
							disabled={loading ||
								!isAgeConfirmed ||
								!password ||
								!confirmPassword ||
								password !== confirmPassword ||
								!validatePassword(password).isValid}
							onclick={() => {
								console.log({
									loading,
									isAgeConfirmed,
									password: !!password,
									confirmPassword: !!confirmPassword,
									passwordsMatch: password === confirmPassword,
									passwordValid: validatePassword(password).isValid
								});
							}}
						>
							{loading ? 'Creating account...' : 'Create Account'}
						</Button>
					</form>
				</CardContent>
			</Card>
		{:else if $currentStep === STEPS.SUCCESS}
			<Card>
				<CardHeader>
					<CardTitle class="text-2xl">Save Your Recovery Codes</CardTitle>
					<CardDescription>
						Before we finish setting up your account, save these recovery codes in a secure place.
						You'll need them if you ever lose access to your account.
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					{#if !isRecoveryCodesGenerated}
						<Button type="button" variant="outline" class="w-full" onclick={generateRecoveryCodes}>
							Generate Recovery Codes
						</Button>
					{:else}
						<div class="space-y-4">
							<!-- Recovery codes display -->
							<div class="rounded-lg border p-4">
								<div class="grid grid-cols-2 gap-2">
									{#each recoveryCodes as code}
										<code class="rounded bg-muted p-2 text-center font-mono text-sm">
											{code}
										</code>
									{/each}
								</div>
							</div>

							<!-- Copy button -->
							{#if showCopyAlert}
								<Alert variant="default" class="mb-4">
									<AlertDescription>Recovery codes copied to clipboard!</AlertDescription>
								</Alert>
							{/if}

							<Button
								type="button"
								variant="outline"
								class="w-full gap-2"
								onclick={copyRecoveryCodes}
							>
								<Copy class="h-4 w-4" />
								Copy Recovery Codes
							</Button>

							<!-- Authentication summary -->
							<div class="space-y-3 rounded-lg border p-4">
								<h3 class="font-medium">Authentication Options Enabled:</h3>
								<ul class="list-inside list-disc text-sm text-muted-foreground">
									<li>Password authentication</li>
									<li>Recovery codes</li>
								</ul>
							</div>

							<!-- Acknowledgment -->
							<div class="space-y-4">
								<div class="flex items-center space-x-2">
									<Switch.Root
										bind:checked={isRecoveryCodesAcknowledged}
										id="recovery-acknowledgment"
									/>
									<label for="recovery-acknowledgment" class="text-sm">
										I have saved these recovery codes in a secure location
									</label>
								</div>

								<p class="text-sm text-destructive">
									I understand that losing my password and recovery codes will result in permanent
									account loss
								</p>
							</div>

							<!-- Final submit button -->
							<Button
								type="button"
								class="w-full"
								disabled={!isRecoveryCodesAcknowledged}
								onclick={handleSignupSubmit}
							>
								{loading ? 'Creating Account...' : 'Complete Sign Up'}
							</Button>
						</div>
					{/if}
				</CardContent>
			</Card>
		{/if}
	</div>
</div>
