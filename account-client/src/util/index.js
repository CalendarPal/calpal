import axios from 'axios';
import jwt_decode from 'jwt-decode';

// doRequest is a helper function for
// handling axios responses - reqOptions follow axios req config
export const doRequest = async (reqOptions) => {
  let error;
  let data;

  try {
    const response = await axios.request(reqOptions);
    data = response.data;
  } catch (e) {
    if (e.response) {
      error = e.response.data.error;
    } else if (e.request) {
      error = e.request;
    } else {
      error = e;
    }
  }

  if (error) {
    console.error(error);
  }

  return {
    data,
    error,
  };
};

const ID_TOKEN_KEY = '__calpalId';
const REFRESH_TOKEN_KEY = '__calpalRf';

// storeTokens Utility function for storing idToken and refreshToken
export const storeTokens = (idToken, refreshToken) => {
  localStorage.setItem(ID_TOKEN_KEY, idToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getTokens = () => {
  return [
    localStorage.getItem(ID_TOKEN_KEY),
    localStorage.getItem(REFRESH_TOKEN_KEY),
  ];
};

// getTokenPayload Gets the token's payload/claims, returns null if invalid
export const getTokenPayload = (token) => {
  if (!token) {
    return null;
  }

  const tokenClaims = jwt_decode(token);

  if (Date.now() / 1000 >= tokenClaims.exp) {
    return null;
  }

  return tokenClaims;
};
