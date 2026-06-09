import { useCallback, useMemo, useState } from 'react';
import './App.css';
import { AddUserModal } from './features/users/components/AddUserModal';
import { useDebounce } from './shared/hooks/useDebounce';
import { useUsers } from './features/users/hooks/useUsers';
import { UserCard } from './features/users/components/Usercard';

function App() {
  const {users, isLoading, errorMessage, setUsers} = useUsers();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  const filteresUser = useMemo(() => {
    return users.filter((user) => 
        user.name.toLowerCase().includes(debouncedSearch?.toLowerCase())
    );
  }, [users, debouncedSearch]);

  const handleDelete = useCallback((id: number) => {
    setUsers((prevuser) => 
      prevuser.filter((user => user.id !== id))
    );
  }, []);

const handleAddUser = useCallback(
  (newUser: { name: string; email: string; phone: string }) => {
    setUsers((prevUsers) => [
      {
        id: Date.now(),
        ...newUser,
      },
      ...prevUsers,
    ]);
  },
  [setUsers]
);

  return (
    <main>
      <h1>User Management Dashboard</h1>
      <div>
        <label htmlFor='search'>keresés név apaján</label>
        <input
          id="search"
          value={search}
          onChange={(event)=> setSearch(event.target.value)}
          placeholder='Kersés...'
        />
        <button type="button" onClick={() => setAddUserModalOpen(true)}>
           Add user
        </button>
      </div>
      <p>Users: {users.length}</p>
      <p>Filtered: {filteresUser.length}</p>
      {isLoading && <p>Betölés folyamatban...</p>}
      {errorMessage && <p role='alert'>{errorMessage}</p> }
     {!isLoading && !errorMessage && (
      <ul>
        {filteresUser.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={handleDelete}
          />
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
  )
}

export default App
