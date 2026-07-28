<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnsureRoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_users_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/users');

        $response->assertOk();
    }

    public function test_non_admin_cannot_access_users_page(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/users');

        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('error', 'You do not have permission to access this page.');
    }

    public function test_teacher_and_admin_can_access_classes_page(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($teacher)->get('/classes')->assertOk();
        $this->actingAs($admin)->get('/classes')->assertOk();
    }

    public function test_student_cannot_access_classes_page(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/classes');

        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('error', 'You do not have permission to access this page.');
    }
}
