import axios from "./axiosConfig";

const backendUrl = import.meta.env.VITE_APP_URL;
const { CancelToken } = axios;
const source = CancelToken.source();

export const getProfile = async (user_id) => {
  try {
    const response = await axios.get(
      `${backendUrl}/user/get-profile/${user_id}`,
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

export const updateProfile = async (user_id, data) => {
  try {
    const response = await axios.put(
      `${backendUrl}/user/update-profile/${user_id}`,
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
};


export const logout = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/user/logout`,
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