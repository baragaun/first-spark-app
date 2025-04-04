<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import SearchBar from '$lib/components/ui/search-bar.svelte';

  const dispatch = createEventDispatcher<{
    search: string;
  }>();

  const handleSearch = (event: CustomEvent<string>) => {
    dispatch('search', event.detail);
  };
</script>

<SearchBar
  placeholder="Search chats..."
  autoSearch={true}
  debounceTime={300}
  on:search={handleSearch}
/>
