<script lang="ts">
  import { X } from 'lucide-svelte';
  import { Alert, AlertTitle, AlertDescription } from './ui/alert';
  import { Button } from './ui/button';

  interface Props {
    errorMessage: string;
  }
  let { errorMessage = $bindable() }: Props = $props();
</script>

<Alert variant="destructive" class="relative mt-4">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>{errorMessage}</AlertDescription>
  <Button
    variant="ghost"
    size="icon"
    class="absolute right-2 top-2 h-6 w-6 p-0"
    onclick={() => (errorMessage = '')}
  >
    <X class="h-4 w-4" />
    <span class="sr-only">Close</span>
  </Button>
</Alert>
