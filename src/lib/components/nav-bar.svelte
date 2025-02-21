<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Moon, Sun, Languages, Menu } from 'lucide-svelte';
    import UserNav from './user-nav.svelte';
    import * as Sheet from "$lib/components/ui/sheet";

    // Theme state management
    let isDarkMode = false;
    const toggleTheme = () => {
        isDarkMode = !isDarkMode;
        document.documentElement.classList.toggle('dark');
    };

    // Mobile menu state
    let isMobileMenuOpen = false;
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
            <!-- Theme Toggle (Always Visible) -->
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

            <!-- Desktop Navigation -->
            <div class="hidden md:flex md:items-center md:gap-4">
                <!-- Language Switcher -->
                <Button
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-foreground"
                >
                    <Languages class="h-5 w-5" />
                </Button>

                <!-- Auth Buttons -->
                <div class="flex items-center gap-2">
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
                <UserNav />
            </div>

            <!-- Mobile Menu Button -->
            <div class="flex md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onclick={() => isMobileMenuOpen = true}
                    class="text-muted-foreground hover:text-foreground"
                >
                    <Menu class="h-5 w-5" />
                    <span class="sr-only">Open Menu</span>
                </Button>
            </div>
        </div>
    </div>
</nav>

<!-- Mobile Menu Sheet -->
<Sheet.Root bind:open={isMobileMenuOpen}>
    <Sheet.Content side="right" class="w-[300px]">
        <div class="flex flex-col gap-4 p-6">
            <h2 class="font-lexend text-lg font-semibold">Menu</h2>

            <div class="flex flex-col gap-4">
                <!-- Mobile Menu Items -->
                <div class="flex flex-col gap-2">
                    <!-- Language Selection -->
                    <Button
                        variant="ghost"
                        class="w-full justify-start gap-2 font-lexend text-muted-foreground hover:text-foreground"
                    >
                        <Languages class="h-5 w-5" />
                        <span>Change Language</span>
                    </Button>

                    <!-- Auth Buttons -->
                    <Button
                        variant="ghost"
                        href="/signin"
                        class="w-full justify-start font-lexend text-muted-foreground hover:text-foreground"
                        onclick={() => isMobileMenuOpen = false}
                    >
                        Log In
                    </Button>
                    <Button
                        variant="default"
                        href="/signup"
                        class="w-full justify-start font-lexend shadow-sm hover:shadow-md"
                        onclick={() => isMobileMenuOpen = false}
                    >
                        Sign Up
                    </Button>
                </div>

                <!-- Mobile User Navigation -->
                <div class="pt-4">
                    <UserNav />
                </div>
            </div>
        </div>
    </Sheet.Content>
</Sheet.Root>
