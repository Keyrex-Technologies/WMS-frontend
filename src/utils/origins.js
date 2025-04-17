import axios from "./axiosConfig";

const backendUrl = import.meta.env.VITE_APP_URL;
const { CancelToken } = axios;
const source = CancelToken.source();

export const getOrigins = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/origins/get-origins`,
      {
        cancelToken: source.token,
      }
    );

    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw err;
    }
  }
};

export const setOrigins = async (data) => {
  try {
    const response = await axios.put(
      `${backendUrl}/origins/set-origins`,
      data,
      {
        cancelToken: source.token,
      }
    );
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw new Error(err.response?.data?.message || "Something went wrong!");
    }
  }
};;