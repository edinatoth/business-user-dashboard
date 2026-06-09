export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin: string;
};

export type UserRole = 'Admin' | 'Manager' | 'User';

export type UserStatus = 'Active' | 'Inactive';
