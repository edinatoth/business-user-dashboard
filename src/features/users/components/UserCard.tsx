import { memo } from 'react';
import type { User } from '../types/User';

type UserCardProps = {
  user: User;
  onDelete: (id: number) => void;
};

function UserCardComponent({ user, onDelete }: UserCardProps) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="user-card">
      <div className="user-card__header">
        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.role}</p>
        </div>
        <span
          className={`status-badge ${
            user.status === 'Active' ? 'status-badge--active' : ''
          }`}
        >
          {user.status}
        </span>
      </div>

      <dl className="user-card__details">
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Telefon</dt>
          <dd>{user.phone}</dd>
        </div>
        <div>
          <dt>Utolsó belépés</dt>
          <dd>{user.lastLogin}</dd>
        </div>
      </dl>

      <button
        className="button button--danger"
        type="button"
        onClick={() => onDelete(user.id)}
      >
        Törlés
      </button>
    </li>
  );
}

export const UserCard = memo(UserCardComponent);
