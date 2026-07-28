import { Head, Link, usePage } from '@inertiajs/react';
import { Users, UserPlus, BookOpen, ShieldCheck, Activity, ArrowUpRight, GraduationCap, FileText } from 'lucide-react';
import { dashboard } from '@/routes';

interface Stats {
    totalUsers: number;
    totalTeachers: number;
    totalStudents: number;
}

interface PageProps {
    stats: Stats;
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function Dashboard({ stats }: { stats: Stats }) {
    const { auth } = usePage().props as unknown as PageProps;
    const user = auth?.user;
    const role = user?.role;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">

                {/* WELCOME BANNER */}
                <div className="relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-sidebar/50 p-6 dark:border-sidebar-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}! 👋</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Role: <span className="font-semibold uppercase tracking-wider text-primary">{role}</span>
                            </p>
                        </div>
                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* ADMIN STATS */}
                {role === 'admin' && (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-muted-foreground text-sm">Total Users</h3>
                                <Users className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="text-3xl font-bold mt-3">{stats?.totalUsers ?? 0}</p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-muted-foreground text-sm">Active Teachers</h3>
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="text-3xl font-bold mt-3">{stats?.totalTeachers ?? 0}</p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-muted-foreground text-sm">Enrolled Students</h3>
                                <BookOpen className="h-4 w-4 text-purple-500" />
                            </div>
                            <p className="text-3xl font-bold mt-3">{stats?.totalStudents ?? 0}</p>
                        </div>
                    </div>
                )}

                {/* TEACHER STATS */}
                {role === 'teacher' && (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-muted-foreground text-sm">Assigned Classes</h3>
                                <BookOpen className="h-4 w-4 text-blue-500" />
                            </div>

                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-muted-foreground text-sm">Pending Submissions</h3>
                                <FileText className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="text-3xl font-bold mt-3"></p>
                        </div>
                    </div>
                )}

                {/* BOTTOM SECTION: QUICK ACTIONS & ACTIVITY */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                        <h3 className="text-base font-semibold">Quick Actions</h3>
                        <p className="text-xs text-muted-foreground mt-1">Frequently used shortcuts</p>

                        <div className="mt-4 grid gap-3">
                            {role === 'admin' && (
                                <Link
                                    href="/users"
                                    className="flex items-center justify-between rounded-xl border border-sidebar-border/70 p-3.5 text-sm font-medium transition hover:bg-sidebar/50 dark:border-sidebar-border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-sidebar p-2 text-foreground">
                                            <UserPlus className="h-4 w-4" />
                                        </div>
                                        <span>Manage User Accounts</span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-card shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold">System Activity</h3>
                                <p className="text-xs text-muted-foreground mt-1">Latest platform events</p>
                            </div>
                            <div className="rounded-lg bg-sidebar p-2 text-foreground">
                                <Activity className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <div>
                                    <p className="font-medium text-sm">Session active</p>
                                    <p className="text-xs text-muted-foreground">Connected to PostgreSQL</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                <div>
                                    <p className="font-medium text-sm">Portal synchronized</p>
                                    <p className="text-xs text-muted-foreground">Up to date</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
