import clientStore from '@/services/fsdata/clientStore';
import { type MyUser } from '@baragaun/bg-node-client';

const updateMyUser = async (changes: Partial<MyUser>): Promise<MyUser | null> => {
  const client = clientStore.getClient();
  if (!client) {
    console.error('fsdata.findMyUser failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  const result = await client.operations.myUser.updateMyUser(changes);

  if (result.error || !result.object?.id) {
    console.error('createMultiStepAction failed.', result.error);
    // todo: show error to user

    return null;
  }

  return result.object;
};

export default updateMyUser;
