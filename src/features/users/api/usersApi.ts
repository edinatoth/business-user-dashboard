import type { User } from "../types/User";
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

let users: User[] = [
{
    id: 1,
    name: 'Anna Kovács',
    email: 'anna.kovacs@example.com',
    phone: '+36 30 123 4567',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2026-06-01',
  },
  {
    id: 2,
    name: 'Péter Nagy',
    email: 'peter.nagy@example.com',
    phone: '+36 20 555 1122',
    role: 'Manager',
    status: 'Inactive',
    lastLogin: '2025-10-12',
  },
  {
    id: 3,
    name: 'Dóra Szabó',
    email: 'dora.szabo@example.com',
    phone: '+36 70 888 9911',
    role: 'User',
    status: 'Active',
    lastLogin: '2026-05-22',
  },
];

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Users'],

    endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        return { data: users };
      },
      providesTags: ['Users'],
    }),

    addUser: builder.mutation<User, Omit<User, 'id'>>({
      queryFn: async (newUser) => {
        const user: User = {
          ...newUser,
          id: Date.now(),
        };

        users = [...users, user];

        return { data: user };
      },
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation<number, number>({
      queryFn: async (userId) => {
        users = users.filter((user) => user.id !== userId);

        return { data: userId };
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
} = usersApi;
