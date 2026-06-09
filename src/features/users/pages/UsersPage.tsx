import { useMemo, useState } from 'react';
import { AddUserModal } from '../components/AddUserModal';
import { AiSummaryCard } from '../components/AiSummaryCard';
import { AiSummaryErrorBoundary } from '../components/AiSummaryErrorBoundary';
import { UserCard } from '../components/UserCard';
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../api/usersApi';
import { useAiUserSummary } from '../hooks/useAiUserSummary';
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

  const { handleGenerateAiSummary, aiSummary, isAiLoading, aiError } =
    useAiUserSummary(filteredUsers);

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
          <p className="eyebrow">User Management</p>
          <h1>Business User Management Dashboard</h1>
          <p className="dashboard__lead">
            A clean dashboard for browsing, filtering, and managing business
            users with fast operational insight.
          </p>
        </div>

        <div className="hero-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={() => setAddUserModalOpen(true)}
          >
            + Add User
          </button>

          <button
            className="button button--secondary"
            type="button"
            onClick={handleGenerateAiSummary}
            disabled={isAiLoading || filteredUsers.length === 0}
          >
            {isAiLoading ? 'Generating AI analysis...' : 'AI Analysis'}
          </button>
        </div>
      </section>

      <section className="toolbar" aria-label="Filter users">
        <div className="search-field">
          <label htmlFor="search">Search by name</label>
          <input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="e.g. Anna Smith"
          />
        </div>

        <div className="filter-field">
          <label htmlFor="role-filter">Role</label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(event.target.value as UserRole | 'All')
            }
          >
            <option value="All">All</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as UserStatus | 'All')
            }
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="stats">
          <div className="stat">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat">
            <span>Matches</span>
            <strong>{filteredUsers.length}</strong>
          </div>
        </div>
      </section>

      {aiError && (
        <p className="state-message state-message--error" role="alert">
          {aiError}
        </p>
      )}

      {aiSummary && (
        <AiSummaryErrorBoundary>
          <AiSummaryCard summary={aiSummary} />
        </AiSummaryErrorBoundary>
      )}

      {isLoading && <p className="state-message">Loading users...</p>}

      {hasError && (
        <p className="state-message state-message--error" role="alert">
          Could not load users.
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
          <p className="state-message">No users match the current filters.</p>
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
              <p className="eyebrow">Permanent Action</p>
              <h2 id="delete-user-title">Confirm Deletion</h2>
              <p>
                Are you sure you want to delete this user? They will no longer
                appear in the list after this action.
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
                Cancel
              </button>

              <button
                className="button button--danger button--danger-solid"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
