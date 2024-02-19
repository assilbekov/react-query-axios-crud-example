import { axiosInstance } from "../../axios";
import { Post } from "../../models";
import { CreatePostRequest, ListPostsResponse, SearchPostsRequest } from "./types";


export const getPosts = async (): Promise<ListPostsResponse> => {
  return (await axiosInstance.get("auth/posts")).data;
}

export const searchPosts = async (request: SearchPostsRequest): Promise<ListPostsResponse> => {
  return (await axiosInstance.get(`auth/posts?skip=${request.skip}&limit=${request.limit}`)).data;
}

export const getPost = async (id: number): Promise<Post> => {
  return (await axiosInstance.get(`auth/posts/${id}`)).data;
}

export const createPost = async (request: CreatePostRequest): Promise<Post> => {
  return (await axiosInstance.post(`auth/posts/add`, request)).data;
}

export const updatePost = async (post: Post): Promise<Post> => {
  return (await axiosInstance.put(`auth/posts/${post.id}`, post)).data;
}

export const deletePost = async (id: number): Promise<void> => {
  return await axiosInstance.delete(`auth/posts/${id}`);
}