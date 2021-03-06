import axios, { AxiosRequestConfig } from "axios";

export const doRequest = async <T>(reqOptions: AxiosRequestConfig) => {
  let error: Error | undefined;
  let data: T | undefined;

  try {
    const response = await axios.request<T>(reqOptions);
    data = response.data;
  } catch (e: any) {
    if (e.response) {
      error = e.response;
    } else if (e.request) {
      error = e.request;
    } else {
      error = e;
    }
  }

  return {
    data,
    error,
  };
};
