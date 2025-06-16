<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Send } from 'lucide-svelte';

  let {
    onSendMessage,
    placeholder = 'Type a message...',
  }: {
    onSendMessage: (text: string) => void;
    placeholder?: string;
  } = $props();

  let messageText = $state('');
  let showEmojiPicker = $state(false);
  let inputRef = $state<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    if (messageText.trim()) {
      // Send message
      onSendMessage(messageText.trim());
      messageText = '';

      // Reset textarea height and focus
      if (inputRef) {
        inputRef.style.height = 'auto';
        inputRef.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageText.trim()) {
        onSendMessage(messageText.trim());
        messageText = '';

        // Reset textarea height and focus
        if (inputRef) {
          inputRef.style.height = 'auto';
          inputRef.focus();
        }
      }
    }
  };

  const toggleEmojiPicker = () => {
    showEmojiPicker = !showEmojiPicker;
  };

  const addEmoji = (emoji: string) => {
    messageText += emoji;
    showEmojiPicker = false;
    // Maintain focus on the input after adding emoji
    setTimeout(() => {
      inputRef?.focus();
    }, 0);
  };

  // Auto-resize textarea as content grows
  const adjustTextareaHeight = () => {
    if (inputRef) {
      inputRef.style.height = 'auto';
      inputRef.style.height = `${Math.min(inputRef.scrollHeight, 150)}px`;
    }
  };

  $effect(() => {
    if (messageText) {
      adjustTextareaHeight();
    }
  });
</script>

<div class="flex w-full items-center gap-2">
  <!-- <div class="relative">
    <Button type="button" variant="ghost" size="icon" onclick={toggleEmojiPicker}>
      <Smile class="h-5 w-5" />
    </Button>

    {#if showEmojiPicker}
      <div class="absolute bottom-full left-0 mb-2">
        <EmojiPicker onSelectEmoji={addEmoji} />
      </div>
    {/if}
  </div> -->

  <Textarea
    {placeholder}
    bind:value={messageText}
    onkeydown={handleKeyDown}
    oninput={adjustTextareaHeight}
    class="max-h-[150px] min-h-[40px] flex-1 resize-none"
    bind:ref={inputRef}
    rows={1}
  />

  <Button
    type="button"
    size="icon"
    variant="ghost"
    disabled={!messageText.trim()}
    onclick={handleSubmit}
  >
    <Send class="h-5 w-5" />
  </Button>
</div>

<style>
  /* Add smooth transition for textarea resizing */
  :global(textarea) {
    transition: height 0.1s ease-out;
  }
</style>
