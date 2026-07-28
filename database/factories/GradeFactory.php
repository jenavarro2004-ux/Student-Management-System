<?php

namespace Database\Factories;

use App\Models\Grade;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Grade>
 */
class GradeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $score = fake()->randomFloat(2, 60, 100);
        $letterGrade = match (true) {
            $score >= 90 => 'A',
            $score >= 80 => 'B',
            $score >= 70 => 'C',
            $score >= 60 => 'D',
            default => 'F',
        };

        return [
            'student_id' => User::factory()->state(['role' => 'student']),
            'subject_name' => fake()->randomElement(['Mathematics 101', 'Physics & Mechanics', 'Computer Science', 'World History', 'Organic Chemistry']),
            'score' => $score,
            'letter_grade' => $letterGrade,
            'remarks' => fake()->randomElement(['Excellent performance', 'Good effort', 'Satisfactory', 'Needs improvement']),
        ];
    }
}
