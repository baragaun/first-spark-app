<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  const currentYear = new Date().getFullYear();
</script>

<footer class="border-t bg-background">
  <div class="px-4 py-4">
    <div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
      <!-- Copyright -->
      <div class="flex flex-col items-center lg:items-start">
        <p class="text-center text-sm text-muted-foreground lg:text-left">
          © {currentYear} First Spark. All rights reserved.
        </p>
      </div>

      <!-- Navigation Links -->
      <nav
        class="flex flex-wrap items-center justify-center gap-4 text-sm"
        aria-label="Footer navigation"
      >
        <Button variant="link" href="/faq" class="text-muted-foreground hover:text-primary">
          FAQ
        </Button>
        <Button
          variant="link"
          href="/privacy-policy"
          class="text-muted-foreground hover:text-primary"
        >
          Privacy Policy
        </Button>
        <Button
          variant="link"
          href="/terms-of-service"
          class="text-muted-foreground hover:text-primary"
        >
          Terms of Service
        </Button>
      </nav>
    </div>
  </div>
</footer>
