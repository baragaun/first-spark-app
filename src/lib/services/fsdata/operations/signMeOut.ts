import clientStore from '@/services/fsdata/clientStore';

const signMeOut = async (): Promise<void> => {
  const client = clientStore.getClient();
  if (!client) {
    console.error('fsdata.signMeOut failed: client not initialized.');
    // todo: show error to user
    return;
  }

  await client.operations.myUser.signMeOut();
};

export default signMeOut;
