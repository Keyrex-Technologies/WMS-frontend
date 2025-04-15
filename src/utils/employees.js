import axios from "./axiosConfig";

const backendUrl = import.meta.env.VITE_APP_URL;
const { CancelToken } = axios;
const source = CancelToken.source();

export const addNewEmployee = async (data) => {
  try {
    const response = await axios.post(
      `${backendUrl}/admin/add-employee`,
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
      throw err;
    }
  }
};

export const getTodaysAttendance = async () => {
  try {
    const response = await axios.get(`${backendUrl}/attendance/today`, {
      cancelToken: source.token,
    });
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw new Error(err.response?.data?.message || "Failed to verify OTP");
    }
  }
};

export const getAllAttendance = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/attendance/get-all-attendance`,
      {
        cancelToken: source.token,
      }
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
