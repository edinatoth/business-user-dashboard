import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AiSummary, User } from '../types/User';
import { UsersPage } from './UsersPage';

const mocks = vi.hoisted(() => ({
  users: [
    {
      id: 1,
      name: 'Anna Smith',
      email: 'anna.smith@example.com',
      phone: '+36 30 123 4567',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2026-06-01',
    },
    {
      id: 2,
      name: 'Peter Brown',
      email: 'peter.brown@example.com',
      phone: '+36 20 555 1122',
      role: 'Manager',
      status: 'Inactive',
      lastLogin: '2025-10-12',
    },
    {
      id: 3,
      name: 'Dora Johnson',
      email: 'dora.johnson@example.com',
      phone: '+36 70 888 9911',
      role: 'User',
      status: 'Active',
      lastLogin: '2026-05-22',
    },
  ] satisfies User[],
  summary: {
    overview: 'The user base is in a healthy state.',
    stats: {
      totalUsers: 3,
      activeUsers: 2,
      inactiveUsers: 1,
      adminUsers: 1,
      managerUsers: 1,
      standardUsers: 1,
    },
    riskLevel: 'Low',
    risks: ['One inactive manager was found.'],
    recommendations: [
      'Review Peter Brown permissions.',
      'Keep admin access up to date.',
    ],
  } satisfies AiSummary,
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
    aiSummary: mocks.summary,
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
    expect(screen.getByText('Total Users')).toBeVisible();
    expect(screen.getByText('Matches')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Anna Smith' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Peter Brown' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Dora Johnson' })).toBeVisible();
  });

  it('renders AI recommendations as readable cards', () => {
    render(<UsersPage />);

    expect(screen.getByRole('heading', { name: 'User Recommendations' })).toBeVisible();
    expect(screen.getByText('Review Peter Brown permissions.')).toBeVisible();
    expect(screen.getByText('Keep admin access up to date.')).toBeVisible();
  });

  it('filters users by role and status', async () => {
    const testUser = userEvent.setup();

    render(<UsersPage />);

    await testUser.selectOptions(screen.getByLabelText('Role'), 'Manager');

    expect(screen.getByRole('heading', { name: 'Peter Brown' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Anna Smith' })).not.toBeInTheDocument();

    await testUser.selectOptions(screen.getByLabelText('Status'), 'Active');

    expect(screen.getByText('No users match the current filters.')).toBeVisible();
  });

  it('calls AI summary generation from the hero button', async () => {
    const testUser = userEvent.setup();

    render(<UsersPage />);

    await testUser.click(screen.getByRole('button', { name: 'AI Analysis' }));

    expect(mocks.handleGenerateAiSummary).toHaveBeenCalledTimes(1);
  });

  it('asks for confirmation before deleting a user', async () => {
    const testUser = userEvent.setup();

    render(<UsersPage />);

    await testUser.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    const dialog = screen.getByRole('dialog', {
      name: 'Confirm Deletion',
    });

    expect(within(dialog).getByText('Anna Smith')).toBeVisible();

    await testUser.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteUser).toHaveBeenCalledWith(1);
  });
});
