<?php

namespace Tests\Feature;

use App\Models\Grade;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GradeModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_only_see_their_own_grades(): void
    {
        $student1 = User::factory()->create(['role' => 'student']);
        $student2 = User::factory()->create(['role' => 'student']);

        $grade1 = Grade::factory()->create(['student_id' => $student1->id, 'subject_name' => 'Math 101']);
        $grade2 = Grade::factory()->create(['student_id' => $student2->id, 'subject_name' => 'Physics 201']);

        $response = $this->actingAs($student1)->get('/grades');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('grades/index')
            ->has('grades', 1)
            ->where('grades.0.id', $grade1->id)
        );
    }

    public function test_teacher_can_submit_grade(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($teacher)->post('/grades', [
            'student_id' => $student->id,
            'subject_name' => 'Chemistry 101',
            'score' => 92.5,
            'letter_grade' => 'A',
            'remarks' => 'Excellent lab work',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('grades', [
            'student_id' => $student->id,
            'subject_name' => 'Chemistry 101',
            'score' => 92.5,
            'letter_grade' => 'A',
        ]);
    }
}
