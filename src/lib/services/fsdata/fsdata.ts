import BgNodeClient, {
  DbType,
  type BgNodeClientConfig,
  type MyUser,
} from '@baragaun/bg-node-client'

const config: BgNodeClientConfig = {
  useMockData: false,
  dbType: DbType.rxdb,
  inBrowser: true,
};
let client: BgNodeClient | undefined = undefined;

const fsdata = {
  getClient: () => {
    if (!client) {
      client = new BgNodeClient(null, config);
    }

    return client;
  },
}

// EXAMPLE
const signUpUser = async (
  attr: Partial<MyUser>,
): Promise<MyUser | null> => {
  const result = await fsdata.getClient().signUpUser(attr);

  if (result.error) {
    console.error('SignUp failed.', result.error);
  } else {
    const myUser = result.object;
    if (myUser) {
      console.log('SignUp succeeded.', myUser);

      return myUser;
    }
  }

  return null;
}

export default fsdata;
