import clientStore from '@/services/fsdata/clientStore'
import findAvailableUserHandle from '@/services/fsdata/operations/findAvailableUserHandle';
import findMyUser from '@/services/fsdata/operations/findMyUser';
import init from '@/services/fsdata/init';
import isUserIdentAvailable from '@/services/fsdata/operations/isUserIdentAvailable';
import resetMyPassword from '@/services/fsdata/operations/resetMyPassword';
import signInUser from '@/services/fsdata/operations/signInUser';
import signInWithToken from '@/services/fsdata/operations/signInWithToken';
import signMeOut from '@/services/fsdata/operations/signMeOut';
import signUpUser from '@/services/fsdata/operations/signUpUser';
import updateMyUser from '@/services/fsdata/operations/updateMyUser';
import verifyMultiStepActionToken from '@/services/fsdata/operations/verifyMultiStepActionToken';
import verifyMyEmail from '@/services/fsdata/operations/verifyMyEmail';

const fsdata = {
  client: clientStore.getClient(),
  findAvailableUserHandle,
  findMyUser,
  init,
  isSignedIn: () => clientStore.getClient()?.operations.myUser.isSignedIn() || false,
  isUserIdentAvailable,
  resetMyPassword,
  signInUser,
  signInWithToken,
  signMeOut,
  signUpUser,
  updateMyUser,
  verifyMultiStepActionToken,
  verifyMyEmail,
};

export default fsdata;
