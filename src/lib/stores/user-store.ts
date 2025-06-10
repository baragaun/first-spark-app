import type { UserListItem } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const selectedUser = writable<UserListItem | null>(null);
