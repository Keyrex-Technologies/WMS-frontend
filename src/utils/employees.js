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

export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${backendUrl}/admin/get-all-employees`, {
      cancelToken: source.token,
    });
    return response;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      throw new Error(err.response?.data?.message || "Something went wrong!");
    }
  }
};

export const getEmployeeRecord = async (emp_id) => {
  try {
    const response = await axios.get(
      `${backendUrl}/admin/get-employee/${emp_id}`,
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

export const updateEmployeeRecord = async (emp_id, data) => {
  try {
    const response = await axios.put(
      `${backendUrl}/admin/update-employee/${emp_id}`,
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

export const removeEmployee = async (emp_id, data) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/admin/remove-employee/${emp_id}`,
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