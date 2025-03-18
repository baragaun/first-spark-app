import dataProviderStore from '@/services/dataProvider/dataProviderStore';
import { CachePolicy, type MyUser } from '@baragaun/bg-node-client';

const findMyUser = async (cachePolicy: CachePolicy): Promise<MyUser | null> => {
  const client = dataProviderStore.getClient();
  if (!client) {
    console.error('fsdata.findMyUser failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  return client.operations.myUser.findMyUser({ cachePolicy });
};

export default findMyUser;
