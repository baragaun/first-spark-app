import {
  AppEnvironment,
  BgNodeClient,
  type BgNodeClientConfig,
  CachePolicy,
  DbType,
  HttpHeaderName,
  type MyUser,
  UserIdentType,
} from '@baragaun/bg-node-client';

let _client: BgNodeClient | undefined;

const _init = async (): Promise<boolean> => {
  if (_client) {
    return true;
  }

  const config: BgNodeClientConfig = {
    dbType: DbType.rxdb,
    inBrowser: true,
    fsdata: {
      url: import.meta.env.VITE_FSDATA_URL || 'http://localhost:8092/fsdata/api/graphql',
      headers: {
        [HttpHeaderName.consumer]: 'first-spark-app',
      },
    },
  };

  if (import.meta.env.VITE_APP_ENVIRONMENT) {
    config.appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT as AppEnvironment;
  }

  if (process.env.MOCK_DATA === 'true') {
    config.useMockData = true;
  }

  _client = await new BgNodeClient().init(config);

  if (!_client) {
    throw new Error('Error initializing BgNodeClient');
  }

  return true;
};

const fsdata = {
  init: _init,

  getClient: () => _client,

  signUpUser: async (
    userHandle: string,
    email: string | undefined,
    password: string | undefined,
  ): Promise<MyUser | null> => {
    if (!(await _init()) || !_client) {
      return null;
    }

    const result = await _client.operations.myUser.signUpUser({ userHandle, email, password });

    if (result.error || !result.object?.userAuthResponse?.userId) {
      console.error('SignUpUser failed.', result.error);

      return null;
    }

    return result.object.myUser || null;
  },

  signInUser: async (
    ident: string,
    identType: UserIdentType,
    password: string,
  ): Promise<MyUser | null> => {
    if (!(await _init()) || !_client) {
      return null;
    }

    const result = await _client.operations.myUser.signInUser({ ident, identType, password });

    if (result.error || !result.object?.userAuthResponse.userId) {
      console.error('SignInUser failed.', result.error);

      return null;
    }

    return result.object.myUser || null;
  },

  signOutUser: async (): Promise<void> => {
    if (!(await _init()) || !_client) {
      return;
    }

    await _client.operations.myUser.signMeOut();
  },

  findMyUser: async (cachePolicy: CachePolicy): Promise<MyUser | null> => {
    if (!(await _init()) || !_client) {
      return null;
    }

    return _client.operations.myUser.findMyUser({ cachePolicy });
  },
};

export default fsdata;
