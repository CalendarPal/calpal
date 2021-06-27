import { reactive, inject, toRefs, readonly, watchEffect } from 'vue';
import {
  storeTokens,
  getTokens,
  doRequest,
  getTokenPayload,
  removeTokens,
} from '../util';
import { useRouter } from 'vue-router';

const state = reactive({
  currentUser: null,
  idToken: null,
  isLoading: false,
  error: null,
});

const storeSymbol = Symbol();

const signin = async (email, password) =>
  await authenticate(email, password, '/api/account/signin');

const signup = async (email, password) =>
  await authenticate(email, password, '/api/account/signup');

const signout = async () => {
  state.isLoading = true;
  state.error = null;

  const { error } = await doRequest({
    url: '/api/account/signout',
    method: 'post',
    headers: {
      Authorization: `Bearer ${state.idToken}`,
    },
  });

  if (error) {
    state.error = error;
    state.idToken = null;
    return;
  }

  state.currentUser = null;
  state.idToken = null;

  removeTokens();

  state.isLoading = false;
};

const initializeUser = async () => {
  state.isLoading = true;
  state.error = null;

  const [idToken, refreshToken] = getTokens();

  const idTokenClaims = getTokenPayload(idToken);
  const refreshTokenClaims = getTokenPayload(refreshToken);

  if (idTokenClaims) {
    state.idToken = idToken;
    state.currentUser = idTokenClaims.user;
  }

  state.isLoading = false;

  if (!refreshTokenClaims) {
    return;
  }

  const { data, error } = await doRequest({
    url: '/api/account/tokens',
    method: 'post',
    data: {
      refreshToken,
    },
  });

  if (error) {
    console.error('Error refreshing tokens\n', error);
    return;
  }

  const { tokens } = data;
  storeTokens(tokens.idToken, tokens.refreshToken);

  const updatedIdTokenClaims = getTokenPayload(tokens.idToken);

  state.currentUser = updatedIdTokenClaims.user;
  state.idToken = tokens.idToken;
};

export const createAuthStore = (authStoreOptions) => {
  const { onAuthRoute, requireAuthRoute } = authStoreOptions || {};

  const authStore = {
    ...toRefs(readonly(state)),
    signin,
    signup,
    signout,
    initializeUser,
    onAuthRoute,
    requireAuthRoute,
  };

  return {
    authStore,
    install: (app) => {
      app.provide(storeSymbol, authStore);
    },
  };
};

export function useAuth() {
  const store = inject(storeSymbol);

  if (!store) {
    throw new Error('Auth store has not been instantiated');
  }

  const router = useRouter();

  watchEffect(() => {
    const isLoginOnly = new URL(location.href).searchParams.has('loginOnly');

    if (store.currentUser.value && store.onAuthRoute) {
      if (isLoginOnly) {
        window.close();
      } else {
        router.push(store.onAuthRoute);
      }
    }

    if (!store.currentUser.value && store.requireAuthRoute) {
      if (isLoginOnly) {
        router.push(store.requireAuthRoute + '?loginOnly');
      } else {
        router.push(store.requireAuthRoute);
      }
    }
  });

  return store;
}

// authenticate Implements common code between signin and signup
const authenticate = async (email, password, url) => {
  state.isLoading = true;
  state.error = null;

  const { data, error } = await doRequest({
    url,
    method: 'post',
    data: {
      email,
      password,
    },
  });

  if (error) {
    state.error = error;
    state.isLoading = false;
    return;
  }

  const { tokens } = data;

  storeTokens(tokens.idToken, tokens.refreshToken);

  const tokenClaims = getTokenPayload(tokens.idToken);

  // Set tokens to local storage
  state.idToken = tokens.idToken;
  state.currentUser = tokenClaims.user;
  state.isLoading = false;
};
