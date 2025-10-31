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
    inBrowser: true,
    enableMockMode: false,
    fsdata: {
      url: env.PUBLIC_FSDATA_URL || 'http://localhost:8092/fsdata/api/graphql',
      headers: {
        [HttpHeaderName.consumer]: 'first-spark-app',
      },
    },
    clientInfoStoreType: ClientInfoStoreType.db,
    logLevel: env.PUBLIC_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined,
    nats: {
      name: 'first-spark-app',
      servers: [env.PUBLIC_NATS_SERVER_URL, 'ws://localhost:8080'],
      timeout: 5000,
      reconnect: true,
      maxReconnectAttempts: 3,
      reconnectTimeWait: 1000,
      pingInterval: 1000,
    },
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
