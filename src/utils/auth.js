import axios from "./axiosConfig";

const backendUrl = import.meta.env.VITE_APP_URL;
const { CancelToken } = axios;
const source = CancelToken.source();

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${backendUrl}/user/signup`, data, {
      cancelToken: source.token,
    });

    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw err;
    }
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${backendUrl}/user/verify-otp`, data);
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw new Error(err.response?.data?.message || "Failed to verify OTP");
    }
  }
};

export const signInUser = async (data) => {
  try {
    const response = await axios.post(`${backendUrl}/user/signin`, data, {
      cancelToken: source.token,
    });
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw err;
    }
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(
      `${backendUrl}/user/forgot-password`,
      data,
      { cancelToken: source.token }
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

export const verifyOtpReset = async (data) => {
  try {
    const response = await axios.post(
      `${backendUrl}/user/verify-otp-reset`,
      data
    );
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw new Error(err.response?.data?.message || "Failed to verify OTP");
    }
  }
};

export const resendOTP = async (data) => {
  try {
    const response = await axios.post(`${backendUrl}/user/resend-otp`, data);
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw new Error(err.response?.data?.message || "Failed to verify OTP");
    }
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(
      `${backendUrl}/user/reset-password`,
      data,
      { cancelToken: source.token }
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
