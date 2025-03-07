<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Languages } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { locale } from '$lib/i18n';

  export let isMobile = false;

  type LanguageCode = 'en' | 'de' | 'hi';

  const languages: Record<LanguageCode, string> = {
    en: 'English',
    de: 'Deutsch',
    hi: 'हिन्दी',
  };

  const handleLanguageChange = (code: string) => {
    $locale = code;
  };

  const cycleLanguage = () => {
    const langs = Object.keys(languages);
    const currentIndex = langs.indexOf($locale);
    const nextIndex = (currentIndex + 1) % langs.length;
    $locale = langs[nextIndex];
  };
</script>

{#if isMobile}
  <Button
    variant="ghost"
    class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
    onclick={(e: MouseEvent) => cycleLanguage()}
  >
    <Languages class="h-5 w-5" />
  </Button>
{:else}
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
{/if}
