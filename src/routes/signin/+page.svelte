<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Alert, AlertDescription } from '$lib/components/ui/alert';
    import { goto } from '$app/navigation';

    let identifier = ''; // for email or username
    let password = '';
    let loading = false;
    let error = '';
    let showPassword = false;

    const handleSignIn = async () => {
        loading = true;
        error = '';
        try {
            // TODO: Implement your signin logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // After successful login, redirect to home page
            await goto('/');
        } catch (err) {
            console.error('Error signing in:', err);
            error = 'Invalid credentials. Please try again.';
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
                        />
                    </div>
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
                    <Button type="submit" class="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Log In'}
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
