<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import type { SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'emailOtp',
    label = 'Verification code',
    length = 6,
    id = 'verification-code',
    pattern = REGEXP_ONLY_DIGITS,
    showResend = false,
    canResend = false,
    resendLabel = 'Resend code',
    resendTimerLabel = 'Resend in',
    resendTimer = 0,
    onResendClick = undefined,
  } = $props<{
    form: SuperForm<any, any>;
    fieldName?: string;
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
