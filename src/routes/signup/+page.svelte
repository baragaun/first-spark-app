<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Alert, AlertDescription } from '$lib/components/ui/alert';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import * as RadioGroup from "$lib/components/ui/radio-group";

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
    let verificationError = '';
    let resendTimer = 30; // Timer in seconds
    let canResend = false;
    let timerInterval: ReturnType<typeof setInterval>;
    let showPassword = false;
    let isPathFinder = "no"; // Initialize without $bindable

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

    const handleResendCode = async () => {
        if (!canResend) return;

        loading = true;
        try {
            // TODO: Implement resend logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            startResendTimer();
        } catch (error) {
            console.error('Error resending code:', error);
        } finally {
            loading = false;
        }
    };

    // Handle email submission
    const handleEmailSubmit = async () => {
        loading = true;
        try {
            // TODO: Implement your email verification logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            currentStep.set(STEPS.VERIFY);
        } catch (error) {
            console.error('Error sending verification code:', error);
        } finally {
            loading = false;
        }
    };

    // Handle verification code submission
    const handleVerifySubmit = async () => {
        loading = true;
        verificationError = '';
        try {
            // Check for the test verification code
            if (verificationCode === '123456') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                currentStep.set(STEPS.CREDENTIALS);
            } else {
                throw new Error('Invalid verification code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            verificationError = 'Invalid verification code. Please try again.';
        } finally {
            loading = false;
        }
    };

    // Handle final signup
    const handleSignupSubmit = async () => {
        loading = true;
        try {
            // TODO: Implement your signup logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // After successful account creation, redirect to home page
            await goto('/');
        } catch (error) {
            console.error('Error creating account:', error);
            // You might want to add an error message here
        } finally {
            loading = false;
        }
    };

    // Start the timer when the component mounts
    $: if ($currentStep === STEPS.VERIFY) {
        startResendTimer();
    }
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

        {#if $currentStep === STEPS.EMAIL}
            <Card>
                <CardHeader>
                    <CardTitle class="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form on:submit|preventDefault={handleEmailSubmit} class="space-y-4">
                        <div class="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                bind:value={email}
                                required
                            />
                        </div>
                        <div class="text-center text-sm">
                            <span class="text-muted-foreground">Already a firstSparker?</span>
                            {' '}
                            <Button
                                variant="link"
                                class="px-1 font-normal"
                                href="/signin"
                            >
                                Log In
                            </Button>
                        </div>
                        <Button type="submit" class="w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Continue'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        {:else if $currentStep === STEPS.VERIFY}
            <Card>
                <CardHeader>
                    <CardTitle class="text-2xl">Verify your email</CardTitle>
                    <CardDescription>
                        Enter the six digit code we sent to {email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {#if verificationError}
                        <Alert variant="destructive" class="mb-4">
                            <AlertDescription>{verificationError}</AlertDescription>
                        </Alert>
                    {/if}
                    <form on:submit|preventDefault={handleVerifySubmit} class="space-y-4">
                        <div class="space-y-2">
                            <Input
                                type="text"
                                placeholder="Enter verification code"
                                bind:value={verificationCode}
                                maxlength={6}
                                required
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Button type="submit" class="w-full" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify'}
                            </Button>

                            <div class="text-center text-sm text-muted-foreground">
                                Didn't get an email?
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
                                    on:click={() => currentStep.set(STEPS.EMAIL)}
                                >
                                    Change email
                                </button>
                                <Button
                                    type="button"
                                    variant="link"
                                    class="text-sm"
                                    onclick={() => currentStep.set(STEPS.CREDENTIALS)}
                                >
                                    Skip verification
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        {:else if $currentStep === STEPS.CREDENTIALS}
            <Card>
                <CardHeader>
                    <CardTitle class="text-2xl">Create your username and password</CardTitle>
                    <CardDescription>
                        First Spark is anonymous, so your username is what you'll go by here. Choose wisely—because once you get a name, you can't change it.
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
                        <div class="space-y-2 relative">
                            <div class="flex w-ful relative space-x-2">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    bind:value={password}
                                    required
                                />
                                <button
                                    type="button"
                                    class="absolute right-3 top-1/2 -translate-y-1/2"
                                    on:click={() => showPassword = !showPassword}
                                >
                                    {#if showPassword}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                    {/if}
                                </button>
                            </div>
                            <p class="text-xs text-muted-foreground">
                                Use at least 8 characters with a mix of letters, numbers & symbols
                            </p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Are you a pathFinder?</label>
                            <RadioGroup.Root bind:value={isPathFinder} class="flex gap-4">
                                <div class="flex items-center space-x-2">
                                    <RadioGroup.Item value="yes" id="yes">
                                        <RadioGroup.Item.Indicator />
                                    </RadioGroup.Item>
                                    <label for="yes" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Yes
                                    </label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <RadioGroup.Item value="no" id="no">
                                        <RadioGroup.Item.Indicator />
                                    </RadioGroup.Item>
                                    <label for="no" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        No
                                    </label>
                                </div>
                            </RadioGroup.Root>
                        </div>
                        <Button type="submit" class="w-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        {/if}
    </div>
</div>
