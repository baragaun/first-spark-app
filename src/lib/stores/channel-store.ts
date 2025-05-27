import type { Channel } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const selectedChannel = writable<Channel | null>(null);
export const myChannels = writable<Channel[]>([]);
export const isChannelLoading = writable(false);
