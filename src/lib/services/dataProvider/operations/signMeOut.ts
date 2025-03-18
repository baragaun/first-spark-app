import dataProviderStore from '@/services/dataProvider/dataProviderStore';

const signMeOut = async (): Promise<void> => {
  const client = dataProviderStore.getClient();
  if (!client) {
    console.error('fsdata.signMeOut failed: client not initialized.');
    // todo: show error to user
    return;
  }

  await client.operations.myUser.signMeOut();
};

export default signMeOut;
