<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Languages } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
  import { m } from '$lib/paraglide/messages.js';

  const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    de: 'Deutsch',
    hi: 'हिन्दी',
  };

  const setLanguage = (code: keyof typeof LANGUAGE_NAMES) => {
    setLocale(code as 'en' | 'de' | 'hi');
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button
      variant="ghost"
      size="icon"
      class="text-muted-foreground hover:text-foreground"
      aria-label={m['language.select']()}
    >
      <Languages class="h-5 w-5" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>{m['language.select']()}</DropdownMenu.Label>
    <DropdownMenu.Separator />
    {#each Object.entries(LANGUAGE_NAMES) as [code, name]}
      <DropdownMenu.Item class="cursor-pointer" onclick={() => setLanguage(code)}>
        <span class:font-bold={getLocale() === code}>
          {name}
        </span>
        {#if getLocale() === code}
          <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
        {/if}
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>