<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'System Admin',
            'email' => 'cpsu@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Teacher John',
            'email' => 'teacher@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
        ]);

        User::create([
            'name' => 'Student Sarah',
            'email' => 'student@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]);
    }
}
