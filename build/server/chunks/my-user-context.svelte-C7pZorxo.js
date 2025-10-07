import { p as public_env } from './shared-server-i79vVjEm.js';
import { t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { BgNodeClient, ClientInfoStoreType, HttpHeaderName, BgListenerTopic, NotificationMethod } from '@baragaun/bg-node-client';

let isSignedIn = false;
let isOffline = false;
let isLoading = false;
let myUser = void 0;
class MyUserContext {
  client = new BgNodeClient();
  _isInitializing = false;
  async initialize() {
    if (this.client.isInitialized || this._isInitializing) {
      console.warn("MyUserContext.initialize: already initialized.");
      return;
    }
    this._isInitializing = true;
    const config = {
      //enableGroupChannels: false,
      inBrowser: true,
      fsdata: {
        url: public_env.PUBLIC_FSDATA_URL || "http://localhost:8092/fsdata/api/graphql",
        headers: { [HttpHeaderName.consumer]: "first-spark-app" }
      },
      clientInfoStoreType: ClientInfoStoreType.db,
      logLevel: public_env.PUBLIC_LOG_LEVEL
    };
    if (public_env.PUBLIC_APP_ENVIRONMENT) {
      config.appEnvironment = public_env.PUBLIC_APP_ENVIRONMENT;
    }
    try {
      if (typeof window === "undefined") {
        console.error("MyUserContext.initialize: not running in the browser.");
        this._isInitializing = false;
        return;
      }
      if (!("indexedDB" in window)) {
        console.error("MyUserContext.initialize: indexedDB is not supported in this browser.");
        this._isInitializing = false;
        return;
      }
      const listener = {
        id: "MyUserContext",
        topic: BgListenerTopic.myUser,
        onSignedIn: () => {
          isSignedIn = true;
        },
        onSignedOut: () => {
          isSignedIn = false;
        },
        onMyUserUpdated: (updatedMyUser) => {
          myUser = updatedMyUser;
        }
      };
      await this.client.init({
        config,
        isOnline: true,
        startSession: true,
        listener
      });
      isSignedIn = this.client.isSignedIn;
    } catch (error) {
      console.error("MyUserContext: Error initializing BgNodeClient:", { error });
      this._isInitializing = false;
      return;
    }
    this._isInitializing = false;
  }
  /**
   * Sign up a new user
   * @param email The user's email address
   * @return Promise<true | string> Returns true on success or an error message on failure
   */
  async signUpUser(email) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.signUpUser: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    if (this.client.isSignedIn) {
      console.error("MyUserContext.signUpUser: already signed in");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const input = { email };
      if (public_env.PUBLIC_APP_ENVIRONMENT === "development") {
        input.isTestUser = true;
        input.source = '{"msaToken":"666666"}';
      }
      const response = await this.client.operations.myUser.signUpUser(input);
      if (!response || response.error || !response.object?.userAuthResponse?.userId) {
        console.error("SignUpUser: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error("signUpUser: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  /**
   * Sign in a user with email and password
   * @param userIdent The user's identifier (email or username)
   * @param identType The type of identifier (UserIdentType.email or UserIdentType.username)
   * @param password The user's password
   * @return Promise<true | string> Returns true on success or an error message on failure
   */
  async signMeInWithPassword(userIdent, identType, password) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.signMeInWithPassword: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    if (this.client.isSignedIn) {
      console.error("MyUserContext.signMeInWithPassword: already signed in");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const input = { ident: userIdent, identType, password };
      const response = await this.client.operations.myUser.signInUser(input);
      if (response.error) {
        console.error("MyUserContext.signMeInWithPassword: received error.", { response });
        return translate(response.error, AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error("MyUserContext.signMeInWithPassword: error", { error: error.message, stack: error.stack });
      return translate(error.message, AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async signMeInWithToken(userIdent) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.signMeInWithToken: not initialized.");
      return { error: AppUiMessage.systemError };
    }
    if (this.client.isSignedIn) {
      console.error("MyUserContext.signMeInWithToken: already signed in");
      return { error: AppUiMessage.systemError };
    }
    try {
      isLoading = true;
      return this.client.operations.myUser.signInWithToken(userIdent, {
        polling: {
          enabled: true,
          interval: 2e3,
          // 2 seconds
          timeout: 15 * 60 * 1e3
          // 15 minutes
        }
      });
    } catch (error) {
      console.error("MyUserContext.signMeInWithToken: error", { error: error.message, stack: error.stack });
      return { error: AppUiMessage.systemError };
    } finally {
      isLoading = false;
    }
  }
  /**
   * Sign out the current user
   * @returns Promise<true | string> Returns true on successful sign out or an error message on failure
   */
  async signMeOut() {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.signMeOut: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    if (!this.client.isSignedIn) {
      console.error("MyUserContext.signMeOut: already signed out.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.myUser.signMeOut();
      if (response.error) {
        console.error("MyUserContext.signMeOut: received error.", { response });
        return translate(response.error, AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error("MyUserContext.signMeOut: error", { error: error.message, stack: error.stack });
      return translate(error.message, AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async updateMyUser(changes) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.updateMyUser: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    if (!this.client.isSignedIn) {
      console.error("MyUserContext.updateMyUser: not signed in.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.myUser.updateMyUser(changes);
      if (response.error) {
        console.error("MyUserContext.updateMyUser: received error.", { response });
        return {
          error: translate(response.error, AppUiMessage.systemError)
        };
      }
      return { myUser: response.object };
    } catch (error) {
      console.error("MyUserContext.updateMyUser: error", { error: error.message, stack: error.stack });
      return {
        error: translate(error.message, AppUiMessage.systemError)
      };
    } finally {
      isLoading = false;
    }
  }
  async updateMyPassword(currentPassword, newPassword) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.updateMyPassword: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    if (!this.client.isSignedIn) {
      console.error("MyUserContext.updateMyPassword: not signed in");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.myUser.updateMyPassword(currentPassword, newPassword);
      if (response.error) {
        console.error("MyUserContext.updateMyPassword: received error.", { response });
        return translate(response.error, AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error("MyUserContext.updateMyPassword: error", { error: error.message, stack: error.stack });
      return translate(error.message, AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findAvailableUserHandle(email) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.findAvailableUserHandle: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      return await this.client.operations.myUser.findAvailableUserHandle(email);
    } catch (error) {
      console.error("MyUserContext.updateMyPassword: error", { error: error.message, stack: error.stack });
      return translate(error.message, AppUiMessage.systemError);
    }
  }
  async isUserIdentAvailable(ident, identType) {
    if (!this.client.isInitialized) {
      return { error: "Client not initialized" };
    }
    try {
      const response = await this.client.operations.myUser.isUserIdentAvailable(ident, identType);
      if (response.error) {
        console.error("MyUserContext.isUserIdentAvailable: received error.", { response });
        return { error: response.error };
      }
      return { isAvailable: !!response.object };
    } catch (error) {
      console.error("isUserIdentAvailable: error:", { error });
      return { isAvailable: false, error: error.message };
    }
  }
  async resetMyPassword(ident) {
    if (!this.client.isInitialized) {
      return { error: "Client not initialized" };
    }
    try {
      isLoading = true;
      return this.client.operations.myUser.resetMyPassword(ident, {
        polling: {
          enabled: true,
          interval: 2e3,
          // 2 seconds
          timeout: 15 * 60 * 1e3
          // 15 minutes
        }
      });
    } catch (error) {
      console.error("resetMyPassword: error", { error });
      return { error: error.message };
    } finally {
      isLoading = false;
    }
  }
  async verifyMyEmail(email) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.verifyMyEmail: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      return this.client.operations.myUser.verifyMyEmail(email, {
        polling: {
          enabled: true,
          interval: 2e3,
          // 2 seconds
          timeout: 15 * 60 * 1e3
          // 15 minutes
        }
      });
    } catch (error) {
      console.error("MyUserContext.verifyMyEmail: error", { error: error.message, stack: error.stack });
      return {
        error: translate(error.message, AppUiMessage.systemError)
      };
    } finally {
      isLoading = false;
    }
  }
  async verifyMyPassword(password) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.verifyMyPassword: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      return await this.client.operations.myUser.verifyMyPassword(password);
    } catch (error) {
      console.error("MyUserContext.verifyMyPassword: error", { error: error.message, stack: error.stack });
      return {
        error: translate(error.message, AppUiMessage.systemError)
      };
    } finally {
      isLoading = false;
    }
  }
  async verifyMultiStepActionToken(actionId, token, newPassword) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.verifyMultiStepActionToken: no client");
      return "system-error";
    }
    try {
      isLoading = true;
      const response = await this.client.operations.multiStepAction.verifyMultiStepActionToken(actionId, token, newPassword);
      if (response.error || !response.object) {
        console.error("MyUserContext.verifyMultiStepActionToken: failed calling client.verifyMultiStepActionToken", { response });
        return response.error || "system-error";
      }
      return true;
    } catch (error) {
      console.error("verifyMultiStepActionToken: error", { error });
      return error.message;
    } finally {
      isLoading = false;
    }
  }
  async sendMultiStepActionNotification(actionId, email) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.sendMultiStepActionNotification: not initialized.");
      return "system-error";
    }
    try {
      isLoading = true;
      const response = await this.client.operations.multiStepAction.sendMultiStepActionNotification(actionId, email, void 0, NotificationMethod.email);
      if (response.error) {
        return response.error;
      }
      return true;
    } catch (error) {
      console.error("MyUserContext.sendMultiStepActionNotification: error", { error });
      return "system-error";
    } finally {
      isLoading = false;
    }
  }
  async deleteMyUser(cause, description) {
    if (!this.client.isInitialized) {
      console.error("MyUserContext.deleteMyUser: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.myUser.deleteMyUser(cause, description);
      if (response.error) {
        console.error("MyUserContext.deleteMyUser: received error.", { response });
        return translate(response.error, AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error("MyUserContext.deleteMyUser: error", { error: error.message, stack: error.stack });
      return translate(error.message, AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  get isInitialized() {
    return this.client.isInitialized;
  }
  get isOffline() {
    return isOffline;
  }
  set isOffline(value) {
    isOffline = value;
  }
  get isLoading() {
    return isLoading;
  }
  get isSignedIn() {
    return isSignedIn;
  }
  get myUser() {
    return myUser;
  }
  get myUserId() {
    return this.client.myUserId;
  }
  get myUserHandle() {
    return myUser?.userHandle;
  }
  get myEmail() {
    return myUser?.email;
  }
  get myUserInitials() {
    if (!this.myUserHandle) return "";
    const parts = this.myUserHandle.split(/[^a-zA-Z]/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).substring(0, 2);
    }
    const word = parts[0];
    const firstChar = word[0];
    const firstUpperAfterStart = word.slice(1).match(/[A-Z]/)?.[0] || "";
    return (firstChar + firstUpperAfterStart).substring(0, 2);
  }
  get myUserOnboardingCompletion() {
    if (!this.myUser) return 0;
    return 1;
  }
}
const myUserContext = new MyUserContext();

export { myUserContext as m };
//# sourceMappingURL=my-user-context.svelte-C7pZorxo.js.map
