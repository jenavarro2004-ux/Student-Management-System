<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\User;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = User::where('role', 'student')->get();

        if ($students->isEmpty()) {
            $students = User::factory()->count(3)->create(['role' => 'student']);
        }

        $subjects = ['Mathematics 101', 'Physics & Mechanics', 'Computer Science', 'World History', 'Organic Chemistry'];

        foreach ($students as $student) {
            foreach ($subjects as $subject) {
                Grade::create([
                    'student_id' => $student->id,
                    'subject_name' => $subject,
                    'score' => rand(70, 98),
                    'letter_grade' => rand(0, 1) ? 'A' : 'B',
                    'remarks' => 'Good performance in coursework and exams.',
                ]);
            }
        }
    }
}
