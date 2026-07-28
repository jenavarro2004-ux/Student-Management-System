import { useState, FormEventHandler } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plus, BookOpen, School, X, Hash, UserCheck, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface Teacher {
    id: number;
    name: string;
    email: string;
}

interface CourseClass {
    id: number;
    name: string;
    code: string;
    teacher_id: number;
    created_at: string;
    teacher?: Teacher;
}

interface ClassesProps {
    classes: CourseClass[];
    teachers: Teacher[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Class Management',
        href: '/classes',
    },
];

export default function ClassesIndex({ classes, teachers }: ClassesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
    const [deletingClass, setDeletingClass] = useState<CourseClass | null>(null);

    // Create Form State
    const createForm = useForm({
        name: '',
        code: '',
        teacher_id: teachers.length > 0 ? String(teachers[0].id) : '',
    });

    // Edit Form State
    const editForm = useForm({
        name: '',
        code: '',
        teacher_id: teachers.length > 0 ? String(teachers[0].id) : '',
    });

    // Modal Controls - Create
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    // Modal Controls - Edit
    const openEditModal = (cls: CourseClass) => {
        setEditingClass(cls);
        editForm.setData({
            name: cls.name,
            code: cls.code,
            teacher_id: String(cls.teacher_id),
        });
        editForm.clearErrors();
    };

    const closeEditModal = () => {
        setEditingClass(null);
        editForm.reset();
        editForm.clearErrors();
    };

    // Modal Controls - Delete
    const openDeleteModal = (cls: CourseClass) => {
        setDeletingClass(cls);
    };

    const closeDeleteModal = () => {
        setDeletingClass(null);
    };

    // Submit Handlers
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/classes', {
            onSuccess: () => closeModal(),
        });
    };

    const handleEditSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingClass) return;
        editForm.put(`/classes/${editingClass.id}`, {
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDelete = () => {
        if (!deletingClass) return;
        router.delete(`/classes/${deletingClass.id}`, {
            onSuccess: () => closeDeleteModal(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Class Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Browse active classes, view assigned instructors, and add new course sections.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Class
                    </button>
                </div>

                {/* CLASSES GRID */}
                {classes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {classes.map((cls) => (
                            <div
                                key={cls.id}
                                className="group relative flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm transition-all hover:border-sidebar-border hover:shadow-md dark:border-sidebar-border"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-md border border-sidebar-border bg-sidebar px-2.5 py-1 text-xs font-mono font-semibold text-muted-foreground">
                                                <Hash className="h-3 w-3" />
                                                {cls.code}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(cls)}
                                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-border/50 hover:text-foreground"
                                                title="Edit Class"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(cls)}
                                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                                                title="Delete Class"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                        {cls.name}
                                    </h3>

                                    <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-sidebar-border/50 bg-sidebar/50 p-2.5 text-xs">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400">
                                            <School className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {cls.teacher?.name ?? 'Unassigned Teacher'}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {cls.teacher?.email ?? 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-sidebar-border/50 pt-3 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Active Course
                                    </span>
                                    <span>
                                        {new Date(cls.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border p-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sidebar text-muted-foreground">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold">No Classes Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new class section.</p>
                        <button
                            type="button"
                            onClick={openModal}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Add Class
                        </button>
                    </div>
                )}
            </div>

            {/* CREATE CLASS MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center justify-between border-b border-sidebar-border pb-4">
                            <h2 className="text-lg font-semibold">Add New Class</h2>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Advanced Calculus"
                                    required
                                />
                                {createForm.errors.name && <p className="mt-1 text-xs text-red-500">{createForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Class Code
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.code}
                                    onChange={(e) => createForm.setData('code', e.target.value.toUpperCase())}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. MATH-301"
                                    required
                                />
                                {createForm.errors.code && <p className="mt-1 text-xs text-red-500">{createForm.errors.code}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Assigned Teacher
                                </label>
                                <select
                                    value={createForm.data.teacher_id}
                                    onChange={(e) => createForm.setData('teacher_id', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                >
                                    {teachers.length > 0 ? (
                                        teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name} ({teacher.email})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No teachers available
                                        </option>
                                    )}
                                </select>
                                {createForm.errors.teacher_id && <p className="mt-1 text-xs text-red-500">{createForm.errors.teacher_id}</p>}
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
                                    disabled={createForm.processing || teachers.length === 0}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT CLASS MODAL */}
            {editingClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center justify-between border-b border-sidebar-border pb-4">
                            <h2 className="text-lg font-semibold">Edit Class #{editingClass.id}</h2>
                            <button onClick={closeEditModal} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Advanced Calculus"
                                    required
                                />
                                {editForm.errors.name && <p className="mt-1 text-xs text-red-500">{editForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Class Code
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.code}
                                    onChange={(e) => editForm.setData('code', e.target.value.toUpperCase())}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. MATH-301"
                                    required
                                />
                                {editForm.errors.code && <p className="mt-1 text-xs text-red-500">{editForm.errors.code}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Assigned Teacher
                                </label>
                                <select
                                    value={editForm.data.teacher_id}
                                    onChange={(e) => editForm.setData('teacher_id', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                >
                                    {teachers.length > 0 ? (
                                        teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name} ({teacher.email})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No teachers available
                                        </option>
                                    )}
                                </select>
                                {editForm.errors.teacher_id && <p className="mt-1 text-xs text-red-500">{editForm.errors.teacher_id}</p>}
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
            {deletingClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="rounded-full bg-red-100 p-2 dark:bg-red-950/50">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">Confirm Delete</h2>
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Are you sure you want to delete <span className="font-semibold text-foreground">{deletingClass.name}</span> ({deletingClass.code})? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="rounded-lg border border-sidebar-border px-4 py-2 text-sm font-medium hover:bg-sidebar/50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                            >
                                Delete Class
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}