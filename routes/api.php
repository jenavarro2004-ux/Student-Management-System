<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Requires Authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin-only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Welcome to Admin Dashboard']);
        });
    });

    // Teacher & Admin routes
    Route::middleware('role:teacher,admin')->prefix('teacher')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Welcome to Teacher Dashboard']);
        });
    });

    // Student-only routes
    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Welcome to Student Dashboard']);
        });
    });
});
