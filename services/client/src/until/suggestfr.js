import axios from "axios";

const API_URL = process.env.REACT_APP_UR_SUGGEST_PORT;
console.log(API_URL);

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const userapiRequest = async ({ url, token, data, method }) => {
  try {
    // console.log(url, token, data, method);
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const err = error.response.data;

    console.log(err);

    return { status: err.status, message: err.message };
  }
};

export const smartapiRequest = async ({ url, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
    });

    return result?.data;
  } catch (error) {
    const err = error;

    console.log(err);
  }
};

export const generatetext = async (prompt) => {
  try {
    const data = { prompt: prompt };

    const res = await smartapiRequest({
      url: "/generate-text",
      data: data || {},
      method: "POST",
    });

    return res?.generated_text;
  } catch (error) {
    console.log(error);
  }
};

export const generateImg = async (prompt) => {
  try {
    const data = { prompt: prompt };

    // const res = await smartapiRequest({
    //   url: "/generate-image",
    //   data: data || {},
    //   method: "POST",
    // });
    const res = await axios.get("http://localhost:3009/generate_image", {
      responseType: "blob",
      data: data,
      method: "POST",
    });

    // const blob = new Blob([res]);
    const url = URL.createObjectURL(res.data);
    // console.log(typeof url);
    // console.log(url);

    return res;
  } catch (error) {
    console.log(error);
  }
};
