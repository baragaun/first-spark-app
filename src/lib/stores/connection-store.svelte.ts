// Create a reactive store for connection status
let isOffline = $state(typeof navigator !== 'undefined' ? !navigator.onLine : false);
let previousOfflineState = $state(isOffline); // Initialize with current state
let offlineToastId = $state<string | number | undefined>(undefined);
const isDevelopment = $derived(import.meta.env.DEV);

// Initialize event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
  });

  window.addEventListener('offline', () => {
    isOffline = true;
  });
}

// Update previous state when isOffline changes
function updatePreviousState() {
  previousOfflineState = isOffline;
}

// Toggle connection (for development only)
function toggleConnection() {
  if (isDevelopment) {
    isOffline = !isOffline;
  }
}

// Export the connection store
export const connectionStore = {
  get isOffline() {
    return isOffline;
  },
  get previousOfflineState() {
    return previousOfflineState;
  },
  get isDevelopment() {
    return isDevelopment;
  },
  get offlineToastId() {
    return offlineToastId;
  },
  set offlineToastId(id) {
    offlineToastId = id;
  },
  toggleConnection,
  updatePreviousState,
};
