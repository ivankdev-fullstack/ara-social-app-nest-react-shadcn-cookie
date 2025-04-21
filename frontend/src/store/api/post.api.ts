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
    credentials: 'include',
  }),
  endpoints: (builder) => ({
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
  useGetAllPaginatedQuery,
  useCreatePostMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = postApi;
