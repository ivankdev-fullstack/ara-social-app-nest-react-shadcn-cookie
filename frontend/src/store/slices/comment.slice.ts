import { IComment } from '@/_common/interfaces/comment';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommentState {
  comments: {
    [target_id: string]: IComment[];
  };
  meta: {
    [target_id: string]: {
      cursor: string | null;
      hasMore: boolean;
      isLoading: boolean;
    };
  };
}

const initialState: CommentState = {
  comments: {},
  meta: {},
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    appendComments: (
      state,
      action: PayloadAction<{ target_id: string; data: IComment[] }>,
    ) => {
      const { target_id, data } = action.payload;
      if (!state.comments[target_id]) {
        state.comments[target_id] = data;
      } else {
        state.comments[target_id] = [...state.comments[target_id], ...data];
      }
    },

    // toggleCurrentReaction: (
    //   state,
    //   action: PayloadAction<{ post_id: string; reaction_type: ReactionType }>,
    // ) => {
    //   const { post_id, reaction_type: new_reaction } = action.payload;

    //   state.comments = state.comments.map((post) => {
    //     if (post.id !== post_id) return post;

    //     const cur_reaction = post.current_reaction;
    //     const updatedPost = { ...post };

    //     if (cur_reaction === 'like') updatedPost.countOf.likes -= 1;
    //     if (cur_reaction === 'dislike') updatedPost.countOf.dislikes -= 1;

    //     if (cur_reaction === new_reaction) {
    //       updatedPost.current_reaction = null;
    //     } else {
    //       updatedPost.current_reaction = new_reaction;
    //       if (new_reaction === 'like') updatedPost.countOf.likes += 1;
    //       if (new_reaction === 'dislike') updatedPost.countOf.dislikes += 1;
    //     }

    //     return updatedPost;
    //   });
    // },
    removeComment: (
      state,
      action: PayloadAction<{ target_id: string; comment_id: string }>,
    ) => {
      const { target_id, comment_id } = action.payload;
      state.comments[target_id] = state.comments[target_id].filter(
        (comment) => comment.id !== comment_id,
      );
    },
    updateComment: (
      state,
      action: PayloadAction<{
        target_id: string;
        data: Pick<IComment, 'id' | 'content'>;
      }>,
    ) => {
      const { target_id, data } = action.payload;
      state.comments[target_id] = state.comments[target_id].map((comment) => {
        if (comment.id === data.id) {
          return {
            ...comment,
            content: data.content,
          };
        }
        return comment;
      });
    },
    setCursor: (
      state,
      action: PayloadAction<{ target_id: string; cursor: string | null }>,
    ) => {
      const { target_id, cursor } = action.payload;
      if (!state.meta[target_id]) {
        state.meta[target_id] = { cursor, hasMore: true, isLoading: false };
      } else {
        state.meta[target_id].cursor = cursor;
      }
    },
    setHasMore: (
      state,
      action: PayloadAction<{ target_id: string; hasMore: boolean }>,
    ) => {
      const { target_id, hasMore } = action.payload;
      if (!state.meta[target_id]) {
        state.meta[target_id] = { cursor: null, hasMore, isLoading: false };
      } else {
        state.meta[target_id].hasMore = hasMore;
      }
    },
    setLoading: (
      state,
      action: PayloadAction<{ target_id: string; isLoading: boolean }>,
    ) => {
      const { target_id, isLoading } = action.payload;
      if (!state.meta[target_id]) {
        state.meta[target_id] = { cursor: null, hasMore: true, isLoading };
      } else {
        state.meta[target_id].isLoading = isLoading;
      }
    },
  },
});

export const {
  appendComments,
  // toggleCurrentReaction,
  updateComment,
  removeComment,
  setCursor,
  setHasMore,
  setLoading,
} = commentSlice.actions;
export default commentSlice.reducer;
