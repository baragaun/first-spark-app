<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Languages } from 'lucide-svelte';
  import { locale } from 'svelte-i18n';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  const languages: Record<string, string> = {
    en: 'English',
    de: 'Deutsch',
    hi: 'हिन्दी',
  };

  const handleLanguageChange = (code: string) => {
    $locale = code;
  };

  const cycleLanguage = () => {
    const availableLocales = Object.keys(languages);
    const currentIndex = availableLocales.indexOf($locale ?? 'en');
    const nextIndex = (currentIndex + 1) % availableLocales.length;
    $locale = availableLocales[nextIndex];
  };
</script>

<!-- Mobile -->
<div class="md:hidden">
  <Button
    variant="ghost"
    class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground md:hidden"
    onclick={() => cycleLanguage()}
  >
    <Languages class="h-5 w-5" />
    <span>Change Language</span>
  </Button>
</div>

<!-- Desktop -->
<div class="hidden md:flex">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground hover:text-foreground"
        aria-label="Select language"
      >
        <Languages class="h-5 w-5" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Label>Select Language</DropdownMenu.Label>
      <DropdownMenu.Separator />
      {#each Object.entries(languages) as [code, name]}
        <DropdownMenu.Item class="cursor-pointer" onclick={() => handleLanguageChange(code)}>
          <span class:font-bold={$locale === code}>
            {name}
          </span>
          {#if $locale === code}
            <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
          {/if}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
