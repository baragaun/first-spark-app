import translate from "@/helpers/language/translate";
import { AppUiMessage, MsaTokenStatus } from "@/types/enums";
import { type QueryResult, type MultiStepActionProgressResult, MultiStepActionEventType, type SidMultiStepActionProgress } from "@baragaun/bg-node-client";

let errorMessage = $state('');
let tokenStatus = $state(MsaTokenStatus.unset);
let listening = $state(true);

export class MsaListenerHandler {
  private listenerRef: string = '';
  private listenerId: string;
  private response: QueryResult<MultiStepActionProgressResult>;
  private onNotificationSent?: () => void;
  private onFailure?: () => void;
  private onSuccess?: () => void;

  constructor(
    listenerId: string,
    response: QueryResult,
    onNotificationSent?: () => void,
    onFailure?: () => void,
    onSuccess?: () => void
  ) {
    this.listenerId = listenerId;
    this.response = response;
    this.onNotificationSent = onNotificationSent;
    this.onFailure = onFailure;
    this.onSuccess = onSuccess;
    
    this.initialize();
  }

  private initialize(): void {
    if (!this.response.object || !this.response.object.run) {
      errorMessage = 'Missing response object';
      console.error('MsaListenerHandler.initialize: error: ', errorMessage);
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
              errorMessage = "Notification failed, but you're in development.";
              
              // Advance, ignoring the failure to send in development
              if (this.onNotificationSent) this.onNotificationSent();
              return;
            }
            console.error(
              `${this.listenerId}.multiStepActionListener: Notification failed.`,
              action.notificationResult,
            );

            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              `${this.listenerId}.multiStepActionListener: Notification sent out.`,
              action.notificationResult,
            );

            tokenStatus = MsaTokenStatus.notificationSent;
            
            // Proceed with any callback
            if (this.onNotificationSent) this.onNotificationSent();
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              `${this.listenerId}.multiStepActionListener: incorrect token.`,
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              `${this.listenerId}.multiStepActionListener: timeout.`,
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);

            // Proceed with any callback
            if (this.onFailure) this.onFailure();
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(
              `${this.listenerId}.multiStepActionListener: error.`, 
              action.notificationResult
            );
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);

            // Proceed with any callback
            if (this.onFailure) this.onFailure();
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(
              `${this.listenerId}.multiStepActionListener: success.`, 
              action.notificationResult
            );
            tokenStatus = MsaTokenStatus.success;
            
            // Proceed with any callback
            if (this.onSuccess) this.onSuccess();
          }
        },
      });
    } catch (error) {
      console.error(`${this.listenerId}.addMsaListener:`, { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      listening = false;
    }
  }

  removeListener(): void {
    try {
      if (this.listenerRef && this.response.object?.run) {
        console.log(`Removing listener with ref: ${this.listenerRef}`);

        if (this.response.object.run.abort) {
          this.response.object.run.abort();
        }

        if (this.response.object.run.removeListener) {
          this.response.object.run.removeListener(this.listenerRef);
          console.log(`Successfully removed listener for ${this.listenerId}`);
        } else {
          console.error(`removeListener method not found on run object for ${this.listenerId}`);
        }
      } else {
        console.warn(
          `Cannot remove listener for ${this.listenerId}: listenerRef=${this.listenerRef}, run=${!!this.response.object?.run}`,
        );
      }
    } catch (error) {
      console.error(`Error removing listener for ${this.listenerId}:`, error);
    } finally {
      listening = false;
      this.listenerRef = '';
    }
  }

  getErrorMessage(): string {
    return errorMessage;
  }

  getTokenStatus(): MsaTokenStatus {
    return tokenStatus;
  }

  isListening(): boolean {
    return listening;
  }
}