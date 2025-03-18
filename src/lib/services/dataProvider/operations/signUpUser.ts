import dataProviderStore from '@/services/dataProvider/dataProviderStore';
import { type MyUser } from '@baragaun/bg-node-client';

const signUpUser = async (
  userHandle: string | undefined,
  email: string | undefined,
  password: string | undefined,
): Promise<MyUser | null> => {
  const client = dataProviderStore.getClient();
  if (!client) {
    console.error('fsdata.signUpUser failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  const result = await client.operations.myUser.signUpUser({
    userHandle,
    email,
    password,
    isTestUser: true,
    source: 'testtoken=666666', // this sets all confirmation tokens to be 666666
  });

  if (result.error || !result.object?.userAuthResponse?.userId) {
    console.error('SignUpUser failed.', result.error);

    return null;
  }

  return result.object.myUser || null;
};

export default signUpUser;
