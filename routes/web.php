<?php

use App\Models\CourseClass;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // DASHBOARD
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalTeachers' => User::where('role', 'teacher')->count(),
                'totalStudents' => User::where('role', 'student')->count(),
            ],
        ]);
    })->name('dashboard');

    // ADMIN ROUTES
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', function () {
            return Inertia::render('users/index', [
                'users' => User::latest()->get(),
            ]);
        })->name('users.index');

        Route::post('/users', function (Request $request) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|lowercase|max:255|unique:users',
                'role' => 'required|string|in:admin,teacher,student',
                'password' => ['required', Password::defaults()],
            ]);

            User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);

            return back();
        })->name('users.store');

        Route::put('/users/{user}', function (Request $request, User $user) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|lowercase|max:255|unique:users,email,'.$user->id,
                'role' => 'required|string|in:admin,teacher,student',
                'password' => $request->filled('password') ? ['required', Password::defaults()] : ['nullable'],
            ]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->role = $validated['role'];

            if ($request->filled('password')) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return back();
        })->name('users.update');

        Route::delete('/users/{user}', function (User $user) {
            $user->delete();

            return back();
        })->name('users.destroy');
    });

    // TEACHER & ADMIN CLASSES
    Route::middleware('role:admin,teacher')->group(function () {
        Route::get('/classes', function () {
            return Inertia::render('classes/index', [
                'classes' => CourseClass::with('teacher')->latest()->get(),
                'teachers' => User::where('role', 'teacher')->get(['id', 'name', 'email']),
            ]);
        })->name('classes.index');

        Route::post('/classes', function (Request $request) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:course_classes,code',
                'teacher_id' => 'required|exists:users,id,role,teacher',
            ]);

            CourseClass::create($validated);

            return back();
        })->name('classes.store');
    });

    // GRADES (ALL ROLES)
    Route::get('/grades', function (Request $request) {
        $user = $request->user();

        if ($user->role === 'student') {
            $grades = Grade::where('student_id', $user->id)
                ->latest()
                ->get();
            $students = [];
        } else {
            $grades = Grade::with('student')
                ->latest()
                ->get();
            $students = User::where('role', 'student')->get(['id', 'name', 'email']);
        }

        return Inertia::render('grades/index', [
            'grades' => $grades,
            'students' => $students,
            'userRole' => $user->role,
        ]);
    })->name('grades.index');

    Route::middleware('role:admin,teacher')->group(function () {
        Route::post('/grades', function (Request $request) {
            $validated = $request->validate([
                'student_id' => 'required|exists:users,id,role,student',
                'subject_name' => 'required|string|max:255',
                'score' => 'required|numeric|min:0|max:100',
                'letter_grade' => 'required|string|max:5',
                'remarks' => 'nullable|string|max:255',
            ]);

            Grade::create($validated);

            return back();
        })->name('grades.store');
    });
});

if (file_exists(__DIR__.'/settings.php')) {
    require __DIR__.'/settings.php';
}

if (file_exists(__DIR__.'/auth.php')) {
    require __DIR__.'/auth.php';
}
