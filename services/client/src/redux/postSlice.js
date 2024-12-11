import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  editp: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      // const newPost = action.payload;
      // console.log(typeof action.payload);
      let item = [...state.posts];
      const list = action.payload;
      item = item.concat(list);
      // item.push(list[0]);
      // console.log(list[0]);
      // console.log(item);

      state.posts = item;
      // state.posts = action.payload;
    },
    updatePosts(state, action) {
      state.posts = action.payload;
    },
    checkedPosts(state, action) {
      const list = [...state.posts];

      const id = action.payload;

      let item = list.find((obj) => obj._id == id);
      if (item) {
        item.isCheck = true;
      }

      state.editp = list;
      // state.posts = action.payload;
    },
    updateEditp(state, action) {
      state.editp = action.payload;
    },
  },
});

export default postSlice.reducer;

export function SetPosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.getPosts(post));
  };
}

export function UpdatePosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.updatePosts(post));
  };
}

export function UpdateEditp(val) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.updateEditp(val));
  };
}

export function CheckedPosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.checkedPosts(post));
  };
}
