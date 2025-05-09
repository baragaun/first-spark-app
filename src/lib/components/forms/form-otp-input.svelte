<script lang="ts" module>
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import * as Form from '$lib/components/ui/form/index.js';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { m } from '@/paraglide/messages';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'emailOtp',
    label = m['verify_token.verification_code'](),
    length = 6,
    id = 'verification-code',
    pattern = REGEXP_ONLY_DIGITS,
    showResend = false,
    canResend = false,
    resendLabel = m['verify_token.resend'](),
    resendTimerLabel = m['verify_token.resend_in'](),
    resendTimer = 0,
    onResendClick = undefined,
  } = $props<{
    form: SuperForm<T>;
    fieldName?: FormPathLeaves<T>;
    label?: string;
    length?: number;
    id?: string;
    pattern?: RegExp;
    showResend?: boolean;
    canResend?: boolean;
    resendLabel?: string;
    resendTimerLabel?: string;
    resendTimer?: number;
    onResendClick?: (() => void) | undefined;
  }>();

  const errors = form.errors;
  const formData = form.form;

  const formatTime = $derived(() => {
    const mins = Math.floor(resendTimer / 60);
    const secs = resendTimer % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <InputOTP.Root {...props} {id} {pattern} maxlength={length} bind:value={$formData[fieldName]}>
        {#snippet children({ cells })}
          <InputOTP.Group class="w-full">
            {#each cells as cell}
              <InputOTP.Slot
                {cell}
                class={$errors[fieldName] ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
            {/each}
          </InputOTP.Group>
        {/snippet}
      </InputOTP.Root>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

{#if showResend}
  <div class="flex justify-between text-sm">
    <Form.Button
      variant="link"
      class="px-0"
      disabled={!canResend}
      onclick={(e) => {
        e.preventDefault();
        if (onResendClick) onResendClick();
      }}
    >
      {canResend ? resendLabel : `${resendTimerLabel} ${formatTime()}`}
    </Form.Button>
  </div>
{/if}
