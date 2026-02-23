<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import { appTitle } from '@/stores/app-store.svelte';

  const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-border/50 bg-muted/30">
  <div class="px-6 py-5">
    <div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
      <!-- Copyright -->
      <div class="flex flex-col items-center lg:items-start">
        <p class="text-center text-xs text-muted-foreground lg:text-left">
          {m['footer.copyright']({ year: currentYear, title: appTitle() })}
        </p>
      </div>

      <!-- Navigation Links -->
      <nav
        class="flex flex-wrap items-center justify-center gap-4 text-xs"
        aria-label="Footer navigation"
      >
        <!--TODO: Hidding FAQ section as per the issue:  https://github.com/baragaun/first-spark-app/issues/110 -->
        <!--<Button variant="link" href="/faq" class="text-muted-foreground hover:text-primary">
          {m['footer.navigation.faq']()}
        </Button> -->
        <Button
          variant="link"
          href="/privacy-policy"
          class="h-auto p-0 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {m['footer.navigation.privacy_policy']()}
        </Button>
        <!--TODO: Hidding Tos section as per the issue:  https://github.com/baragaun/first-spark-app/issues/111 -->
        <!-- <Button
          variant="link"
          href="/terms-of-service"
          class="text-muted-foreground hover:text-primary"
        >
          {m['footer.navigation.terms_of_service']()}
        </Button> -->
      </nav>
    </div>
  </div>
</footer>
