import { useState, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Award, Plus, BookOpen, GraduationCap, X, CheckCircle2, TrendingUp } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    email: string;
}

interface Grade {
    id: number;
    student_id: number;
    subject_name: string;
    score: number;
    letter_grade: string;
    remarks: string | null;
    created_at: string;
    student?: Student;
}

interface GradesProps {
    grades: Grade[];
    students: Student[];
    userRole: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Grades',
        href: '/grades',
    },
];

export default function GradesIndex({ grades, students, userRole }: GradesProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        student_id: students.length > 0 ? String(students[0].id) : '',
        subject_name: '',
        score: '',
        letter_grade: 'A',
        remarks: '',
    });

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        reset();
        clearErrors();
    };

    const handleScoreChange = (scoreVal: string) => {
        setData((prev) => {
            const num = parseFloat(scoreVal);
            let letter = prev.letter_grade;
            if (!isNaN(num)) {
                if (num >= 90) letter = 'A';
                else if (num >= 80) letter = 'B';
                else if (num >= 70) letter = 'C';
                else if (num >= 60) letter = 'D';
                else letter = 'F';
            }
            return {
                ...prev,
                score: scoreVal,
                letter_grade: letter,
            };
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/grades', {
            onSuccess: () => closeModal(),
        });
    };

    const isStudent = userRole === 'student';

    // Calculate GPA/Average for student report card
    const averageScore =
        grades.length > 0
            ? (grades.reduce((acc, curr) => acc + Number(curr.score), 0) / grades.length).toFixed(1)
            : 'N/A';

    const getGradeBadge = (letter: string) => {
        switch (letter.toUpperCase()) {
            case 'A':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900';
            case 'B':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900';
            case 'C':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900';
            case 'D':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900';
            default:
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isStudent ? 'My Report Card' : 'Student Grades'} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isStudent ? 'My Academic Report Card' : 'Student Grades Management'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isStudent
                                ? 'View your academic performance, subject scores, and teacher feedback.'
                                : 'Submit and manage student subject grades and academic remarks.'}
                        </p>
                    </div>

                    {!isStudent && (
                        <button
                            type="button"
                            onClick={openModal}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Record Grade
                        </button>
                    )}
                </div>

                {/* STUDENT STATS CARD */}
                {isStudent && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">Total Subjects</p>
                                <p className="text-2xl font-bold">{grades.length}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">Average Score</p>
                                <p className="text-2xl font-bold">{averageScore}%</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Good Standing</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* GRADES TABLE */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-sidebar/80 text-xs uppercase text-muted-foreground dark:border-sidebar-border">
                                <tr>
                                    {!isStudent && <th className="px-6 py-3.5 font-semibold">Student</th>}
                                    <th className="px-6 py-3.5 font-semibold">Subject</th>
                                    <th className="px-6 py-3.5 font-semibold">Score (%)</th>
                                    <th className="px-6 py-3.5 font-semibold">Grade</th>
                                    <th className="px-6 py-3.5 font-semibold">Remarks</th>
                                    <th className="px-6 py-3.5 font-semibold">Date Recorded</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {grades.length > 0 ? (
                                    grades.map((grade) => (
                                        <tr key={grade.id} className="transition-colors hover:bg-sidebar/40">
                                            {!isStudent && (
                                                <td className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                            <GraduationCap className="h-3.5 w-3.5" />
                                                        </div>
                                                        <div>
                                                            <p>{grade.student?.name ?? 'Unknown Student'}</p>
                                                            <p className="text-xs font-normal text-muted-foreground">
                                                                {grade.student?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    {grade.subject_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm font-semibold">
                                                {grade.score}%
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold ${getGradeBadge(grade.letter_grade)}`}
                                                >
                                                    {grade.letter_grade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {grade.remarks || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {new Date(grade.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={isStudent ? 5 : 6}
                                            className="px-6 py-8 text-center text-muted-foreground"
                                        >
                                            No grades recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RECORD GRADE MODAL FOR TEACHER/ADMIN */}
            {!isStudent && isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-background p-6 shadow-xl dark:border-sidebar-border">
                        <div className="flex items-center justify-between border-b border-sidebar-border pb-4">
                            <h2 className="text-lg font-semibold">Record Student Grade</h2>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Student
                                </label>
                                <select
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                >
                                    {students.length > 0 ? (
                                        students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.name} ({student.email})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No students found
                                        </option>
                                    )}
                                </select>
                                {errors.student_id && <p className="mt-1 text-xs text-red-500">{errors.student_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    value={data.subject_name}
                                    onChange={(e) => setData('subject_name', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Mathematics 101"
                                    required
                                />
                                {errors.subject_name && <p className="mt-1 text-xs text-red-500">{errors.subject_name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                        Score (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.score}
                                        onChange={(e) => handleScoreChange(e.target.value)}
                                        className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="85.5"
                                        required
                                    />
                                    {errors.score && <p className="mt-1 text-xs text-red-500">{errors.score}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                        Letter Grade
                                    </label>
                                    <select
                                        value={data.letter_grade}
                                        onChange={(e) => setData('letter_grade', e.target.value)}
                                        className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="A">A (90-100%)</option>
                                        <option value="B">B (80-89%)</option>
                                        <option value="C">C (70-79%)</option>
                                        <option value="D">D (60-69%)</option>
                                        <option value="F">F (&lt;60%)</option>
                                    </select>
                                    {errors.letter_grade && <p className="mt-1 text-xs text-red-500">{errors.letter_grade}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                                    Remarks / Feedback
                                </label>
                                <input
                                    type="text"
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Outstanding exam results"
                                />
                                {errors.remarks && <p className="mt-1 text-xs text-red-500">{errors.remarks}</p>}
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
                                    disabled={processing || students.length === 0}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Save Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}