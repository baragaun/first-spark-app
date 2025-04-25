// Import the parent route's load function
import { load as parentLoad } from '../+page';

// Reuse the parent route's load function
export const load = parentLoad;
