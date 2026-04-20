import { useUsers } from "../hooks/useUsers";
import { useAlert } from "../../tickets/hooks/useAlert";

export default function UsersTable() {
    const { users, updateRole } = useUsers();
    const alert = useAlert();

    const handleToggle = async (userId: string, currentRole: string, name: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";

        const confirm = await alert.confirm(
            newRole === "admin"
                ? `¿Dar permisos de ADMIN a ${name}? Tendrá acceso total al sistema.`
                : `¿Quitar permisos de ADMIN a ${name}?`
        );

        if (!confirm.isConfirmed) return;

        try {
            await updateRole(userId, newRole as "admin" | "user");

            alert.success("Rol actualizado correctamente");
        } catch (error) {
            alert.error("Error al actualizar rol");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
                👥 Usuarios
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">Nombre</th>
                            <th className="py-2">Correo</th>
                            <th className="py-2 text-center">Admin</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{user.name}</td>
                                <td className="py-2 text-gray-500 truncate">{user.email}</td>

                                <td className="py-2 text-center">
                                    <button
                                        onClick={() =>
                                            handleToggle(user.id, user.role, user.name)
                                        }
                                        className={`cursor-pointer p-1 bg-gray-200
                                            w-12 h-6 rounded-full transition relative
                                            ${user.role === "admin" ? "bg-green-500" : "bg-gray-300"}
                                        `}
                                    >
                                        <span
                                            className={`
                                                absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition
                                                ${user.role === "admin" ? "translate-x-6" : ""}
                                            `}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}