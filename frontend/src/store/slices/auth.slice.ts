import { IUser } from '@/_common/interfaces/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthState {
  user: IUser | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      state.user = { ...state.user!, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, updateUser, logout } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
