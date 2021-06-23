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

// storeTokens Utility function for storing idToken and refreshToken
export const storeTokens = (idToken, refreshToken) => {
  localStorage.setItem('__calpalId', idToken);
  localStorage.setItem('__calpalRf', refreshToken);
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
