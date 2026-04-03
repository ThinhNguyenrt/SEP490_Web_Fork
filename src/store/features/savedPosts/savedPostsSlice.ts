import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SavedPostsState {
  savedPostIds: number[];
}

const initialState: SavedPostsState = {
  savedPostIds: [],
};

const savedPostsSlice = createSlice({
  name: "savedPosts",
  initialState,
  reducers: {
    // Add a post to saved posts
    addSavedPost: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      if (!state.savedPostIds.includes(postId)) {
        state.savedPostIds.push(postId);
      }
    },
    // Remove a post from saved posts
    removeSavedPost: (state, action: PayloadAction<number>) => {
      state.savedPostIds = state.savedPostIds.filter(id => id !== action.payload);
    },
    // Initialize saved posts from API or local data
    initializeSavedPosts: (state, action: PayloadAction<number[]>) => {
      state.savedPostIds = action.payload;
    },
    // Clear all saved posts
    clearSavedPosts: (state) => {
      state.savedPostIds = [];
    },
  },
});

export const {
  addSavedPost,
  removeSavedPost,
  initializeSavedPosts,
  clearSavedPosts,
} = savedPostsSlice.actions;

export default savedPostsSlice.reducer;
