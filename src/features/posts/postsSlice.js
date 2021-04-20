import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API, Storage } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { listPosts } from "../../graphql/queries";
import { createPost } from "../../graphql/mutations";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await API.graphql({
      query: listPosts,
      variables: { limit: 100 },
    });
    let postsArray = response.data.listPosts.items;

    // Fetch media
    if (postsArray) {
      postsArray = await Promise.all(
        postsArray.map(async (post) => {
          const mediaKey = await Storage.get(post.media);
          post.media = mediaKey;
          return post;
        })
      );
    }
    return postsArray;
  } catch (err) {
    console.log({ err });
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (postData) => {
    try {
      const response = await API.graphql({
        query: createPost,
        variables: { input: postData },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });

      const newPostData = response.data.createPost;
      const mediaUrl = await Storage.get(newPostData.media);
      newPostData.media = mediaUrl;

      return newPostData;
    } catch (err) {
      console.log(err);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      state.posts = state.posts.concat(action.payload);
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addNewPost.fulfilled]: (state, action) => {
      state.posts.push(action.payload);
    },
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state) => state.posts.posts;

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);
