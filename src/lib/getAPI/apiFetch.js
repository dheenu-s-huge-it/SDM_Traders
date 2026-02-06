import { axiosGet, axiosPost } from '../api';

export const fetchDateSingle = async (url, setData, params) => {
  try {
    axiosGet.get(url, { params }).then((response) => {
      if (response.data.action === "success") {
        setData(response.data.data);
      }
    });
  } catch (error) {
    throw error;
  }
};

export const fetchDateMulitple = async (url, params) => {
  try {
    const response = await axiosGet.get(url, { params });
    if (response.data.action === "success") {
      return response.data;
    } else {
      return { data: [] };
    }
  } catch (error) {
    throw error;
  }
};



export const postData = async (url, data, setloadingPage, setError, pathname, router) => {
  try {
    setloadingPage(true);
    axiosPost.post(url, data).then((response) => {
      setloadingPage(false);
      if (response.data.action === "error") {
        setError({ status: "error", message: response.data.message });
      } else {
        setError({ status: "success", message: response.data.message });
        setTimeout(() => {
          router.push(pathname);
        }, 200);
      }
    });
  } catch (err) {
    setloadingPage(false);
    setError({ status: "error", message: "An error occurred during the request." });
  }
};

export const postDataValue = async (url, data, setloadingPage, setError, timeout) => {
  try {
    setloadingPage(true);
    axiosPost.post(url, data).then((response) => {
      setloadingPage(false);
      if (response.data.action === "error") {
        setError({ status: "error", message: response.data.message });
      } else {
        setError({ status: "success", message: response.data.message });
        timeout();
      }
    });
  } catch (err) {
    setloadingPage(false);
    setError({ status: "error", message: "An error occurred during the request." });
  }
};