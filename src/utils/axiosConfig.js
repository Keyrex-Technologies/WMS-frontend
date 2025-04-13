import axios from "axios";
import Cookies from "js-cookie";
const { CancelToken } = axios;
const source = CancelToken.source();

axios.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.cancelToken = source.token;
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject({ isCancel: true, message: "Request cancelled" });
        } else {
            return Promise.reject(error);
        }
    }
);

export default axios;
