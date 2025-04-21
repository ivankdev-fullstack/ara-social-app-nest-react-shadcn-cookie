export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
