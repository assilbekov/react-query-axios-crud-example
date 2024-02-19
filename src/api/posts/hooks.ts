import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, searchPosts, getPost, createPost, updatePost, deletePost } from "./apis"
import type { SearchPostsRequest, ListPostsResponse, CreatePostRequest } from "./types";
import { Post } from "../../models";


export const useGetPostsQuery = () => useQuery({
  queryKey: ["posts", { type: "list" }],
  queryFn: getPosts,
})

export const useSearchPostsQuery = (request: SearchPostsRequest) => useQuery({
  queryKey: ["posts", { type: "search", request }],
  queryFn: async () => searchPosts(request),
})

export const useGetPostQuery = (id: number) => useQuery({
  queryKey: ["posts", { id }],
  queryFn: async () => getPost(id),
})

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePostRequest) => createPost(request),
    onMutate: async (_request) => {
      // Do something before the mutation
    },
    onSuccess: (newPost) => {
      // https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses.
      // Prevent wasting a network call. Updates from Mutation Responses
      queryClient.setQueryData(['posts', { id: newPost.id }], newPost);
      queryClient.setQueryData(['posts', { type: 'list' }], (oldData: ListPostsResponse) => ({
        // Make sure to update in an immutable way.
        // https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses#immutability.
        ...oldData,
        posts: [newPost, ...oldData.posts],
      }));
    },
    onError: (_error) => {
      // Do something if the mutation fails
    },
  });
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Post) => updatePost(post),
    onMutate: async (_request) => {
      // Do something before the mutation
    },
    onSuccess: (newPost) => {
      // https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations.
      // Invalidate data from the cache and make a new network request to refecth the data.
      queryClient.invalidateQueries({ queryKey: ['posts', { id: newPost.id }] });
      queryClient.invalidateQueries({ queryKey: ['posts', { type: "list" }] });
    },
    onError: (_error) => {
      // Do something if the mutation fails
    },
  });
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onMutate: async (_request) => {
      // Do something before the mutation
    },
    onSuccess: (_result, postId) => {
      // Prevent wasting a network call. Updates from Mutation Responses
      queryClient.setQueryData(['posts', { postId }], undefined);
      queryClient.setQueryData(['posts', { type: 'list' }], (oldData: ListPostsResponse) => ({
        // Make sure to update in an immutable way.
        // https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses#immutability.
        ...oldData,
        posts: oldData.posts.filter((post) => post.id !== postId),
      }));
    },
    onError: (_error) => {
      // Do something if the mutation fails
    },
  });
}
