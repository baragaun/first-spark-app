<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Languages } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Tooltip from '@/components/ui/tooltip';
  import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
  import { m } from '$lib/paraglide/messages.js';

  const { class: className = '' } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div
            class={`relative inline-flex ${className}`}
            aria-label={m['language_button.tooltip']()}
          >
            <Button
              variant="ghost"
              size="icon"
              class="text-nav-foreground hover:bg-transparent hover:text-foreground"
            />
            <Languages
              class="pointer-events-none absolute inset-0 m-auto h-[1.3rem] w-[1.3rem] text-nav-foreground"
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{m['language_button.tooltip']()}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="bg-background">
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
