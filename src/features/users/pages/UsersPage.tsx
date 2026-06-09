import { useMemo, useState } from 'react';
import { AddUserModal } from '../components/AddUserModal';
import { UserCard } from '../components/UserCard';
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../api/usersApi';
import type { User, UserRole, UserStatus } from '../types/User';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'All'>('All');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const hasError = Boolean(error);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const matchesRole = selectedRole === 'All' || user.role === selectedRole;
      const matchesStatus =
        selectedStatus === 'All' || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, debouncedSearch, selectedRole, selectedStatus]);

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    await addUser(newUser);
    setAddUserModalOpen(false);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) {
      return;
    }

    await deleteUser(userToDelete.id);
    setUserToDelete(null);
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

        <div className="filter-field">
          <label htmlFor="role-filter">Szerepkör</label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(event.target.value as UserRole | 'All')
            }
          >
            <option value="All">Összes</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="status-filter">Státusz</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as UserStatus | 'All')
            }
          >
            <option value="All">Összes</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
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
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDelete(user)}
              />
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

      {userToDelete && (
        <div className="modal-backdrop">
          <div
            className="modal confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
          >
            <div className="confirm-modal__icon" aria-hidden="true">
              !
            </div>

            <div className="confirm-modal__content">
              <p className="eyebrow">Végleges művelet</p>
              <h2 id="delete-user-title">Törlés megerősítése</h2>
              <p>
                Biztosan törölni szeretnéd ezt a felhasználót? A művelet után
                nem fog megjelenni a listában.
              </p>

              <div className="delete-user-preview">
                <strong>{userToDelete.name}</strong>
                <span>{userToDelete.email}</span>
              </div>
            </div>

            <div className="modal__actions confirm-modal__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={() => setUserToDelete(null)}
              >
                Mégse
              </button>

              <button
                className="button button--danger button--danger-solid"
                type="button"
                onClick={confirmDelete}
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
