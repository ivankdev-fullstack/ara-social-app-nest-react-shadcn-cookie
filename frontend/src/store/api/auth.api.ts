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
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: ({ query, mutation }) => ({
    getMe: query<IUser, undefined>({
      query: () => ({
        url: '/auth/me',
      }),
    }),
    login: mutation<IAuthResponse, LoginBody>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: mutation<IAuthResponse, RegisterBody>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
