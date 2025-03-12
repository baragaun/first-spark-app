<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Languages } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { locale, _ } from 'svelte-i18n';
  import { DEFAULT_LANGUAGE, LANGUAGE_KEY, LANGUAGE_NAMES } from '$lib/i18n/constants';

  let currentLocale = DEFAULT_LANGUAGE;

  // Subscribe to locale changes
  $: {
    currentLocale = $locale || DEFAULT_LANGUAGE;
  }

  const handleLanguageChange = (code: keyof typeof LANGUAGE_NAMES) => {
    locale.set(code);
    localStorage.setItem(LANGUAGE_KEY, code);
  };

  const selectLanguage = () => {
    const availableLocales = Object.keys(LANGUAGE_NAMES);
    const currentIndex = availableLocales.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % availableLocales.length;
    const newLocale = availableLocales[nextIndex];
    locale.set(newLocale);
    localStorage.setItem(LANGUAGE_KEY, newLocale);
  };
</script>

<!-- Mobile -->
<div class="md:hidden">
  <Button
    variant="ghost"
    class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground md:hidden"
    onclick={() => selectLanguage()}
  >
    <Languages class="h-5 w-5" />
    <span>{$_('language.change')}</span>
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
        aria-label={$_('language.select')}
      >
        <Languages class="h-5 w-5" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Label>{$_('language.select')}</DropdownMenu.Label>
      <DropdownMenu.Separator />
      {#each Object.entries(LANGUAGE_NAMES) as [code, name]}
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
