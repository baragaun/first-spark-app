import clientStore from '@/services/fsdata/clientStore';
import { ResetMyPasswordListener } from '@/services/fsdata/listeners/ResetMyPasswordListener';
import type { MultiStepActionProgressResult } from '@baragaun/bg-node-client';

const resetMyPassword = async (ident: string): Promise<MultiStepActionProgressResult | null> => {
  const client = clientStore.getClient();
  if (!client) {
    console.error('fsdata.resetPassword failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  const result = await client.operations.myUser.resetMyPassword(ident, {
    polling: { enabled: true },
  });

  if (
    result.error ||
    !result.object ||
    !result.object.run ||
    !result.object.actionProgress ||
    !result.object.actionProgress.actionId
  ) {
    console.error('fsdata.resetPassword failed.', result.error);

    return null;
  }

  const actionId = result.object.actionProgress.actionId;
  const listener = new ResetMyPasswordListener('reset-password-page-1', actionId, client);
  result.object.run.addListener(listener);

  // You can also add more listeners like this:
  client.operations.multiStepAction.addMultiStepActionListener(actionId, listener);

  return result.object;
};

export default resetMyPassword;
