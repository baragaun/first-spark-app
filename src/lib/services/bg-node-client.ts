import {
  AppEnvironment,
  BgNodeClient,
  ClientInfoStoreType,
  HttpHeaderName,
  type BgBaseListener,
  type BgNodeClientConfig,
} from '@baragaun/bg-node-client';
import { getBgHeaders } from './bg-headers';

const client = new BgNodeClient();
let isInitializing = false;

export async function initializeBgNodeClient(listener?: BgBaseListener) {
  if (client.isInitialized || isInitializing) return client;
  isInitializing = true;

  const config: BgNodeClientConfig = {
    inBrowser: true,
    fsdata: {
      url: import.meta.env.VITE_FSDATA_URL || 'http://localhost:8092/fsdata/api/graphql',
      headers: getBgHeaders(),
    },
    clientInfoStoreType: ClientInfoStoreType.db,
    logLevel: 'debug',
  };

  if (import.meta.env.VITE_APP_ENVIRONMENT) {
    config.appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT as AppEnvironment;
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
