<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Languages } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
  import { m } from '$lib/paraglide/messages.js';

  const { class: className = '' } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button
      variant="ghost"
      size="icon"
      class={`${className} text-muted-foreground hover:text-foreground`}
      aria-label={m['language.select']()}
      title={m['language.select']()}
    >
      <Languages class="h-5 w-5" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    {#each locales as locale}
      <DropdownMenu.Item class="cursor-pointer" onclick={() => setLocale(locale)}>
        <span class:font-bold={getLocale() === locale}>
          {new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
        </span>
        {#if getLocale() === locale}
          <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
        {/if}
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
