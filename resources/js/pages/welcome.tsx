import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Student Management System" />
            <div className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
                {/* Header Navigation */}
                <header className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        {/* Minimalist Logo */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-lg">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">SMS</span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>

                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex-1">
                    <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-32">
                        <div className="mx-auto max-w-3xl">

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                                Student Management System
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                                An all-in-one management platform for academic progress, attendance tracking, grading, and campus communication—built with simplicity in mind.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>

                                        <Link
                                            href={login()}
                                            className="rounded-full border border-neutral-300 px-8 py-3.5 text-base font-semibold text-black transition hover:border-black dark:border-neutral-800 dark:text-white dark:hover:border-white"
                                        >
                                            Portal Login
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
                            <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                                    🎓
                                </div>
                                <h3 className="text-lg font-bold">Student Records</h3>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Manage enrollments, personal profiles, and academic histories effortlessly.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                                    📊
                                </div>
                                <h3 className="text-lg font-bold">Grades & Attendance</h3>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Real-time tracking for attendance records, report cards, and GPA metrics.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800 sm:col-span-2 lg:col-span-1">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                                    💬
                                </div>
                                <h3 className="text-lg font-bold">Communication</h3>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Keep teachers, students, and parents aligned with announcements and notifications.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200 py-8 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <p>&copy; {new Date().getFullYear()} Student Management System. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
