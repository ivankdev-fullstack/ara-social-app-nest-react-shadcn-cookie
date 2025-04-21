import { envConfig } from '@/_common/config/env';
import {
  CommentGetAllByTargetData,
  CommentGetAllByTargetResponse,
} from '@/_common/contracts/comment/comment.getAllByTarget';
import { TargetType } from '@/_common/interfaces';
import { IComment } from '@/_common/interfaces/comment';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getAllPaginated: builder.query<
      CommentGetAllByTargetResponse,
      CommentGetAllByTargetData
    >({
      query: (data) => {
        const { target_id, target_type } = data.params;
        const queryParams = new URLSearchParams();

        if (data?.query?.limit)
          queryParams.append('limit', data.query.limit.toString());
        if (data?.query?.cursor !== null)
          queryParams.append('cursor', data.query.cursor || '');

        const queryString = queryParams.toString();

        return {
          url: `/comments/by-target/${target_type}/${target_id}?${queryString}`,
        };
      },
    }),
    create: builder.mutation<
      IComment,
      { content: string; target_id: string; target_type: TargetType }
    >({
      query: (data) => {
        return {
          url: `/comments/`,
          method: 'POST',
          body: data,
        };
      },
    }),
    updateById: builder.mutation<
      IComment,
      { id: string; body: { content: string } }
    >({
      query: (data) => {
        return {
          url: `/comments/${data.id}`,
          method: 'PUT',
          body: data.body,
        };
      },
    }),
    deleteById: builder.mutation<boolean, { id: string }>({
      query: (data) => {
        return {
          url: `/comments/${data.id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const {
  useLazyGetAllPaginatedQuery,
  useCreateMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = commentApi;
