import clientStore from '@/services/fsdata/clientStore';

const findAvailableUserHandle = async (email: string): Promise<string | null> => {
  const client = clientStore.getClient();
  if (!client) {
    console.error('fsdata.findAvailableUserHandle failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  return client.operations.myUser.findAvailableUserHandle(email);
};

export default findAvailableUserHandle;
