import {
  AppEnvironment,
  BgNodeClient,
  CachePolicy,
  type BgNodeClientConfig,
  HttpHeaderName,
} from '@baragaun/bg-node-client';

import clientStore from './clientStore';

const init = async (): Promise<boolean> => {
  console.log('fsdata._init called.');

  if (clientStore.getClient()) {
    console.log('fsdata._init: client already exists.');
    return true;
  }

  const config: BgNodeClientConfig = {
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

  // if (import.meta.env.MOCK_DATA === 'true') {
  //   config.useMockData = true;
  // }

  const client = await new BgNodeClient().init(config);

  if (!client) {
    throw new Error('Error initializing BgNodeClient');
  }

  clientStore.setClient(client);

  // todo: Only fetch a fresh copy of the user if this code is not called too often
  // Ideally, this code is only called once per session. We may have to set a timer
  // and make sure we don't fetch the user too often.
  if (client.operations.myUser.isSignedIn()) {
    await client.operations.myUser.findMyUser({ cachePolicy: CachePolicy.networkFirst });
  }

  return true;
};

export default init;
