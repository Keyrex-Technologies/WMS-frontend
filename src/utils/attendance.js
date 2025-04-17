import axios from "./axiosConfig";

const backendUrl = import.meta.env.VITE_APP_URL;
const { CancelToken } = axios;
const source = CancelToken.source();

export const getStats = async () => {
  try {
    const response = await axios.get(`${backendUrl}/attendance/stats`, {
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

export const getTodaysAttendance = async () => {
  try {
    const response = await axios.get(`${backendUrl}/attendance/get-daily-attendance`, {
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

export const getAllPayrolls = async (month) => {
  try {
    // ?month=3
    const response = await axios.get(
      `${backendUrl}/attendance/get-all-payrolls?month=${month}`,
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

export const getPayroll = async (user_id, month) => {
  try {
    const response = await axios.get(
      `${backendUrl}/attendance/get-payroll?employeeId=${user_id}&month=${month}`,
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
