import axios from "axios";
import { SetPosts, UpdatePosts } from "../redux/postSlice";

const API_URL = process.env.REACT_APP_UR_POST_PORT;
console.log(API_URL);

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const postapiRequest = async ({ url, token, data, method }) => {
  try {
    console.log(data);
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    // console.log(result);

    return result?.data;
  } catch (error) {
    const err = error.response.data;

    console.log(err);

    return { status: err.status, message: err.message };
  }
};

export const postfetchPosts = async (token, dispatch, page) => {
  // console.log("Data: " + data);

  try {
    const res = await postapiRequest({
      url: page ? "/newsfeed?page=" + page : "",
      // url: "/newsfeed",
      token: token,
      method: "GET",
    });

    dispatch(SetPosts(res?.data));
    // res?.data?.return;
  } catch (error) {
    console.log(error);
  }
};

export const postrenewfetchPosts = async (token, dispatch, page) => {
  // console.log("Data: " + data);

  try {
    const res = await postapiRequest({
      url: page ? "/newsfeed?page=" + page : "/newsfeed",
      // url: "/newsfeed",
      token: token,
      method: "GET",
    });

    dispatch(UpdatePosts(res?.data));
    // dispatch(SetPosts(res?.data?.latestPosts));
    // res?.data?.return;
  } catch (error) {
    console.log(error);
  }
};

export const postedit = async (postId, token, newData) => {
  // console.log(postId, token, newData);

  try {
    const res = await postapiRequest({
      url: postId,
      token: token,
      data: newData,
      method: "PUT",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postreason = async (_id, token, data) => {
  try {
    const res = await postapiRequest({
      url: _id + "/report",
      token: token,
      data: data,
      method: "POST",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postfetchuserPosts = async (token, user, dispatch, uri, data) => {
  // console.log(token, user, dispatch, uri, data);
  const userId = user?._id;
  try {
    const res = await postapiRequest({
      url: "/user/" + userId,
      token: token,
      user: user,
      method: "GET",
      data: data || {},
    });

    dispatch(UpdatePosts(res));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const postlikePost = async ({ uri, token }) => {
  try {
    // console.log(uri);

    const res = await postapiRequest({
      url: uri,
      token: token,
      method: "PUT",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postdeletePost = async (id, token) => {
  try {
    const res = await postapiRequest({
      url: id,
      token: token,
      method: "DELETE",
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

export const postsearchfetchPosts = async (token, dispatch, uri, data) => {
  // console.log(data);
  try {
    const { keyword, from, to, categori, page } = data;
    const res = await postapiRequest({
      url: `/search?keyword=${keyword}&startDate=${from ?? ""}&endDate=${
        to ?? ""
      }&categories=${categori ?? ""}&page=${page ?? "1"}&limit=10`,
      token: token,
      method: "GET",
      data: data || {},
    });

    // dispatch(UpdatePosts(res?.posts));
    dispatch(SetPosts(res?.posts));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const postfetchId = async (token, dispatch, postId, data) => {
  // console.log("Data: " + data);
  try {
    const res = await postapiRequest({
      url: postId,
      token: token,
      method: "GET",
      data: data || {},
    });

    // dispatch(SetPosts(res?.posts));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likecomment = async (token, url, data) => {
  try {
    const res = await postapiRequest({
      url: url,
      token: token,
      method: "PUT",
      data: data || {},
    });

    // dispatch(SetPosts(res?.posts));
    return res;
  } catch (error) {
    console.log(error);
  }
};
