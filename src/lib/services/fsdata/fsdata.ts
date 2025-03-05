import client, {
  type BgNodeClientConfig,
  DbType,
  ModelType,
  type MyUser,
  UserIdentType,
} from '@baragaun/bg-node-client'

const config: BgNodeClientConfig = {
  useMockData: false,
  dbType: DbType.rxdb,
  inBrowser: true,
};

const fsdata = {
  getClient: () => {
    // if (!client) {
    //   client = new BgNodeClient(null, config);
    // }

    return client;
  },
}

// EXAMPLE
const signUpUser = async (
  userHandle: string,
  email: string | undefined,
  password: string | undefined,
): Promise<MyUser | null> => {
  const result = await fsdata.getClient().operations.myUser.signUpUser(
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
  const result = await fsdata.getClient().operations.myUser.signInUser(
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
