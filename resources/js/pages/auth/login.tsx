import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen flex-col bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
                {/* Header Navigation */}
                <header className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-lg font-bold text-white dark:bg-white dark:text-black">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">SMS</span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
                        >
                            &larr; Home
                        </Link>
                    </nav>
                </header>

                {/* Main Content Area */}
                <main className="flex flex-1 items-center justify-center px-6 py-12 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Page Title & Subtitle */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Welcome Back
                            </h1>
                            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                Enter your credentials below to access your account
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 rounded-lg border border-neutral-300 bg-neutral-50 p-3 text-center text-sm font-medium text-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
                                {status}
                            </div>
                        )}

                        {/* Login Form Container */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-black">
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-5">
                                            {/* Email Field */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                                                    Email address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="student@school.edu"
                                                    className="h-11 rounded-xl border-neutral-300 bg-white px-4 text-black placeholder-neutral-400 transition focus-visible:ring-black dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder-neutral-600 dark:focus-visible:ring-white"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            {/* Password Field */}
                                            <div className="grid gap-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                                                        Password
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="text-xs font-medium text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                    className="h-11 rounded-xl border-neutral-300 bg-white px-4 text-black placeholder-neutral-400 transition focus-visible:ring-black dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder-neutral-600 dark:focus-visible:ring-white"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            {/* Remember Me */}
                                            <div className="flex items-center space-x-2 pt-1">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-black dark:border-neutral-800 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                                                />
                                                <Label htmlFor="remember" className="cursor-pointer text-sm text-neutral-600 dark:text-neutral-400">
                                                    Remember me
                                                </Label>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                className="mt-2 h-11 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing && <Spinner className="mr-2 h-4 w-4" />}
                                                Log in
                                            </Button>
                                        </div>

                                        {/* Register Link */}
                                        <div className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            Don't have an account?{' '}
                                            <TextLink
                                                href={register()}
                                                tabIndex={5}
                                                className="font-semibold text-black underline underline-offset-4 hover:opacity-80 dark:text-white"
                                            >
                                                Sign up
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200 py-8 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <p>&copy; {new Date().getFullYear()} Student Management System. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

// Bypasses the default Inertia persistent layout wrapper
Login.layout = (page: React.ReactNode) => page;
