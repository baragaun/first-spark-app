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
                    <div class="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            bind:value={password}
                            required
                        />
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
