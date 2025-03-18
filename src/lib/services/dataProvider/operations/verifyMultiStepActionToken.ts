import dataProviderStore from '@/services/dataProvider/dataProviderStore';

const verifyMultiStepActionToken = async (
  actionId: string,
  token: string,
  newPassword: string | undefined,
): Promise<boolean> => {
  const client = dataProviderStore.getClient();
  if (!client) {
    console.error('fsdata.verifyMultiStepActionToken failed: client not initialized.');
    // todo: show error to user
    return false;
  }

  const result = await client.operations.multiStepAction.verifyMultiStepActionToken(
    actionId,
    token,
    newPassword,
  );

  if (result.error || !result.object || !result.object.actionId) {
    console.error('fsdata.verifyMultiStepActionToken failed.', result.error);
    return false;
  }
  return true;
};

export default verifyMultiStepActionToken;
