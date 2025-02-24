<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Alert, AlertDescription } from '$lib/components/ui/alert';
    import { goto } from '$app/navigation';
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import { Circle } from "lucide-svelte";
    import * as InputOTP from "$lib/components/ui/input-otp";

    let identifier = ''; // for email or username
    let password = '';
    let loading = false;
    let error = '';
    let showPassword = false;
    let loginMethod = "password"; // default to password login
    let verificationCode = '';
    let showOTPInput = false;
    let resendTimer = 30;
    let canResend = false;
    let timerInterval: ReturnType<typeof setInterval>;

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

    const handleSignIn = async () => {
        loading = true;
        error = '';
        try {
            if (loginMethod === "password") {
                // TODO: Implement your password signin logic here
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                await goto('/');
            } else if (showOTPInput) {
                // Verify OTP code
                await verifyOTPCode();
            } else {
                // Handle verification code login
                await handleEmailSignIn();
            }
        } catch (err) {
            console.error('Error signing in:', err);
            error = 'Invalid credentials. Please try again.';
        } finally {
            loading = false;
        }
    };

    const handleEmailSignIn = async () => {
        loading = true;
        error = '';
        try {
            // TODO: Implement your email sign-in logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call to send email
            showOTPInput = true;
            startResendTimer();
        } catch (err) {
            console.error('Error sending sign-in email:', err);
            error = 'Failed to send verification code. Please try again.';
        } finally {
            loading = false;
        }
    };

    const verifyOTPCode = async () => {
        try {
            // TODO: Implement OTP verification logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            await goto('/');
        } catch (err) {
            console.error('Error verifying OTP:', err);
            error = 'Invalid verification code. Please try again.';
            throw err;
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        loading = true;
        try {
            await handleEmailSignIn();
            startResendTimer();
        } catch (err) {
            console.error('Error resending code:', err);
            error = 'Failed to resend verification code. Please try again.';
        } finally {
            loading = false;
        }
    };
</script>

<div class="mx-auto flex h-screen items-center justify-center relative">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 w-full">
        <img
            src="/images/background.jpeg"
            alt="Background"
            class="h-screen w-full object-cover"
        />
        <div class="absolute inset-0 bg-background/80"></div>
    </div>

    <div class="w-full max-w-md relative">
        <Card>
            <CardHeader>
                <CardTitle class="text-2xl">Log In</CardTitle>
                <CardDescription>
                    By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {#if error}
                    <Alert variant="destructive" class="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                {/if}
                <form on:submit|preventDefault={handleSignIn} class="space-y-4">
                    <div class="space-y-2">
                        <Input
                            type="text"
                            placeholder="Email or username"
                            bind:value={identifier}
                            required
                            disabled={showOTPInput}
                        />
                    </div>

                    {#if !showOTPInput}
                        <!-- Login Method Selection -->
                        <div class="space-y-2">
                            <label for="login-method" class="text-sm font-medium">How would you like to login?</label>
                            <RadioGroup.Root id="login-method" bind:value={loginMethod} class="flex gap-4">
                                <div class="flex items-center space-x-2">
                                    <RadioGroup.Item value="password" id="password">
                                        {#snippet children({ checked })} <!-- Removed checked prop -->
                                            <div class="flex items-center justify-center">
                                                {#if checked}
                                                    <Circle class="size-2.5 fill-current text-current" />
                                                {/if}
                                            </div>
                                        {/snippet}
                                    </RadioGroup.Item>
                                    <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Password
                                    </label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <RadioGroup.Item value="verification" id="verification">
                                        {#snippet children({ checked })} <!-- Removed checked prop -->
                                            <div class="flex items-center justify-center">
                                                {#if checked}
                                                    <Circle class="size-2.5 fill-current text-current" />
                                                {/if}
                                            </div>
                                        {/snippet}
                                    </RadioGroup.Item>
                                    <label for="verification" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Verification code
                                    </label>
                                </div>
                            </RadioGroup.Root>
                        </div>
                    {/if}

                    {#if loginMethod === "password" && !showOTPInput}
                        <div class="flex w-ful relative space-x-2">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                bind:value={password}
                                required
                            />
                            <Button type="button"
                            onclick={() => showPassword = !showPassword}
                            >{#if showPassword}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                            {/if}</Button>
                        </div>
                        <div class="flex items-center justify-end">
                            <Button
                                variant="link"
                                class="px-0 font-normal"
                                href="/reset-password"
                            >
                                Forgot password?
                            </Button>
                        </div>
                    {/if}

                    {#if showOTPInput}
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <label for="otp" class="text-sm font-medium">Enter verification code</label>
                                <InputOTP.Root maxlength={6} bind:value={verificationCode}>
                                    {#snippet children({ cells })}
                                        <InputOTP.Group>
                                            {#each cells as cell}
                                                <InputOTP.Slot {cell} />
                                            {/each}
                                        </InputOTP.Group>
                                    {/snippet}
                                </InputOTP.Root>
                            </div>
                            <div class="text-center text-sm text-muted-foreground">
                                Didn't receive the code?
                                {#if canResend}
                                    <Button
                                        variant="link"
                                        class="px-1 font-normal"
                                        onclick={handleResendCode}
                                        disabled={loading}
                                    >
                                        Resend code
                                    </Button>
                                {:else}
                                    <span>Resend in {formatTime(resendTimer)}</span>
                                {/if}
                            </div>
                            <div class="flex justify-between items-center">
                                <button
                                    type="button"
                                    class="text-sm text-muted-foreground hover:text-primary"
                                    on:click={() => {
                                        showOTPInput = false;
                                        verificationCode = '';
                                        clearInterval(timerInterval);
                                    }}
                                >
                                    Change email
                                </button>
                            </div>
                        </div>
                    {/if}

                    <Button type="submit" class="w-full" disabled={loading}>
                        {#if loginMethod === "password"}
                            {loading ? 'Signing in...' : 'Log In'}
                        {:else if showOTPInput}
                            {loading ? 'Verifying...' : 'Verify Code'}
                        {:else}
                            {loading ? 'Sending code...' : 'Send verification code'}
                        {/if}
                    </Button>
                    <div class="text-center text-sm">
                        <span class="text-muted-foreground">New to First Spark?</span>
                        {' '}
                        <Button
                            variant="link"
                            class="px-1 font-normal"
                            href="/signup"
                        >
                            Sign Up
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</div>
