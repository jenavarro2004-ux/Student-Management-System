<?php

namespace Database\Seeders;

use App\Models\CourseClass;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = User::where('role', 'teacher')->get();

        if ($teachers->isEmpty()) {
            $teachers = User::factory()->count(3)->create(['role' => 'teacher']);
        }

        $classes = [
            ['name' => 'Mathematics 101', 'code' => 'MATH-101'],
            ['name' => 'Physics & Mechanics', 'code' => 'PHYS-201'],
            ['name' => 'Introduction to Computer Science', 'code' => 'CS-101'],
            ['name' => 'World History & Civilizations', 'code' => 'HIST-110'],
            ['name' => 'Organic Chemistry Lab', 'code' => 'CHEM-220'],
        ];

        foreach ($classes as $index => $class) {
            CourseClass::firstOrCreate(
                ['code' => $class['code']],
                [
                    'name' => $class['name'],
                    'teacher_id' => $teachers[$index % $teachers->count()]->id,
                ]
            );
        }
    }
}
