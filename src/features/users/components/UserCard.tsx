import { memo } from "react";
import { type User } from "../hooks/useUsers";

type UsercardProps = {
    user: User;
    onDelete:(id: number) => void;
}

function UsercardComponent({ user, onDelete }: UsercardProps) {
    return (
        <li>
            <strong>{user.name}</strong>
             <br />
            {user.email}
            <br />
            {user.phone}
            <br />
            <button type="button" onClick={() => onDelete(user.id)}>
                Delete
            </button>
        </li>
    )
}

export const UserCard = memo(UsercardComponent);