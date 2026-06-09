import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '../types/User';
import { UsersPage } from './UsersPage';

const mocks = vi.hoisted(() => ({
  users: [
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
  ] satisfies User[],
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  handleGenerateAiSummary: vi.fn(),
}));

vi.mock('../api/usersApi', () => ({
  useGetUsersQuery: () => ({
    data: mocks.users,
    isLoading: false,
    error: null,
  }),
  useAddUserMutation: () => [mocks.addUser],
  useDeleteUserMutation: () => [mocks.deleteUser],
}));

vi.mock('../hooks/useAiUserSummary', () => ({
  useAiUserSummary: () => ({
    handleGenerateAiSummary: mocks.handleGenerateAiSummary,
    aiSummary: 'Aktív felhasználók rendben vannak.',
    isAiLoading: false,
    aiError: '',
  }),
}));

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deleteUser.mockResolvedValue(undefined);
  });

  it('renders users and dashboard statistics', () => {
    render(<UsersPage />);

    expect(
      screen.getByRole('heading', {
        name: 'Business User Management Dashboard',
      })
    ).toBeVisible();
    expect(screen.getByText('Összes felhasználó')).toBeVisible();
    expect(screen.getByText('Találatok')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Anna Kovács' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Péter Nagy' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Dóra Szabó' })).toBeVisible();
  });

  it('filters users by role and status', async () => {
    const testUser = userEvent.setup();

    render(<UsersPage />);

    await testUser.selectOptions(screen.getByLabelText('Szerepkör'), 'Manager');

    expect(screen.getByRole('heading', { name: 'Péter Nagy' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Anna Kovács' })).not.toBeInTheDocument();

    await testUser.selectOptions(screen.getByLabelText('Státusz'), 'Active');

    expect(screen.getByText('Nincs találat erre a keresésre.')).toBeVisible();
  });

  it('calls AI summary generation from the hero button', async () => {
    const testUser = userEvent.setup();

    render(<UsersPage />);

    await testUser.click(screen.getByRole('button', { name: 'AI elemzés' }));

    expect(mocks.handleGenerateAiSummary).toHaveBeenCalledTimes(1);
  });

  it('asks for confirmation before deleting a user', async () => {
    const testUser = userEvent.setup();

    render(<UsersPage />);

    await testUser.click(screen.getAllByRole('button', { name: 'Törlés' })[0]);

    const dialog = screen.getByRole('dialog', {
      name: 'Törlés megerősítése',
    });

    expect(within(dialog).getByText('Anna Kovács')).toBeVisible();

    await testUser.click(within(dialog).getByRole('button', { name: 'Törlés' }));

    expect(mocks.deleteUser).toHaveBeenCalledWith(1);
  });
});
