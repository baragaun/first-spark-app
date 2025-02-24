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
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as InputOTP from '$lib/components/ui/input-otp';

	let identifier = ''; // for email or username
	let loading = false;
	let error = '';
	let emailSent = false;
	let resendTimer = 30;
	let canResend = false;
	let timerInterval: ReturnType<typeof setInterval>;
	let resetMethod = 'magic-link'; // or "recovery-code"
	let recoveryCode = '';

	const startResendTimer = () => {
		resendTimer = 30;
		canResend = false;

		clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			resendTimer -= 1;
			if (resendTimer <= 0) {
				clearInterval(timerInterval);
				canResend = true;
			}
		}, 1000);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handleResetPassword = async () => {
		loading = true;
		error = '';

		try {
			if (resetMethod === 'recovery-code') {
				// Verify recovery code
				if (!recoveryCode) {
					throw new Error('Please enter your recovery code');
				}
				// TODO: Implement recovery code verification
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
				// If successful, redirect to password reset page
				// await goto('/reset-password/new');
			} else {
				// Send magic link
				// TODO: Implement your reset password logic here
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

				// Simulate email check
				if (identifier.includes('nonexistent')) {
					throw new Error('No account found with this email address');
				}

				emailSent = true;
				startResendTimer();
			}
		} catch (err) {
			console.error('Error resetting password:', err);
			error =
				err instanceof Error ? err.message : 'Unable to process your request. Please try again.';
		} finally {
			loading = false;
		}
	};

	const handleResendEmail = async () => {
		if (!canResend) return;

		loading = true;
		try {
			// TODO: Implement resend logic here
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
			startResendTimer();
		} catch (error) {
			console.error('Error resending email:', error);
		} finally {
			loading = false;
		}
	};

	import { onDestroy } from 'svelte';
	onDestroy(() => {
		clearInterval(timerInterval);
	});
</script>

<div class="relative mx-auto flex h-screen items-center justify-center">
	<Card class="relative w-full max-w-md">
		{#if !emailSent}
			<CardHeader>
				<CardTitle class="text-2xl">Reset your password</CardTitle>
				<CardDescription>Choose how you'd like to reset your password</CardDescription>
			</CardHeader>
			<CardContent>
				{#if error}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				{/if}
				<form on:submit|preventDefault={handleResetPassword} class="space-y-4">
					<div class="space-y-2">
						<Input type="text" placeholder="Email or username" bind:value={identifier} required />
					</div>

					<div class="space-y-2">
						<label for="reset-method" class="text-sm font-medium">Reset method</label>
						<RadioGroup.Root bind:value={resetMethod} class="flex flex-col gap-2" id="reset-method">
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="magic-link" id="magic-link" />
								<label for="magic-link" class="text-sm font-medium leading-none">
									Send me a magic link
								</label>
							</div>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="recovery-code" id="recovery-code" />
								<label for="recovery-code" class="text-sm font-medium leading-none">
									I have a recovery code
								</label>
							</div>
						</RadioGroup.Root>
					</div>

					{#if resetMethod === 'recovery-code'}
						<div class="space-y-2">
							<label for="recovery-code-input" class="text-sm font-medium"
								>Enter recovery code</label
							>
							<InputOTP.Root maxlength={6} bind:value={recoveryCode}>
								{#snippet children({ cells })}
									<InputOTP.Group>
										{#each cells as cell}
											<InputOTP.Slot {cell} />
										{/each}
									</InputOTP.Group>
								{/snippet}
							</InputOTP.Root>
						</div>
					{/if}

					<div class="flex items-center justify-between">
						<Button variant="link" class="px-0 font-normal" href="/support">Need help?</Button>
					</div>
					<Button type="submit" class="w-full" disabled={loading}>
						{#if resetMethod === 'magic-link'}
							{loading ? 'Sending magic link...' : 'Send magic link'}
						{:else}
							{loading ? 'Verifying...' : 'Verify recovery code'}
						{/if}
					</Button>
				</form>
			</CardContent>
		{:else}
			<CardHeader>
				<CardTitle class="text-2xl">Check your inbox</CardTitle>
				<CardDescription>
					We've sent a password reset link to {identifier}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex flex-col items-center space-y-4">
					<!-- Email waiting illustration -->
					<div class="mb-4 h-32 w-32">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="h-full w-full text-muted-foreground"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
								d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
							/>
						</svg>
					</div>

					<Alert class="mb-4">
						<AlertDescription>
							The magic link will expire in 10 minutes. Click the link in the email to reset your
							password.
						</AlertDescription>
					</Alert>

					<div class="text-center text-sm text-muted-foreground">
						Didn't get an email?
						{#if canResend}
							<Button
								variant="link"
								class="px-1 font-normal"
								onclick={handleResendEmail}
								disabled={loading}
							>
								Resend email
							</Button>
						{:else}
							<span>Resend in {formatTime(resendTimer)}</span>
						{/if}
					</div>

					<Button variant="outline" class="mt-4 w-full" href="/signin">Back to Log In</Button>
				</div>
			</CardContent>
		{/if}
	</Card>
</div>
