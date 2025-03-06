import clientStore from '@/services/fsdata/clientStore';
import { VerifyMyEmailListener } from '@/services/fsdata/listeners/VerifyMyEmailListener';

const verifyMyEmail = async (email: string): Promise<void> => {
  const client = clientStore.getClient();
  if (!client) {
    console.error('fsdata.verifyMyEmail failed: client not initialized.');
    // todo: show error to user
    return;
  }

  const result = await client.operations.myUser.verifyMyEmail(email, {
    polling: { enabled: true },
  });

  if (
    result.error ||
    !result.object ||
    !result.object.run ||
    !result.object.actionProgress ||
    !result.object.actionProgress.actionId
  ) {
    console.error('fsdata.verifyMyEmail failed.', result.error);

    return;
  }

  const actionId = result.object.actionProgress.actionId;
  const listener = new VerifyMyEmailListener('sign-up-page-1', actionId, client);
  result.object.run.addListener(listener);

  // You can also add more listeners like this:
  client.operations.multiStepAction.addMultiStepActionListener(actionId, listener);
};

export default verifyMyEmail;
