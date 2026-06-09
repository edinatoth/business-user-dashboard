import { useEffect, useMemo, useRef, useState } from "react";

type Formdata = {
    name: string;
    email: string;
    phone: string;
}

type AddUserModalProps = {
    onClose: () => void;
    onAdduser: (user: Formdata) => void;
}

export function AddUserModal({onClose, onAdduser}: AddUserModalProps) {
    const [formData, setFormdata] = useState({
        name: '',
        email: '',
        phone: ''
    })

    const isFormValid = useMemo(() => {
        return (
            formData.name.trim().length > 0 &&
            formData.email.includes('@') &&
            formData.phone.trim().length > 0
        );
    }, [formData]);
      const nameInputRef = useRef<HTMLInputElement | null>(null);
    const [touched, setTouched] = useState({
  name: false,
  email: false,
  phone: false,
});

function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
  const { name } = event.target;

  setTouched((prevTouched) => ({
    ...prevTouched,
    [name]: true,
  }));
}

    const error = useMemo(() => {
         return {
    name: formData.name.trim() ? '' : 'A név kötelező.',
    email: formData.email.includes('@') ? '' : 'Érvényes email cím szükséges.',
    phone: formData.phone.trim() ? '' : 'A telefonszám kötelező.',
  };
    }, [formData])

  useEffect(() => {
    nameInputRef.current.focus();
  }, [])

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFormdata((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    onAdduser(formData);
    onClose();
  }

   return (
    <div role="dialog" aria-modal="true" aria-labelledby="add-user-title">
      <h2 id="add-user-title">Add user</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
          ref={nameInputRef}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
             onBlur={handleBlur}
          />
           {touched.name && error.name && (
            <p id="name-error" role="alert">
              {error.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
             onBlur={handleBlur}
          />
           {touched.email && error.email && (
            <p id="name-error" role="alert">
              {error.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
             onBlur={handleBlur}    
          />
          {touched.phone && error.phone && (
            <p id="name-error" role="alert">
              {error.phone}
            </p>
          )}
        </div>

        <button type="submit"  disabled={!isFormValid}>
          Save
        </button>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}