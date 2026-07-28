import { useState, FormEventHandler } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { UserPlus, Shield, GraduationCap, School, X, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface UsersProps {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function UsersIndex({ users }: UsersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const createForm = useForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
    });

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
        editForm.clearErrors();
    };

    const closeEditModal = () => {
        setEditingUser(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const openDeleteModal = (user: User) => {
        setDeletingUser(user);
    };

    const closeDeleteModal = () => {
        setDeletingUser(null);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/users', {
            onSuccess: () => closeModal(),
        });
    };

    const handleEditSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingUser) return;

        // If password is empty, don't send it to avoid password reset bugs on backend
        editForm.transform((data) => ({
            ...data,
            password: data.password || undefined,
        }));

        editForm.put(`/users/${editingUser.id}`, {
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDelete = () => {
        if (!deletingUser) return;
        setIsDeleting(true);
        router.delete(`/users/${deletingUser.id}`, {
            onSuccess: () => closeDeleteModal(),
            onFinish: () => setIsDeleting(false),
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900">
                        <Shield className="h-3 w-3" /> Admin
                    </span>
                );
            case 'teacher':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900">
                        <School className="h-3 w-3" /> Teacher
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900">
                        <GraduationCap className="h-3 w-3" /> Student
                    </span>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            View, add, and manage user accounts across the system.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add New User
                    </button>
                </div>

                {/* USERS TABLE */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card overflow-hidden shadow-sm dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-sidebar/80 border-b border-sidebar-border/70 text-xs uppercase text-muted-foreground dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-3.5 font-semibold">ID</th>
                                    <th className="px-6 py-3.5 font-semibold">Name</th>
                                    <th className="px-6 py-3.5 font-semibold">Email</th>
                                    <th className="px-6 py-3.5 font-semibold">Role</th>
                                    <th className="px-6 py-3.5 font-semibold">Created At</th>
                                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-sidebar/40 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                #{user.id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold">{user.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                            <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(user)}
                                                        className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-border/50 hover:text-foreground transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(user)}
                                                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No users found in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CREATE USER MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center justify-between pb-4 border-b border-sidebar-border">
                            <h2 className="text-lg font-semibold">Add New User</h2>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Jane Doe"
                                    required
                                />
                                {createForm.errors.name && <p className="text-xs text-red-500 mt-1">{createForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="jane@example.com"
                                    required
                                />
                                {createForm.errors.email && <p className="text-xs text-red-500 mt-1">{createForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Role
                                </label>
                                <select
                                    value={createForm.data.role}
                                    onChange={(e) => createForm.setData('role', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {createForm.errors.role && <p className="text-xs text-red-500 mt-1">{createForm.errors.role}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="••••••••"
                                    required
                                />
                                {createForm.errors.password && <p className="text-xs text-red-500 mt-1">{createForm.errors.password}</p>}
                            </div>

                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-sidebar-border px-4 py-2 text-sm font-medium hover:bg-sidebar/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT USER MODAL */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center justify-between pb-4 border-b border-sidebar-border">
                            <h2 className="text-lg font-semibold">Edit User #{editingUser.id}</h2>
                            <button onClick={closeEditModal} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Jane Doe"
                                    required
                                />
                                {editForm.errors.name && <p className="text-xs text-red-500 mt-1">{editForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="jane@example.com"
                                    required
                                />
                                {editForm.errors.email && <p className="text-xs text-red-500 mt-1">{editForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Role
                                </label>
                                <select
                                    value={editForm.data.role}
                                    onChange={(e) => editForm.setData('role', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {editForm.errors.role && <p className="text-xs text-red-500 mt-1">{editForm.errors.role}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase text-muted-foreground mb-1">
                                    Password <span className="text-xs text-muted-foreground lowercase">(leave blank to keep current)</span>
                                </label>
                                <input
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={(e) => editForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="••••••••"
                                />
                                {editForm.errors.password && <p className="text-xs text-red-500 mt-1">{editForm.errors.password}</p>}
                            </div>

                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-lg border border-sidebar-border px-4 py-2 text-sm font-medium hover:bg-sidebar/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION DIALOG */}
            {deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="rounded-full bg-red-100 p-2 dark:bg-red-950/50">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">Confirm Delete</h2>
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Are you sure you want to delete <span className="font-semibold text-foreground">{deletingUser.name}</span> ({deletingUser.email})? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="rounded-lg border border-sidebar-border px-4 py-2 text-sm font-medium hover:bg-sidebar/50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}