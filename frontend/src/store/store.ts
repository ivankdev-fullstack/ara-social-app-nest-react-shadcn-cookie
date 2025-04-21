import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/auth.api';
import { commentApi } from './api/comment.api';
import { postApi } from './api/post.api';
import { reactionApi } from './api/reaction.api';
import { userApi } from './api/user.api';
import authReducer from './slices/auth.slice';
import commentReducer from './slices/comment.slice';
import postReducer from './slices/post.slice';
import reactionReducer from './slices/reaction.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    reactions: reactionReducer,
    comments: commentReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [reactionApi.reducerPath]: reactionApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      postApi.middleware,
      reactionApi.middleware,
      commentApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
