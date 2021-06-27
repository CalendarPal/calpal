import create, { SetState } from "zustand";
import {
  doRequest,
  getTokenPayload,
  IdTokenClaims,
  RefreshTokenClaims,
  storeTokens,
} from "../util";

type User = {
  uid: string;
  email: string;
  name: string;
  imageUrl: string;
  website: string;
};

type AuthState = {
  currentUser?: User;
  idToken?: string;
  isLoading: boolean;
  error?: Error;
  getUser: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => {
  return {
    currentUser: undefined,
    idToken: "",
    isLoading: false,
    error: undefined,
    getUser: () => getUser(set),
  };
});

const getUser = async (set: SetState<AuthState>) => {
  set({
    isLoading: true,
    error: undefined,
  });

  const idToken = localStorage.getItem("__calpalId") ?? undefined;
  const idTokenClaims = getTokenPayload<IdTokenClaims>(idToken);

  if (idTokenClaims) {
    set({
      idToken: idToken,
      currentUser: idTokenClaims.user,
      isLoading: false,
    });

    return;
  }

  const refreshToken = localStorage.getItem("__calpalRf") ?? undefined;
  const refreshTokenClaims = getTokenPayload<RefreshTokenClaims>(refreshToken);

  if (!refreshTokenClaims) {
    set({
      currentUser: undefined,
      idToken: undefined,
      isLoading: false,
    });

    return;
  }

  interface TokenResponse {
    tokens: {
      idToken: string;
      refreshToken: string;
    };
  }

  const { data, error } = await doRequest<TokenResponse>({
    url: "/api/account/tokens",
    method: "post",
    data: {
      refreshToken,
    },
  });

  if (error || !data) {
    set({
      currentUser: undefined,
      idToken: undefined,
      error: error || Error("Could not fetch tokens"),
      isLoading: false,
    });

    return;
  }

  const { tokens } = data;
  storeTokens(tokens.idToken, tokens.refreshToken);
  const tokenClaims = getTokenPayload<IdTokenClaims>(tokens.idToken);

  set({
    idToken: tokens.idToken,
    currentUser: tokenClaims!.user,
    isLoading: false,
  });
};
