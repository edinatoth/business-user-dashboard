import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddUserModal } from './AddUserModal';

describe('AddUserModal', () => {
  it('renders the form and focuses the name input', () => {
    render(<AddUserModal onClose={vi.fn()} onAdduser={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Felhasználó hozzáadása' })
    ).toBeVisible();
    expect(screen.getByLabelText('Név')).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Mentés' })).toBeDisabled();
  });

  it('shows validation errors after fields are touched', async () => {
    const testUser = userEvent.setup();

    render(<AddUserModal onClose={vi.fn()} onAdduser={vi.fn()} />);

    await testUser.click(screen.getByLabelText('Email'));
    await testUser.tab();

    expect(screen.getByText('Érvényes email cím szükséges.')).toBeVisible();
  });

  it('submits a valid user with default role, status and lastLogin', async () => {
    const onAdduser = vi.fn();
    const testUser = userEvent.setup();

    render(<AddUserModal onClose={vi.fn()} onAdduser={onAdduser} />);

    await testUser.type(screen.getByLabelText('Név'), 'Kiss Júlia');
    await testUser.type(screen.getByLabelText('Email'), 'julia@example.com');
    await testUser.type(screen.getByLabelText('Telefon'), '+36 30 000 1111');
    await testUser.click(screen.getByRole('button', { name: 'Mentés' }));

    expect(onAdduser).toHaveBeenCalledWith({
      name: 'Kiss Júlia',
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

    await testUser.click(screen.getByRole('button', { name: 'Mégse' }));
    await testUser.click(screen.getByRole('button', { name: 'Bezárás' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
