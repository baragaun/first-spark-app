<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  interface Contact {
    id: string;
    name: string;
    avatar: string;
  }

  let { contact }: { contact: Contact } = $props();

  const handleBack = () => {
    goto('/chats');
  };
</script>

<div class="flex items-center justify-between border-b p-4">
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="icon" onclick={handleBack} class="md:hidden">
      <ArrowLeft class="h-5 w-5" />
    </Button>

    <Avatar.Root class="h-10 w-10">
      <Avatar.Fallback>{contact.name.charAt(0)}</Avatar.Fallback>
    </Avatar.Root>

    <div>
      <h2 class="font-medium">{contact.name}</h2>
      <p class="text-xs text-muted-foreground">Online</p>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <!-- <Button variant="ghost" size="icon">
      <Phone class="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon">
      <Video class="h-5 w-5" />
    </Button> -->
    <Button variant="ghost" size="icon">
      <MoreVertical class="h-5 w-5" />
    </Button>
  </div>
</div>