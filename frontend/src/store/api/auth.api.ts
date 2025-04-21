import { envConfig } from '@/_common/config/env';
import { IAuthResponse, IUser } from '@/_common/interfaces/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, LoginBody>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<IAuthResponse, RegisterBody>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => '/auth/logout',
    }),
    getMe: builder.query<IUser, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
