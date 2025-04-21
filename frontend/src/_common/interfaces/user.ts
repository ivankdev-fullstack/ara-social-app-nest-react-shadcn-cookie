export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  access_token: string;
  user: IUser;
}
