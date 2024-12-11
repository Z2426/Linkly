import axios from "axios";

const API_URL = process.env.REACT_APP_UR_CHAT_PORT;
console.log(API_URL);

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const chatapiRequest = async ({ url, token, data, method }) => {
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

    // console.log(result);

    return result;
  } catch (error) {
    const err = error;

    console.log(err.response.data);
    return err.response.data;

    // return { status: err.status, message: err.message };
  }
};

export const chatfetchListpersonal = async (token, userId) => {
  try {
    const res = await chatapiRequest({
      url: `/users/${userId}/conversations/`,
      token: token,
      method: "GET",
    });

    //   dispatch(SetPosts(res?.data?.latestPosts));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchChat = async (token, idroom, page) => {
  try {
    const res = await chatapiRequest({
      url: `/conversation/${idroom}/messages?limit=20&page=${page}`,
      token: token,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchConversations = async (token, id) => {
  try {
    const res = await chatapiRequest({
      url: `/chat/users/${id}/conversations`,
      token: token,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createConversations = async (token, id_1, id_2) => {
  try {
    const res = await chatapiRequest({
      url: "/message/create",
      token: token,
      data: {
        userIds: [`${id_1}`, `${id_2}`],
      },
      method: "POST",
    });

    return res?.data?._id;
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async (token, idroom, id_1, chat, uri) => {
  try {
    const res = await chatapiRequest({
      url: "/message/send",
      token: token,
      data: {
        conversationId: idroom,
        senderId: id_1,
        text: chat ?? "",
        fileUrl: uri || "",
      },
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const seenMessage = async (token, id_1, id_2) => {
  try {
    const res = await chatapiRequest({
      url: "/message/mark-read",
      token: token,
      data: {
        messageId: id_2,
        userId: id_1,
      },
      method: "PUT",
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

export const chatfetchDetail = async (token, idroom) => {
  try {
    const res = await chatapiRequest({
      url: `/conversations/${idroom}`,
      token: token,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
