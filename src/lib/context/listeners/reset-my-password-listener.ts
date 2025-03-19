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

  public constructor(id: string, actionId: string, client: BgNodeClient) {
    this.id = id;
    this.actionId = actionId;
    this.client = client;
  }

  public async onEvent(eventType: MultiStepActionEventType, action: SidMultiStepActionProgress) {
    if (!this.client) {
      console.error(
        'ResetMyPasswordListener.onNotificationSentOrFailed failed: client not initialized.',
      );
      // todo: Show an error message to user.
      return;
    }

    if (eventType === MultiStepActionEventType.notificationFailed) {
      // The notification failed to go out.
      console.error(
        'ResetMyPasswordListener.onNotificationSentOrFailed: Notification failed.',
        action.notificationResult,
      );
      // todo Show an error message to the user.
      return;
    }

    if (eventType === MultiStepActionEventType.notificationSent) {
      // The notification has been sent out.
      console.log(
        'ResetMyPasswordListener.onNotificationSentOrFailed: Notification sent out.',
        action.notificationResult,
      );
      // todo: Get the confirmation token and the new password from the user:
      const token = '666666';
      const newPassword = 'some-fake-password';

      const verifyResponse =
        await this.client.operations.multiStepAction.verifyMultiStepActionToken(
          this.actionId,
          token,
          newPassword,
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
        // todo: Show an error message to user.
      }

      return;
    }

    if (eventType === MultiStepActionEventType.tokenFailed) {
      console.error(
        'ResetMyPasswordListener.onNotificationSentOrFailed: incorrect token.',
        action.notificationResult,
      );
      // The user entered the wrong token.
      // todo: Show an error message to the user.
      return;
    }

    if (eventType === MultiStepActionEventType.timedOut) {
      console.error(
        'ResetMyPasswordListener.onNotificationSentOrFailed: timeout.',
        action.notificationResult,
      );
      // The multi-step action timed out.
      // todo: Show an error message to the user.
      return;
    }

    if (eventType === MultiStepActionEventType.failed) {
      console.error(
        'ResetMyPasswordListener.onNotificationSentOrFailed: error.',
        action.notificationResult,
      );
      // Something went wrong.
      // todo: Show an error message to the user, depending on action.result
      return;
    }

    if (eventType === MultiStepActionEventType.success) {
      // The token was accepted. The user is now signed in.
      console.log(
        'ResetMyPasswordListener.onNotificationSentOrFailed: success.',
        action.notificationResult,
      );

      if (!this.client.operations.myUser.isSignedIn()) {
        console.error('ResetMyPasswordListener.onFinished failed: user not signed in.');
        // todo: Show an error message to user.
        return;
      }

      // Success! The user us logged in.
      // todo navigate to the dashboard
    }
  }
}
