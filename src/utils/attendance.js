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

export const getAllPayrolls = async () => {
  try {
    // ?month=3
    const response = await axios.get(
      `${backendUrl}/attendance/get-all-payrolls`,
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

export const getPayroll = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/attendance/get-payroll?employeeId=67ffa738bcdea395296a60aa&month=4`,
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