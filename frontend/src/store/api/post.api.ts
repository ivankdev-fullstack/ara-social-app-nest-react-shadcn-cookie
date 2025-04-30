import { envConfig } from '@/_common/config/env';
import {
  DeleteByIdData,
  DeleteByIdResponse,
  getAllPaginatedData,
  getAllPaginatedResponse,
  UpdateByIdData,
  UpdateByIdResponse,
} from '@/_common/contracts/post';
import { IPost } from '@/_common/interfaces';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postApi = createApi({
  reducerPath: 'postApi',
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
    getById: builder.query<IPost, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/posts/${id}`,
        };
      },
    }),
    getAllPaginated: builder.query<
      getAllPaginatedResponse,
      getAllPaginatedData
    >({
      query: (data) => {
        const queryParams = new URLSearchParams();

        if (data?.limit) queryParams.append('limit', data.limit.toString());
        if (data?.cursor !== null)
          queryParams.append('cursor', data.cursor || '');
        if (data?.user_id) queryParams.append('user_id', data.user_id);

        const queryString = queryParams.toString();

        return {
          url: `/posts?${queryString}`,
        };
      },
    }),
    searchPosts: builder.mutation<
      { hits: { objectID: string }[] },
      { query: string }
    >({
      query: (data) => {
        return {
          url: `/algolia/search/posts`,
          method: 'POST',
          body: data,
        };
      },
    }),
    createPost: builder.mutation<IPost, { title: string; content: string }>({
      query: (data) => {
        return {
          url: `/posts`,
          method: 'POST',
          body: data,
        };
      },
    }),
    updateById: builder.mutation<UpdateByIdResponse, UpdateByIdData>({
      query: (data) => {
        return {
          url: `/posts/${data.id}`,
          method: 'PUT',
          body: data.body,
        };
      },
    }),
    deleteById: builder.mutation<DeleteByIdResponse, DeleteByIdData>({
      query: (data) => {
        return {
          url: `/posts/${data.id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const {
  useSearchPostsMutation,
  useGetByIdQuery,
  useGetAllPaginatedQuery,
  useCreatePostMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = postApi;
