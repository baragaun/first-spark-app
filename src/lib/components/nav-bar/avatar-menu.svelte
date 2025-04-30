<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale, locales, setLocale } from '$lib/paraglide/runtime.js';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import {
    Check,
    ChevronDown,
    Languages,
    LogIn,
    LogOut,
    Moon,
    MoreHorizontal,
    Sun,
  } from 'lucide-svelte';
  import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

  const isSignedIn = $derived(myUserContext.isSignedIn);
  const username = $derived(myUserContext.myUserHandle);
  const email = $derived(myUserContext.myEmail);
  let themeOpen = $state(false);
  let languageOpen = $state(false);

  const themeOptions = [
    { value: 'light', label: m['theme.light'](), action: () => setMode('light') },
    { value: 'dark', label: m['theme.dark'](), action: () => setMode('dark') },
    { value: 'system', label: m['theme.system'](), action: () => resetMode() },
  ];

  const handleLogout = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    const result = await myUserContext.signMeOut();
    await goto('/signin');
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="ml-2 {!isSignedIn ? 'md:hidden' : ''}">
    <Button variant="ghost" data-testid="avatar-menu-trigger" class="relative h-8 w-8 rounded-full">
      {#if isSignedIn}
        <Avatar.Root class="h-9 w-9">
          <Avatar.Image src="" alt={`@${username}`} />
          <Avatar.Fallback>FS</Avatar.Fallback>
        </Avatar.Root>
      {:else}
        <MoreHorizontal class="h-5 w-5" />
      {/if}
    </Button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content class="mt-2 w-56" align="end">
    {#if isSignedIn}
      <DropdownMenu.Label class="font-normal">
        <div class="flex items-center">
          <Avatar.Root class="mr-2 h-9 w-9">
            <Avatar.Image src="" alt={`@${username}`} />
            <Avatar.Fallback>🙃</Avatar.Fallback>
          </Avatar.Root>
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium leading-none">{username}</p>
            <p class="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </div>
      </DropdownMenu.Label>
      <DropdownMenu.Separator />
    {/if}
    <DropdownMenu.Group>
      <Collapsible.Root bind:open={themeOpen}>
        <Collapsible.Trigger class="flex w-full items-center justify-between px-2 py-1.5 text-sm">
          <div class="flex items-center">
            <Sun
              class="mr-2 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute mr-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span>{m['theme.light_switch']()}</span>
          </div>
          <ChevronDown class="h-4 w-4 transition-transform {themeOpen ? 'rotate-180' : ''}" />
        </Collapsible.Trigger>
        <Collapsible.Content class="pl-8 pt-1">
          <div class="flex flex-col gap-1">
            {#each themeOptions as option}
              <DropdownMenu.Item
                onclick={() => {
                  option.action();
                  themeOpen = false;
                }}
                class="flex justify-between"
              >
                <span class:font-semibold={$userPrefersMode === option.value}>
                  {option.label}
                </span>
                {#if $userPrefersMode === option.value}
                  <Check class="h-4 w-4 text-green-500" />
                {/if}
              </DropdownMenu.Item>
            {/each}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <Collapsible.Root bind:open={languageOpen}>
        <Collapsible.Trigger class="flex w-full items-center justify-between px-2 py-1.5 text-sm">
          <div class="flex items-center">
            <Languages class="mr-2 h-5 w-5" />
            <span>{m['language.change']()}</span>
          </div>
          <ChevronDown class="h-4 w-4 transition-transform {languageOpen ? 'rotate-180' : ''}" />
        </Collapsible.Trigger>
        <Collapsible.Content class="pl-8 pt-1">
          <div class="flex flex-col gap-1">
            {#each locales as locale}
              <DropdownMenu.Item
                onclick={() => {
                  setLocale(locale);
                  languageOpen = false;
                }}
                class="flex justify-between"
              >
                <span class:font-semibold={getLocale() === locale}>
                  {new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
                </span>
                {#if getLocale() === locale}
                  <Check class="h-4 w-4 text-green-500" />
                {/if}
              </DropdownMenu.Item>
            {/each}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    {#if isSignedIn}
      <DropdownMenu.Item
        onclick={handleLogout}
        class="bg-destructive text-white focus:bg-destructive focus:text-white"
      >
        <LogOut class="mr-2 h-4 w-4" />
        Sign out
      </DropdownMenu.Item>
    {:else}
      <DropdownMenu.Item onclick={() => goto('/signin')}>
        <LogIn class="mr-2 h-4 w-4" />
        Sign in
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
