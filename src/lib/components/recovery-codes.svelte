<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import * as Switch from '$lib/components/ui/switch';
  import { Copy } from 'lucide-svelte';
  import AuthCard from './ui/auth-card.svelte';

  export let loading = false;
  export let onComplete: () => void;

  let recoveryCodes: string[] = [];
  let isRecoveryCodesGenerated = false;
  let isRecoveryCodesAcknowledged = false;
  let showCopyAlert = false;

  const generateRecoveryCodes = () => {
    // Generate 8 random recovery codes
    const codes = Array.from({ length: 8 }, () => {
      return Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6)).join('-');
    });
    recoveryCodes = codes;
    isRecoveryCodesGenerated = true;
  };

  const copyRecoveryCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join(', '));
      showCopyAlert = true;
      setTimeout(() => {
        showCopyAlert = false;
      }, 3000); // Hide alert after 3 seconds
    } catch (err) {
      console.error('Failed to copy recovery codes:', err);
    }
  };
</script>

<AuthCard
  title="Save Your Recovery Codes"
  description="Before we finish setting up your account, save these recovery codes in a secure place. You'll need them if you ever lose access to your account."
>
  <div class="space-y-4">
    {#if !isRecoveryCodesGenerated}
      <Button type="button" variant="outline" class="w-full" onclick={generateRecoveryCodes}>
        Generate Recovery Codes
      </Button>
    {:else}
      <div class="space-y-4">
        <!-- Recovery codes display -->
        <div class="rounded-lg border p-4">
          <div class="grid grid-cols-2 gap-2">
            {#each recoveryCodes as code}
              <code class="rounded bg-muted p-2 text-center font-mono text-sm">
                {code}
              </code>
            {/each}
          </div>
        </div>

        <!-- Copy button -->
        {#if showCopyAlert}
          <Alert variant="default" class="mb-4">
            <AlertDescription>Recovery codes copied to clipboard!</AlertDescription>
          </Alert>
        {/if}

        <Button type="button" variant="outline" class="w-full gap-2" onclick={copyRecoveryCodes}>
          <Copy class="h-4 w-4" />
          Copy Recovery Codes
        </Button>

        <!-- Authentication summary -->
        <div class="space-y-3 rounded-lg border p-4">
          <h3 class="font-medium">Authentication Options Enabled:</h3>
          <ul class="list-inside list-disc text-sm text-muted-foreground">
            <li>Password authentication</li>
            <li>Recovery codes</li>
          </ul>
        </div>

        <!-- Acknowledgment -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <Switch.Root bind:checked={isRecoveryCodesAcknowledged} id="recovery-acknowledgment" />
            <label for="recovery-acknowledgment" class="text-sm">
              I have saved these recovery codes in a secure location
            </label>
          </div>

          <p class="text-sm text-destructive">
            I understand that losing my password and recovery codes will result in permanent account
            loss
          </p>
        </div>

        <!-- Final submit button -->
        <Button
          type="button"
          class="w-full"
          disabled={!isRecoveryCodesAcknowledged}
          onclick={onComplete}
        >
          {loading ? 'Creating Account...' : 'Complete Sign Up'}
        </Button>
      </div>
    {/if}
  </div>
</AuthCard>
