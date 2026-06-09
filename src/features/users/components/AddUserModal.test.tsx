import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddUserModal } from './AddUserModal';

describe('AddUserModal', () => {
  it('renders the form and focuses the name input', () => {
    render(<AddUserModal onClose={vi.fn()} onAdduser={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Add User' })).toBeVisible();
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('shows validation errors after fields are touched', async () => {
    const testUser = userEvent.setup();

    render(<AddUserModal onClose={vi.fn()} onAdduser={vi.fn()} />);

    await testUser.click(screen.getByLabelText('Email'));
    await testUser.tab();

    expect(screen.getByText('A valid email address is required.')).toBeVisible();
  });

  it('submits a valid user with default role, status and lastLogin', async () => {
    const onAdduser = vi.fn();
    const testUser = userEvent.setup();

    render(<AddUserModal onClose={vi.fn()} onAdduser={onAdduser} />);

    await testUser.type(screen.getByLabelText('Name'), 'Julia Smith');
    await testUser.type(screen.getByLabelText('Email'), 'julia@example.com');
    await testUser.type(screen.getByLabelText('Phone'), '+36 30 000 1111');
    await testUser.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdduser).toHaveBeenCalledWith({
      name: 'Julia Smith',
      email: 'julia@example.com',
      phone: '+36 30 000 1111',
      role: 'User',
      status: 'Active',
      lastLogin: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });

  it('calls onClose when cancel or close is clicked', async () => {
    const onClose = vi.fn();
    const testUser = userEvent.setup();

    render(<AddUserModal onClose={onClose} onAdduser={vi.fn()} />);

    await testUser.click(screen.getByRole('button', { name: 'Cancel' }));
    await testUser.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
