export type User = {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'teacher' | 'student' | string; // <--- Added explicitly for auto-complete
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type SharedData = {
    name: string;
    auth: Auth;
    [key: string]: unknown;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */