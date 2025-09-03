<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import { appTitle } from '$lib/stores/app-store';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

  const isMobile = new IsMobile();

  const currentYear = new Date().getFullYear();
</script>

<footer class="border-t-0 bg-background md:border-t">
  <div class="px-4 py-4">
    <div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
      {#if !isMobile.current}
        <!-- Copyright -->
        <div class="flex flex-col items-center lg:items-start">
          <p class="text-center text-sm text-muted-foreground lg:text-left">
            {m['footer.copyright']({ year: currentYear, title: $appTitle })}
          </p>
        </div>
      {/if}

      <!-- Navigation Links -->
      <nav
        class="flex flex-wrap items-center justify-center gap-4 text-sm"
        aria-label="Footer navigation"
      >
        <!--TODO: Hidding FAQ section as per the issue:  https://github.com/baragaun/first-spark-app/issues/110 -->
        <!--<Button variant="link" href="/faq" class="text-muted-foreground hover:text-primary">
          {m['footer.navigation.faq']()}
        </Button> -->
        {#if !isMobile.current}
          <Button
            variant="link"
            href="/privacy-policy"
            class="text-muted-foreground hover:text-primary"
          >
            {m['footer.navigation.privacy_policy']()}
          </Button>
        {/if}
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
