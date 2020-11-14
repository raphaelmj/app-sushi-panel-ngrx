import { UserPerm, UserRole } from './user';

export interface UserToken {
  id?: number;
  nick: string;
  role?: UserRole | string;
  permission?: UserPerm
  exp?: number
  accessToken?: string
  uuid?: string
}
