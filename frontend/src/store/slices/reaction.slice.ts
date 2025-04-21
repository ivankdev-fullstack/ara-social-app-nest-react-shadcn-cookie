import {
  ReactionToggleData,
  ReactionToggleResponse,
} from '@/_common/contracts/reaction';
import { ReactionType } from '@/_common/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReactionState {
  postReactions: {
    [postId: string]: {
      [reactionType: string]: ReactionType;
    };
  };
  commentReactions: {
    [commentId: string]: {
      [reactionType: string]: ReactionType;
    };
  };
}

const initialState: ReactionState = {
  postReactions: {},
  commentReactions: {},
};

export const reactionSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    toggleReaction: (state, action: PayloadAction<ReactionToggleData>) => {
      const { target_id, target_type, type } = action.payload;
      const target =
        target_type === 'post' ? 'postReactions' : 'commentReactions';

      state[target][target_id] ||= {};
      state[target][target_id][type!] = type;
    },
    applyReaction: (
      state,
      action: PayloadAction<ReactionToggleData & ReactionToggleResponse>,
    ) => {
      const { target_id, target_type, type, result } = action.payload;
      const target =
        target_type === 'post' ? 'postReactions' : 'commentReactions';

      state[target][target_id] ||= {};

      switch (result) {
        case 'created':
          state[target][target_id][type!] = type;
          break;
        case 'updated':
          state[target][target_id] = { [type!]: type };
          break;
        case 'deleted':
          delete state[target][target_id][type!];
          break;
        default:
          throw new Error(
            'Result of toggling reaction of the post is on unspported format.',
          );
      }
    },
  },
});

export const { toggleReaction, applyReaction } = reactionSlice.actions;
export default reactionSlice.reducer;
