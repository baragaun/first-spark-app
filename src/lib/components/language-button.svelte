<script lang="ts"> 
  import { Button } from "$lib/components/ui/button/index.js";
  import { Languages } from "lucide-svelte";
  
  const { iconButton = true, class: className = "" } = $props();
</script>

<Button 
  onclick={() => {}} 
  variant="ghost" 
  size={iconButton ? "icon" : "sm"} 
  class={`${className} text-muted-foreground`}
>
  <div class={"flex items-center"}>
    <Languages />
    {#if !iconButton}
      <span class="ml-2">Change language</span>
    {/if}
  </div>
  <span class="sr-only">Change language</span>
</Button>