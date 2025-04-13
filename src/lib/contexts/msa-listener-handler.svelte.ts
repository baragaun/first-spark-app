import translate from "@/helpers/language/translate";
import { AppUiMessage, MsaTokenStatus } from "@/types/enums";
import { type QueryResult, type MultiStepActionProgressResult, MultiStepActionEventType, type SidMultiStepActionProgress } from "@baragaun/bg-node-client";

export class MsaListenerHandler {
  tokenStatus = $state(MsaTokenStatus.unset);
  errorMessage = $state('');
  message = $state('');
  listening = $state(true);
  private listenerRef: string = '';

  constructor(
    private listenerId: string,
    private response: QueryResult<MultiStepActionProgressResult>,
    private onSuccess?: () => void
  ) {
    this.initialize();
  }

  private initialize(): void {
    if (!this.response.object || !this.response.object.run) {
      this.errorMessage = 'Missing response object'
      console.error('myUserContext.addMsaListenerHandler: error: ', this.errorMessage)
      return;
    };

    try {
      this.listenerRef = this.response.object.run.addListener({
        id: this.listenerId,
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              // We can ignore the failure to send the email in development.
              console.log('DEVELOPMENT')
              this.errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError)
              return;
            }
            console.error(
              `${this.listenerId}.multiStepActionListener: Notification failed.`,
              action.notificationResult,
            );

            this.tokenStatus = MsaTokenStatus.sendingFailed;
            this.errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              `${this.listenerId}.multiStepActionListener: Notification sent out.`,
              action.notificationResult,
            );

            this.tokenStatus = MsaTokenStatus.notificationSent;
            this.message = translate(AppUiMessage.msaTokenSent);
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              `${this.listenerId}.multiStepActionListener: incorrect token.`,
              action.notificationResult,
            );
            this.errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              `${this.listenerId}.multiStepActionListener: timeout.`,
              action.notificationResult,
            );
            this.tokenStatus = MsaTokenStatus.sendingFailed;
            this.errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(`${this.listenerId}.multiStepActionListener: error.`, action.notificationResult);
            this.tokenStatus = MsaTokenStatus.verificationFailed;
            this.errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(`${this.listenerId}.multiStepActionListener: success.`, action.notificationResult);
            this.tokenStatus = MsaTokenStatus.success;
            this.message = translate(AppUiMessage.msaTokenSuccess);
            
            // Proceed with any callback
            if (this.onSuccess) this.onSuccess();
          }
        },
    });
  } catch (error) {
    console.error(`${this.listenerId}.addMsaListener:`, { error });
    this.tokenStatus = MsaTokenStatus.verificationFailed;
    this.errorMessage = translate(AppUiMessage.systemError);
  } finally {
    this.listening = false;
  }
  return;
};

removeListener(): void {
  console.log(`Trying to remove this listener: ${this.listenerId}`);
  try {
    if (this.listening && this.listenerRef && this.response.object?.run) {
      this.response.object.run.abort();
      this.response.object.run.removeListener(this.listenerRef);
      console.log(`Removed listener for ${this.listenerId}`);
    }
  } catch (error) {
    console.error(`Error removing listener for ${this.listenerId}:`, error);
  } finally {
    this.listening = false;
    this.listenerRef = '';
  }
}
}
