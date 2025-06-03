
<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { Search } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { Vendor } from '@baragaun/bg-node-client';
  import placeholderImage from '../../assets/images/placeholder.png';
  
  let searchQuery = '';
  
  const vendorsList = writable<Vendor[]>([]);
  
  $: filteredVendors = $vendorsList.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  onMount(async () => {
    const response = await marketplaceContext.findVendors();
    vendorsList.set(response as Vendor[]);
  });
</script>

<div class="container mx-auto px-4 py-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-primary">First Spark Marketplace</h1>
    <p class="text-muted-foreground mt-2">Discover and connect with our partner services</p>
  </header>

  <div class="flex items-center gap-4 mb-6">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Search marketplace" 
        class="pl-10"
        bind:value={searchQuery}
      />
    </div>
    <Button variant="outline">All</Button>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[calc(100vh-220px)]">
    {#each filteredVendors as vendor (vendor.id)}
      <div class="flex flex-col items-center">
        <div class="rounded-lg border bg-card shadow-sm overflow-hidden mb-2 w-full aspect-[4/3]">
          <img 
            src={vendor.imageSource} 
            alt={vendor.name} 
            class="w-full h-full object-cover"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
          />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full overflow-hidden">
            <img 
              src={vendor.logoImageSource} 
              alt="" 
              class="w-full h-full object-cover"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
          </div>
          <span class="text-sm font-medium">{vendor.name}</span>
        </div>
      </div>
    {/each}
  </div>
</div>

