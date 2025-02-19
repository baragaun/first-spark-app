<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Alert, AlertDescription } from '$lib/components/ui/alert';
    import { writable } from 'svelte/store';

    let identifier = ''; // for email or username
    let loading = false;
    let error = '';
    let emailSent = false;
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

    const handleResetPassword = async () => {
        loading = true;
        error = '';
        try {
            // TODO: Implement your reset password logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            emailSent = true;
            startResendTimer();
        } catch (err) {
            console.error('Error resetting password:', err);
            error = 'Unable to process your request. Please try again.';
        } finally {
            loading = false;
        }
    };

    const handleResendEmail = async () => {
        if (!canResend) return;

        loading = true;
        try {
            // TODO: Implement resend logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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
            {#if !emailSent}
                <CardHeader>
                    <CardTitle class="text-2xl">Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email address or username and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {#if error}
                        <Alert variant="destructive" class="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    {/if}
                    <form on:submit|preventDefault={handleResetPassword} class="space-y-4">
                        <div class="space-y-2">
                            <Input
                                type="text"
                                placeholder="Email or username"
                                bind:value={identifier}
                                required
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <Button
                                variant="link"
                                class="px-0 font-normal"
                                href="/support"
                            >
                                Need help?
                            </Button>
                        </div>
                        <Button type="submit" class="w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Reset password'}
                        </Button>
                    </form>
                </CardContent>
            {:else}
                <CardHeader>
                    <CardTitle class="text-2xl">Check your inbox</CardTitle>
                    <CardDescription>
                        An email with a link to reset your password was sent to the email address associated with your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-col items-center space-y-4">
                        <!-- Email waiting illustration -->
                        <div class="w-32 h-32 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-muted-foreground">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>

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

                        <Button
                            variant="outline"
                            class="w-full mt-4"
                            href="/signin"
                        >
                            Back to Log In
                        </Button>
                    </div>
                </CardContent>
            {/if}
        </Card>
    </div>
</div>
