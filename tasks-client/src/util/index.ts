import jwt_decode from "jwt-decode";

// storeTokens Utility function for storing idToken and refreshToken
export const storeTokens = (idToken: string, refreshToken: string) => {
  localStorage.setItem("__calpalId", idToken);
  localStorage.setItem("__calpalRf", refreshToken);
};

export const deleteTokens = () => {
  localStorage.removeItem("__calpalId");
  localStorage.removeItem("__calpalRf");
};

interface TokenClaims {
  exp: number;
  iat: number;
}

export interface IdTokenClaims extends TokenClaims {
  user: User;
}

export interface RefreshTokenClaims extends TokenClaims {
  uid: string;
  jti: string;
}

interface User {
  uid: string;
  email: string;
  name: string;
  imageUrl: string;
  website: string;
}

// getTokenPayload Gets the token's payload/claims, returns null if invalid
export const getTokenPayload = <T extends TokenClaims>(
  token: string | undefined
) => {
  if (!token) {
    return undefined;
  }

  const tokenClaims = jwt_decode<T>(token);

  if (Date.now() / 1000 >= tokenClaims.exp) {
    return undefined;
  }

  return tokenClaims;
};

export const daysSinceCreation = (creationDate: string) => {
  const startDate = new Date(creationDate);
  const today = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  const msDiff = today.getTime() - startDate.getTime();

  return Math.floor(msDiff / msPerDay);
};
