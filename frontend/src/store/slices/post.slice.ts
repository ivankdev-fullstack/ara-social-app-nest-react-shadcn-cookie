import { ReactionType } from '@/_common/interfaces';
import { IPost } from '@/_common/interfaces/post';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  posts: IPost[];
  cursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
}

const initialState: PostState = {
  posts: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addOneToPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts.unshift(...action.payload);
    },
    appendPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts.push(...action.payload);
    },
    toggleCurrentReaction: (
      state,
      action: PayloadAction<{ post_id: string; reaction_type: ReactionType }>,
    ) => {
      const { post_id, reaction_type: new_reaction } = action.payload;

      state.posts = state.posts.map((post) => {
        if (post.id !== post_id) return post;

        const cur_reaction = post.current_reaction;
        const updatedPost = { ...post };

        if (cur_reaction === 'like') updatedPost.countOf.likes -= 1;
        if (cur_reaction === 'dislike') updatedPost.countOf.dislikes -= 1;

        if (cur_reaction === new_reaction) {
          updatedPost.current_reaction = null;
        } else {
          updatedPost.current_reaction = new_reaction;
          if (new_reaction === 'like') updatedPost.countOf.likes += 1;
          if (new_reaction === 'dislike') updatedPost.countOf.dislikes += 1;
        }

        return updatedPost;
      });
    },
    incrementCountOfComments: (
      state,
      action: PayloadAction<{ post_id: string }>,
    ) => {
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.post_id) {
          return {
            ...post,
            countOf: {
              ...post.countOf,
              comments: post.countOf.comments + 1,
            },
          };
        }
        return post;
      });
    },
    decrementCountOfComments: (
      state,
      action: PayloadAction<{ post_id: string }>,
    ) => {
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.post_id) {
          return {
            ...post,
            countOf: {
              ...post.countOf,
              comments: post.countOf.comments - 1,
            },
          };
        }
        return post;
      });
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    updatePost: (
      state,
      action: PayloadAction<Pick<IPost, 'id' | 'title' | 'content'>>,
    ) => {
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.id) {
          return {
            ...post,
            title: action.payload.title,
            content: action.payload.content,
          };
        }
        return post;
      });
    },
    setCursor: (state, action: PayloadAction<string | null>) => {
      state.cursor = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addOneToPosts,
  appendPosts,
  toggleCurrentReaction,
  incrementCountOfComments,
  decrementCountOfComments,
  updatePost,
  removePost,
  setCursor,
  setHasMore,
  setLoading,
} = postSlice.actions;
export default postSlice.reducer;
