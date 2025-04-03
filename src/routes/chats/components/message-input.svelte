<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Smile, Send } from 'lucide-svelte';
  import EmojiPicker from './emoji-picker.svelte';
  
  let { onSendMessage }: { onSendMessage: (text: string) => void } = $props();
  
  let messageText = $state('');
  let showEmojiPicker = $state(false);
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      messageText = '';
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageText.trim()) {
        onSendMessage(messageText.trim());
        messageText = '';
      }
    }
  };
  
  const toggleEmojiPicker = () => {
    showEmojiPicker = !showEmojiPicker;
  };
  
  const addEmoji = (emoji: string) => {
    messageText += emoji;
    showEmojiPicker = false;
  };
</script>

<div class="border-t p-4">
  <form onsubmit={handleSubmit} class="flex items-center gap-2">
    <div class="relative">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onclick={toggleEmojiPicker}
      >
        <Smile class="h-5 w-5" />
      </Button>
      
      {#if showEmojiPicker}
        <div class="absolute bottom-full left-0 mb-2">
          <EmojiPicker onSelectEmoji={addEmoji} />
        </div>
      {/if}
    </div>
    
    <Input
      type="text"
      placeholder="Type a message..."
      bind:value={messageText}
      onkeydown={handleKeyDown}
      class="flex-1"
    />
    
    <Button 
      type="submit" 
      variant="primary" 
      size="icon" 
      disabled={!messageText.trim()}
    >
      <Send class="h-5 w-5" />
    </Button>
  </form>
</div>