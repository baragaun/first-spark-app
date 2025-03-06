import { BgNodeClient } from '@baragaun/bg-node-client';

let _client: BgNodeClient | undefined;

const clientStore = {
  getClient: () => _client,
  setClient: (client: BgNodeClient) => {
    _client = client;
  },
};

export default clientStore;
