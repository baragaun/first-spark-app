<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { createEventDispatcher } from 'svelte';

  // Customizable props
  let {
    placeholder = 'Search...',
    initiallyExpanded = false,
    width = 'w-full',
    iconSize = 'h-5 w-5',
    inputClass = '',
    debounceTime = 300,
    autoSearch = true,
  } = $props();

  const dispatch = createEventDispatcher<{
    search: string;
    expand: boolean;
    collapse: boolean;
  }>();

  let isExpanded = $state(initiallyExpanded);
  let searchQuery = $state('');
  let inputRef = $state<HTMLInputElement | null>(null);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Toggle search visibility
  const toggleSearch = () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      dispatch('expand', true);
      // Focus the input after expansion
      setTimeout(() => {
        inputRef?.focus();
      }, 10);
    } else {
      dispatch('collapse', false);
      // Clear search when collapsed
      if (searchQuery) {
        searchQuery = '';
        dispatch('search', '');
      }
    }
  };

  // Handle search with optional debounce
  const handleSearch = () => {
    dispatch('search', searchQuery);
  };

  // Debounced search for auto-search mode
  const debouncedSearch = () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      handleSearch();
    }, debounceTime);
  };

  // Handle input changes
  const handleInput = () => {
    if (autoSearch) {
      debouncedSearch();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (debounceTimer) clearTimeout(debounceTimer);
      handleSearch();
    } else if (e.key === 'Escape') {
      toggleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    searchQuery = '';
    dispatch('search', '');
    inputRef?.focus();
  };
</script>

<div class="flex items-center {width}">
  {#if isExpanded}
    <div class="relative flex w-full items-center">
      <Input
        bind:ref={inputRef}
        type="text"
        {placeholder}
        bind:value={searchQuery}
        onkeydown={handleKeyDown}
        oninput={handleInput}
        class="pr-16 {inputClass}"
      />
      <div class="absolute right-0 flex">
        <Button
          variant="ghost"
          class="h-8 w-8"
          onclick={searchQuery ? clearSearch : toggleSearch}
          aria-label="Close search"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>
    </div>
  {:else}
    <Button variant="ghost" onclick={toggleSearch} aria-label="Open search">
      <Search class={iconSize} />
    </Button>
  {/if}
</div>
