import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { User } from '../types/User';
import { UserCard } from './UserCard';

const user: User = {
  id: 42,
  name: 'Anna Kovács',
  email: 'anna.kovacs@example.com',
  phone: '+36 30 123 4567',
  role: 'Admin',
  status: 'Active',
  lastLogin: '2026-06-01',
};

describe('UserCard', () => {
  it('renders user details', () => {
    render(<UserCard user={user} onDelete={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Anna Kovács' })).toBeVisible();
    expect(screen.getByText('AK')).toBeVisible();
    expect(screen.getByText('Admin')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('anna.kovacs@example.com')).toBeVisible();
    expect(screen.getByText('+36 30 123 4567')).toBeVisible();
    expect(screen.getByText('2026-06-01')).toBeVisible();
  });

  it('calls onDelete with the user id', async () => {
    const onDelete = vi.fn();
    const testUser = userEvent.setup();

    render(<UserCard user={user} onDelete={onDelete} />);

    await testUser.click(screen.getByRole('button', { name: 'Törlés' }));

    expect(onDelete).toHaveBeenCalledWith(42);
  });
});
