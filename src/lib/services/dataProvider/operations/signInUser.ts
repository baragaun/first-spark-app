import dataProviderStore from '@/services/dataProvider/dataProviderStore';
import { type MyUser, UserIdentType } from '@baragaun/bg-node-client';

const signInUser = async (
  ident: string,
  identType: UserIdentType,
  password: string,
): Promise<MyUser | null> => {
  const client = dataProviderStore.getClient();
  if (!client) {
    console.error('fsdata.signInUser failed: client not initialized.');
    // todo: show error to user
    return null;
  }

  const result = await client.operations.myUser.signInUser({
    ident,
    identType,
    password,
  });

  if (result.error || !result.object?.userAuthResponse.userId) {
    console.error('SignInUser failed.', result.error);

    return null;
  }

  console.log('SignInUser succeeded.', result.object);

  return result.object.myUser || null;
};

export default signInUser;
