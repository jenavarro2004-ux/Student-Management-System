<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    // Registration
    Route::get('register', function () {
        return Inertia::render('auth/register');
    })->name('register');

    Route::post('register', function (Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|lowercase|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student', // Default role for new signups
        ]);

        Auth::login($user);

        return redirect()->route('dashboard');
    })->name('register.store');

    // Login
    Route::get('login', function () {
        return Inertia::render('auth/login');
    })->name('login');

    Route::post('login', function (Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    })->name('login.store');

    // Password Reset
    Route::get('forgot-password', function () {
        return Inertia::render('auth/forgot-password');
    })->name('password.request');
});

Route::middleware('auth')->group(function () {
    // Logout
    Route::post('logout', function (Request $request) {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    })->name('logout');
});
