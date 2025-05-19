<script lang="ts">
  let { onSelectEmoji }: { onSelectEmoji: (emoji: string) => void } = $props();

  // Common emojis
  const emojis = [
    '😊',
    '😂',
    '❤️',
    '👍',
    '🙏',
    '🔥',
    '😍',
    '🤔',
    '😭',
    '😎',
    '👋',
    '🎉',
    '✨',
    '🌟',
    '💯',
    '🤣',
    '😁',
    '😉',
    '🥰',
    '😇',
  ];
</script>

<div
  class="grid max-h-[200px] w-[250px] grid-cols-5 gap-2 overflow-y-auto rounded-lg border bg-background p-3 shadow-lg"
>
  {#each emojis as emoji}
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-md text-xl hover:bg-muted"
      onclick={() => onSelectEmoji(emoji)}
    >
      {emoji}
    </button>
  {/each}
</div>
