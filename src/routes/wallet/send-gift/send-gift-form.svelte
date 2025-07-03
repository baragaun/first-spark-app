<!-- <script lang="ts">
  import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import AuthCard from '@/components/auth-card.svelte';
    import FormButton from '@/components/forms/form-button.svelte';
    import EmailFormInput from '@/components/forms/form-ident-input.svelte';
    import OtpFormInput from '@/components/forms/form-otp-input.svelte';
    import PasswordFormInput from '@/components/forms/form-password-input.svelte';
    import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
    import { type MyUserContext } from '@/contexts/my-user-context.svelte.js';
    import translate from '@/helpers/language/translate.js';
    import passwordHelpers from '@/helpers/password-helpers.js';
    import { m } from '@/paraglide/messages';
    import { AppUiMessage } from '@/types/enums.js';
    import { UserIdentType } from '@baragaun/bg-node-client';
    import { getContext, onDestroy } from 'svelte';
    import { superForm, type SuperValidated } from 'sveltekit-superforms';
    import { zod } from 'sveltekit-superforms/adapters';
    import { debounce } from 'throttle-debounce';
    
  </script>
  
  <form method="POST" id="reset-password-form" use:enhance>
    <AuthCard title={m['reset_password.title']()} description="test">
      <div class="space-y-4">
        {#if step == 1}
          <EmailFormInput
            {form}
            fieldName="ident"
            placeholder={m['reset_password.form.identifier_placeholder']()}
            label={m['reset_password.form.identifier_label']()}
            {isLoading}
          />
        {:else if step == 2}
          <PasswordFormInput
            {form}
            fieldName="newPassword"
            label={m['reset_password.new_password_form.label']()}
            placeholder={m['reset_password.new_password_form.placeholder']()}
          />
          <OtpFormInput
            {form}
            fieldName="token"
            label={m['verify_token.verification_code']()}
            length={6}
            showResend={true}
            {canResend}
            {resendTimer}
            onResendClick={handleResendToken}
            showBackButton={true}
            backButtonLabel={m['reset_password.buttons.start_over']()}
            onBackButtonClick={() => {
              step = 1;
              hasStepError = false;
              if (otpHandler) {
                otpHandler.removeListener();
              }
              formData.update((data) => {
                return {
                  ident: data.ident,
                  newPassword: '',
                  token: '',
                  actionId: '',
                };
              });
            }}
          />
        {/if}
        <FormButton
          disabled={isLoading || hasStepError || !isFormValid}
          isLoading={$delayed || isLoading}
          buttonText={getCurrentStepButtonLabel()}
          loadingText={m['reset_password.buttons.processing']()}
        />
      </div>
      <div class="mt-4 text-center text-sm">
        {m['reset_password.buttons.have_account']()}
        <a href="/signup" class="underline"> {m['reset_password.buttons.signup']()} </a>
      </div>
    </AuthCard>
  </form>
   -->