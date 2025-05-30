import { envConfig } from '@/_common/config/env';
import {
  ReactionToggleData,
  ReactionToggleResponse,
} from '@/_common/contracts/reaction';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reactionApi = createApi({
  reducerPath: 'reactionApi',
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
  endpoints: (builder) => ({
    toggle: builder.mutation<ReactionToggleResponse, ReactionToggleData>({
      query: (data) => {
        return {
          url: `/reactions/toggle`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const { useToggleMutation } = reactionApi;
