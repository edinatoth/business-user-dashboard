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
  const hasError = Boolean(error);

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
    <main className="dashboard">
      <section className="dashboard__hero">
        <div>
          <p className="eyebrow">Felhasználókezelés</p>
          <h1>Business User Management Dashboard</h1>
          <p className="dashboard__lead">
            Áttekinthető lista, gyors keresés és egyszerű felhasználókezelés egy
            letisztult felületen.
          </p>
        </div>

        <button
          className="button button--primary"
          type="button"
          onClick={() => setAddUserModalOpen(true)}
        >
          + Új felhasználó
        </button>
      </section>

      <section className="toolbar" aria-label="Felhasználók szűrése">
        <div className="search-field">
          <label htmlFor="search">Keresés név alapján</label>
          <input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pl. Anna Kovács"
          />
        </div>

        <div className="stats">
          <div className="stat">
            <span>Összes felhasználó</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat">
            <span>Találatok</span>
            <strong>{filteredUsers.length}</strong>
          </div>
        </div>
      </section>

      {isLoading && <p className="state-message">Betöltés folyamatban...</p>}

      {hasError && (
        <p className="state-message state-message--error" role="alert">
          Hiba történt a felhasználók betöltésekor.
        </p>
      )}

      {!isLoading &&
        !hasError &&
        (filteredUsers.length > 0 ? (
          <ul className="user-grid">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} />
            ))}
          </ul>
        ) : (
          <p className="state-message">Nincs találat erre a keresésre.</p>
        ))}

      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setAddUserModalOpen(false)}
          onAdduser={handleAddUser}
        />
      )}
    </main>
  );
}
