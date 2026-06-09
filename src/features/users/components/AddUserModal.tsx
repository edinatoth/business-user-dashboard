import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '../types/User';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

type AddUserModalProps = {
  onClose: () => void;
  onAdduser: (user: Omit<User, 'id'>) => void;
};

export function AddUserModal({ onClose, onAdduser }: AddUserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const errors = useMemo(() => {
    return {
      name: formData.name.trim() ? '' : 'A név kötelező.',
      email: formData.email.includes('@') ? '' : 'Érvényes email cím szükséges.',
      phone: formData.phone.trim() ? '' : 'A telefonszám kötelező.',
    };
  }, [formData]);

  const isFormValid = useMemo(() => {
    return Object.values(errors).every((error) => error === '');
  }, [errors]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const { name } = event.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setTouched({ name: true, email: true, phone: true });
      return;
    }

    onAdduser({
      ...formData,
      role: 'User',
      status: 'Active',
      lastLogin: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
      >
        <div className="modal__header">
          <div>
            <p className="eyebrow">Új rekord</p>
            <h2 id="add-user-title">Felhasználó hozzáadása</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Bezárás"
          >
            ×
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Név</label>
            <input
              ref={nameInputRef}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Pl. Kiss Júlia"
            />
            {touched.name && errors.name && <p role="alert">{errors.name}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="julia@example.com"
            />
            {touched.email && errors.email && <p role="alert">{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+36 30 123 4567"
            />
            {touched.phone && errors.phone && <p role="alert">{errors.phone}</p>}
          </div>

          <div className="modal__actions">
            <button className="button button--ghost" type="button" onClick={onClose}>
              Mégse
            </button>
            <button className="button button--primary" type="submit" disabled={!isFormValid}>
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
