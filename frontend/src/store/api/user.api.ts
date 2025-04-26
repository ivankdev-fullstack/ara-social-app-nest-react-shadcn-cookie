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
    uploadAvatar: builder.mutation<{ url: string }, { id: string; file: File }>(
      {
        query: ({ id, file }) => {
          const formData = new FormData();
          formData.append('file', file);

          return {
            url: `/users/${id}/upload-avatar`,
            method: 'POST',
            body: formData,
            // headers: {
            //   'Content-Type': 'multipart/form-data', // Это можно не указывать, так как fetch сам определяет правильный заголовок для FormData
            // },
          };
        },
      },
    ),
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
