<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight } from 'lucide-svelte';
  import { type Snippet } from 'svelte';

  let {
    label = '',
    sublabel = '',
    title = '',
    subtitle = '',
    dialogContentClass = '',
    destructive = false,
    showContent = $bindable(false),
    onClose = undefined,
    children,
  } = $props<{
    label: string;
    sublabel?: string;
    title: string;
    subtitle?: string;
    showContent?: boolean;
    dialogContentClass?: string;
    destructive?: boolean;
    onClose?: () => void | undefined;
    children?: Snippet;
  }>();

  const hoverColor = destructive ? 'bg-destructive/10' : 'bg-secondary';
  const textColor = destructive ? 'text-destructive' : '';

  $effect(() => {
    if (onClose) {
      showContent = false;
      onClose();
    }
  });
</script>

<Dialog.Root
  open={showContent}
  onOpenChange={(open: boolean) => {
    showContent = open;
  }}
>
  <Dialog.Trigger
    class={`group flex w-full items-center justify-between rounded-lg p-4 hover:${hoverColor} ${textColor}`}
  >
    <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
      <p class="text-sm font-medium">{label}</p>
    </div>
    <div class="flex items-center gap-2">
      <p class="text-right text-sm opacity-70 group-hover:opacity-100">
        {sublabel}
      </p>
      <ChevronRight
        class="h-5 w-5 stroke-[2] opacity-70 transition-opacity group-hover:opacity-100"
      />
    </div>
  </Dialog.Trigger>
  <Dialog.Content class={`flex flex-col ${dialogContentClass}`}>
    <Dialog.Header class="space-y-2 px-2">
      <Dialog.Title class="text-xl font-semibold">{title}</Dialog.Title>
      <Dialog.Description class="text-base text-muted-foreground">
        {subtitle}
      </Dialog.Description>
    </Dialog.Header>

    <div class="flex-1 overflow-y-auto px-2 py-4">
      {@render children?.()}
    </div>
  </Dialog.Content>
</Dialog.Root>
