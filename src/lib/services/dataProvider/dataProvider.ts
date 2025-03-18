import dataProviderStore from '@/services/dataProvider/dataProviderStore';
import init from '@/services/dataProvider/init';
import findAvailableUserHandle from '@/services/dataProvider/operations/findAvailableUserHandle';
import findMyUser from '@/services/dataProvider/operations/findMyUser';
import isUserIdentAvailable from '@/services/dataProvider/operations/isUserIdentAvailable';
import resetMyPassword from '@/services/dataProvider/operations/resetMyPassword';
import signInUser from '@/services/dataProvider/operations/signInUser';
import signInWithToken from '@/services/dataProvider/operations/signInWithToken';
import signMeOut from '@/services/dataProvider/operations/signMeOut';
import signUpUser from '@/services/dataProvider/operations/signUpUser';
import updateMyUser from '@/services/dataProvider/operations/updateMyUser';
import verifyMultiStepActionToken from '@/services/dataProvider/operations/verifyMultiStepActionToken';
import verifyMyEmail from '@/services/dataProvider/operations/verifyMyEmail';

const dataProvider = {
  client: dataProviderStore.getClient(),
  findAvailableUserHandle,
  findMyUser,
  init,
  isSignedIn: () => dataProviderStore.getClient()?.operations.myUser.isSignedIn() || false,
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

export default dataProvider;
