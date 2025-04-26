import { envConfig } from '@/_common/config/env';
import { IUser } from '@/_common/interfaces/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface UpdateByIdData {
  id: string;
  data: Partial<IUser>;
}

export const userApi = createApi({
  reducerPath: 'userApi',
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
    getById: builder.query<IUser, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),
    uploadAvatar: builder.mutation<
      { url: string },
      { id: string; avatar_url: string }
    >({
      query: (data) => {
        return {
          url: `/users/${data.id}/upload-avatar`,
          method: 'POST',
          body: data,
        };
      },
    }),
    updateById: builder.mutation<boolean, UpdateByIdData>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteById: builder.mutation<boolean, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetByIdQuery,
  useUploadAvatarMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = userApi;
