<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Tooltip from '@/components/ui/tooltip';
  import { m } from '$lib/paraglide/messages.js';
  import { Check, Moon, Sun } from 'lucide-svelte';
  import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
  const { class: className = '', iconButton = true } = $props();

  const themeOptions = [
    { value: 'light', label: m['light_switch.light'](), action: () => setMode('light') },
    { value: 'dark', label: m['light_switch.dark'](), action: () => setMode('dark') },
    { value: 'system', label: m['light_switch.system'](), action: () => resetMode() },
  ];
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button
            variant="ghost"
            size={iconButton ? 'icon' : 'sm'}
            class={`${className} text-nav-foreground hover:bg-transparent hover:text-foreground`}
            aria-label={m['light_switch.tooltip']()}
          >
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            {#if !iconButton}
              <span class="ml-2">{m['light_switch.tooltip']()}</span>
            {/if}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{m['light_switch.tooltip']()}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="bg-nav-foreground">
    {#each themeOptions as option}
      <DropdownMenu.Item onclick={option.action} class="flex justify-between">
        {option.label}
        {#if $userPrefersMode === option.value}
          <DropdownMenu.Shortcut><Check class="h-4 w-4" /></DropdownMenu.Shortcut>
        {/if}
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
