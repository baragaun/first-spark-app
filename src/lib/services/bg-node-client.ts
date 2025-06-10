import { env } from '$env/dynamic/public';
import {
  AppEnvironment,
  BgNodeClient,
  ClientInfoStoreType,
  HttpHeaderName,
  type BgBaseListener,
  type BgNodeClientConfig,
} from '@baragaun/bg-node-client';

const client = new BgNodeClient();
let isInitializing = false;

export async function initializeBgNodeClient(listener?: BgBaseListener) {
  if (client.isInitialized || isInitializing) return client;
  isInitializing = true;

  const config: BgNodeClientConfig = {
    enableGroupChannels: false,
    inBrowser: true,
    fsdata: {
      url: env.PUBLIC_FSDATA_URL || 'http://localhost:8092/fsdata/api/graphql',
      headers: {
        [HttpHeaderName.consumer]: 'first-spark-app',
      },
    },
    clientInfoStoreType: ClientInfoStoreType.db,
    logLevel: env.PUBLIC_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined,
  };

  if (env.PUBLIC_APP_ENVIRONMENT) {
    config.appEnvironment = env.PUBLIC_APP_ENVIRONMENT as AppEnvironment;
  }

  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    throw new Error('BgNodeClient: Not running in a supported browser environment.');
  }

  await client.init({
    config,
    isOnline: true,
    startSession: true,
    listener,
  });

  isInitializing = false;
  return client;
}

export { client };
