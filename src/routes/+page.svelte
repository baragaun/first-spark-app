<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n';
</script>

<div class="grid flex-1 place-items-center">
  <div class="flex flex-col items-center px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
      {$t('welcome')}
    </h1>

    <p class="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground">
      {$t('welcome_subtitle')}
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      <Button
        variant="default"
        size="lg"
        class="shadow-lg transition-all hover:scale-105 hover:shadow-primary/25 active:scale-100"
      >
        {$t('get_started')}
      </Button>
    </div>
  </div>
</div>
