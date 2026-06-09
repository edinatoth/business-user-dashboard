import { useMemo, useState } from 'react';
import { AddUserModal } from '../components/AddUserModal';
import { UserCard } from '../components/UserCard';
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../api/usersApi';
import type { User } from '../types/User';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [users, debouncedSearch]);

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    await addUser(newUser);
    setAddUserModalOpen(false);
  };

  const handleDelete = async (userId: number) => {
    await deleteUser(userId);
  };

  return (
    <main>
      <h1>Business User Management Dashboard</h1>

      <div>
        <label htmlFor="search">Keresés név alapján</label>
        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Keresés..."
        />

        <button type="button" onClick={() => setAddUserModalOpen(true)}>
          Add user
        </button>
      </div>

      <p>Users: {users.length}</p>
      <p>Filtered: {filteredUsers.length}</p>

      {isLoading && <p>Betöltés folyamatban...</p>}

      {error && <p role="alert">Hiba történt a felhasználók betöltésekor.</p>}

      {!isLoading && !error && (
        <ul>
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onDelete={handleDelete} />
          ))}
        </ul>
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setAddUserModalOpen(false)}
          onAdduser={handleAddUser}
        />
      )}
    </main>
  );
}