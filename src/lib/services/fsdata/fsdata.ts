import {
  createClient,
  type BgNodeClientConfig,
  DbType,
  ModelType,
  type MyUser,
  UserIdentType, type BgNodeClient,
} from '@baragaun/bg-node-client'

let _client: BgNodeClient | undefined;
const _config: BgNodeClientConfig = {
  useMockData: false,
  dbType: DbType.rxdb,
  inBrowser: true,
};

const fsdata = {
  init: async (): Promise<void> => {
    _client = await createClient(_config);
  },

  getClient: () => _client,
}

// EXAMPLE
const signUpUser = async (
  userHandle: string,
  email: string | undefined,
  password: string | undefined,
): Promise<MyUser | null> => {
  if (!fsdata.getClient()) {
    await fsdata.init();
  }
  const client = fsdata.getClient();

  if (!client) {
    console.log('signUpUser: no client.');
    return null;
  }

  const result = await client.operations.myUser.signUpUser(
    userHandle,
    email,
    password,
  );

  if (result.error || !result.object?.userId) {
    console.error('SignUpUser failed.', result.error);
    return null;
  }

  const { object } = await client.operations.findById<MyUser>(result.object.userId, ModelType.MyUser);

  return object || null;
}

// EXAMPLE
const signInUser = async (
  ident: string,
  identType: UserIdentType,
  password: string,
): Promise<MyUser | null> => {
  const client = fsdata.getClient();

  if (!client) {
    console.log('signInUser: no client.');
    return null;
  }

  const result = await client.operations.myUser.signInUser(
    ident,
    identType,
    password,
  );

  if (result.error || !result.object?.userId) {
    console.error('SignInUser failed.', result.error);
    return null;
  }

  const { object } = await client.operations.findById<MyUser>(result.object.userId, ModelType.MyUser);

  return object || null;
}

export default fsdata;
