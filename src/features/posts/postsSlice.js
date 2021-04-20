import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API, Storage } from "aws-amplify";
import { listPosts } from "../../graphql/queries";
import { createPost, updatePost, deletePost } from "../../graphql/mutations";

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

export const editPost = createAsyncThunk(
  "posts/postUpdated",
  async (postData) => {
    try {
      const response = await API.graphql({
        query: updatePost,
        variables: { input: postData },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });

      const updatedPostData = response.data.updatePost;

      const mediaUrl = await Storage.get(updatedPostData.media);
      updatedPostData.media = mediaUrl;

      return updatedPostData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const removePost = createAsyncThunk(
  "posts/removePost",
  async (postId) => {
    try {
      const postToRemove = {
        id: postId,
      };
      const response = await API.graphql({
        query: deletePost,
        variables: { input: postToRemove },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });

      const postToDelete = response.data.deletePost;

      await Storage.remove(postToDelete.media);

      return postToDelete;
    } catch (err) {
      console.log(err);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // reducers
    // postUpdated(state, action) {
    //   const { id, title, text, media } = action.payload;
    //   const existingPost = state.posts.find((post) => post.id === id);
    //   if (existingPost) {
    //     existingPost.title = title;
    //     existingPost.text = text;
    //     existingPost.media = media;
    //   }
    // },
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

    [editPost.fulfilled]: (state, action) => {
      const { id, title, text, media } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.text = text;
        existingPost.media = media;
      }
    },
    [removePost.fulfilled]: (state, action) => {
      const { id } = action.payload;
      console.log("hey", id);
      state.posts = state.posts.filter((post) => post.id !== id);
    },
  },
});

export const { postAdded, postUpdated, postDeleted } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state) => state.posts.posts;

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);
