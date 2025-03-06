import clientStore from '@/services/fsdata/clientStore';
import { UserIdentType } from '@baragaun/bg-node-client';

const isUserIdentAvailable = async (
  ident: string,
  IdentType: UserIdentType,
): Promise<boolean | null> => {
  const client = clientStore.getClient();
  if (!client) {
    console.error('fsdata.isUserIdentAvailable failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  return client.operations.myUser.isUserIdentAvailable(ident, IdentType);
};

export default isUserIdentAvailable;
