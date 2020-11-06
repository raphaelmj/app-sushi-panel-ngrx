export enum UserRole {
  waiter = 'waiter',
  admin = 'admin',
}
export enum UserPerm {
  super = 'superadmin',
  normal = 'normal',
}
export interface User {
  id?: number;
  nick: string;
  password?: string
  status: boolean
  role?: UserRole | string;
  permission?: UserPerm
}
