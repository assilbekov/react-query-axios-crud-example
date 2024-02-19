import { axiosInstance } from "../../axios";
import { UserWithToken } from "../../models";
import type { LoginRequest } from "./types";

export const login = async (request: LoginRequest): Promise<UserWithToken> => {
  return (await axiosInstance.post('auth/login', request)).data;
}