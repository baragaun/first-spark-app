<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { _ } from 'svelte-i18n';
  const currentYear = new Date().getFullYear();
</script>

<footer class="border-t bg-background">
  <div class="container mx-auto px-4 py-4">
    <div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
      <!-- Copyright -->
      <div class="flex flex-col items-center lg:items-start">
        <p class="text-center text-sm text-muted-foreground lg:text-left">
          {@html $_('footer.copyright', { values: { year: currentYear } })}
        </p>
      </div>

      <!-- Navigation Links -->
      <nav
        class="flex flex-wrap items-center justify-center gap-4 text-sm"
        aria-label="Footer navigation"
      >
        <Button variant="link" href="/faq" class="text-muted-foreground hover:text-primary">
          {$_('footer.navigation.faq')}
        </Button>
        <Button
          variant="link"
          href="/privacy-policy"
          class="text-muted-foreground hover:text-primary"
        >
          {$_('footer.navigation.privacy_policy')}
        </Button>
        <Button
          variant="link"
          href="/terms-of-service"
          class="text-muted-foreground hover:text-primary"
        >
          {$_('footer.navigation.terms_of_service')}
        </Button>
      </nav>
    </div>
  </div>
</footer>
