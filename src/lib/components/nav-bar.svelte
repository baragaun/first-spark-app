<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Moon, Sun, Languages } from 'lucide-svelte';
	import UserNav from './user-nav.svelte';

    // Theme state management
    let isDarkMode = false;
    const toggleTheme = () => {
        isDarkMode = !isDarkMode;
        document.documentElement.classList.toggle('dark');
    };
</script>

<nav class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex h-16 items-center px-4">
        <!-- Logo and App Name -->
        <a
            href="/"
            class="flex items-center gap-2 transition-colors hover:opacity-90"
        >
            <img
                src="/icon.svg"
                alt="App Logo"
                class="h-8 w-8"
            />
            <span class="font-lexend text-xl font-bold text-primary">First Spark</span>
        </a>

        <!-- Right side items -->
        <div class="ml-auto flex items-center gap-4">
            <!-- Language Switcher -->
            <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground hover:text-foreground"
            >
                <Languages class="h-5 w-5" />
            </Button>

            <!-- Theme Toggle -->
            <Button
                variant="ghost"
                size="icon"
                onclick={toggleTheme}
                class="text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
            >
                {#if isDarkMode}
                    <Sun class="h-5 w-5 transition-all" />
                {:else}
                    <Moon class="h-5 w-5 transition-all" />
                {/if}
            </Button>

            <!-- Auth Buttons -->
            <div class="hidden sm:flex sm:items-center sm:gap-2">
                <Button
                    variant="ghost"
                    href="/signin"
                    class="font-lexend text-muted-foreground hover:text-foreground"
                >
                    Log In
                </Button>
                <Button
                    variant="default"
                    href="/signup"
                    class="font-lexend shadow-sm hover:shadow-md"
                >
                    Sign Up
                </Button>
            </div>
            <!-- Mobile Menu Trigger -->
            <Button
                variant="ghost"
                size="icon"
                class="sm:hidden"
            >
                <span class="sr-only">Open Menu</span>
            </Button>
            <UserNav />
        </div>
    </div>
</nav>