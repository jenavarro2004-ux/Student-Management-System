<?php

namespace Tests\Feature;

use App\Models\CourseClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_classes_page(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        CourseClass::factory()->create(['teacher_id' => $teacher->id]);

        $response = $this->actingAs($teacher)->get('/classes');

        $response->assertOk();
    }

    public function test_teacher_can_create_class(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);

        $response = $this->actingAs($teacher)->post('/classes', [
            'name' => 'Data Structures 101',
            'code' => 'CS-201',
            'teacher_id' => $teacher->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('course_classes', [
            'name' => 'Data Structures 101',
            'code' => 'CS-201',
            'teacher_id' => $teacher->id,
        ]);
    }
}
