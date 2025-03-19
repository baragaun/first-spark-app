import {
  type BgNodeClient,
  type MultiStepActionListener,
  type SidMultiStepActionProgress,
  MultiStepActionEventType,
} from '@baragaun/bg-node-client';

export class ResetMyPasswordListener implements MultiStepActionListener {
  public id: string;
  public actionId: string;
  public client: BgNodeClient;
  private verificationCode: string;
  private newPassword: string;
  private errorCallback: (message: string) => void;
  private loadingCallback: (isLoading: boolean) => void;

  public constructor(
    id: string,
    actionId: string,
    client: BgNodeClient,
    verificationCode?: string,
    newPassword?: string,
    errorCallback?: (message: string) => void,
    loadingCallback?: (isLoading: boolean) => void,
  ) {
    this.id = id;
    this.actionId = actionId;
    this.client = client;
    this.verificationCode = verificationCode || '';
    this.newPassword = newPassword || '';
    this.errorCallback = errorCallback || (() => {});
    this.loadingCallback = loadingCallback || (() => {});
  }

  public async onEvent(eventType: MultiStepActionEventType, action: SidMultiStepActionProgress) {
    if (!this.client) {
      console.error('ResetMyPasswordListener: client not initialized.');
      this.errorCallback('Client not initialized');
      return;
    }

    if (eventType === MultiStepActionEventType.notificationFailed) {
      console.error('ResetMyPasswordListener: Notification failed.', action.notificationResult);
      this.errorCallback('Failed to send verification code');
      this.loadingCallback(false);
      return;
    }

    if (eventType === MultiStepActionEventType.tokenFailed) {
      console.error('ResetMyPasswordListener: incorrect token.', action.notificationResult);
      this.errorCallback('Invalid verification code');
      this.loadingCallback(false);
      return;
    }

    if (eventType === MultiStepActionEventType.timedOut) {
      console.error('ResetMyPasswordListener: timeout.', action.notificationResult);
      this.errorCallback('Verification timed out. Please try again.');
      this.loadingCallback(false);
      return;
    }

    if (eventType === MultiStepActionEventType.failed) {
      console.error('ResetMyPasswordListener: error.', action.notificationResult);
      this.errorCallback('Password reset failed');
      this.loadingCallback(false);
      return;
    }

    if (eventType === MultiStepActionEventType.notificationSent) {
      console.log('ResetMyPasswordListener: Notification sent out.', action.notificationResult);

      const verifyResponse =
        await this.client.operations.multiStepAction.verifyMultiStepActionToken(
          this.actionId,
          this.verificationCode,
          this.newPassword,
        );

      // NOTE: The verifyResponse does NOT contain the result of the verification. The server
      //       handles that asynchronously. BgNodeClient will continue to poll for the
      //       progress until it received the result. The following code just verifies that
      //       we succeeded in sending the token and password to the server.
      if (!verifyResponse || verifyResponse.error || !verifyResponse.object) {
        console.error(
          'ResetMyPasswordListener.onNotificationSentOrFailed failed.',
          verifyResponse.error,
        );
        this.errorCallback('Verification failed');
        this.loadingCallback(false);
      }
      return;
    }

    if (eventType === MultiStepActionEventType.success) {
      console.log('ResetMyPasswordListener: success.', action.notificationResult);
    }
  }
}
