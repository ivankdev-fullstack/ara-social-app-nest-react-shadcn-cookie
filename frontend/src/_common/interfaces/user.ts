export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  token: string;
}
