import type { ChannelListItem } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const selectedChannel = writable<ChannelListItem | null>(null);
export const myChannels = writable<ChannelListItem[]>([]);
export const isChannelLoading = writable(false);
