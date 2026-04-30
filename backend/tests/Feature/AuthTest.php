<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_with_valid_data_creates_user_and_returns_token(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token', 'token_type'],
            ])
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'role' => 'vendor']);
    }

    public function test_register_sets_user_role_to_vendor(): void
    {
        Notification::fake();

        $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'phone' => '0987654321',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $user = User::where('email', 'newuser@example.com')->first();
        $this->assertEquals('vendor', $user->role);
    }

    public function test_register_with_duplicate_email_returns_422(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'phone' => '1234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_with_mismatched_passwords_returns_422(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'password' => 'password123',
            'password_confirmation' => 'different123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_register_with_missing_fields_returns_422(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'phone', 'password']);
    }

    public function test_register_with_short_password_returns_422(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_with_valid_credentials_returns_token(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'isActive' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token', 'token_type'],
            ])
            ->assertJson(['success' => true, 'message' => 'Login successful']);
    }

    public function test_login_with_invalid_password_returns_401(): void
    {
        User::factory()->create(['email' => 'user@example.com', 'isActive' => true]);

        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['success' => false, 'message' => 'Invalid credentials']);
    }

    public function test_login_with_nonexistent_email_returns_401(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nobody@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(401)
            ->assertJson(['success' => false]);
    }

    public function test_login_with_inactive_user_returns_403(): void
    {
        User::factory()->create([
            'email' => 'inactive@example.com',
            'isActive' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'inactive@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_login_updates_last_login_and_sets_online(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'isActive' => true,
            'isOnline' => false,
        ]);

        $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $user->refresh();
        $this->assertNotEquals(0, $user->isOnline);
        $this->assertNotNull($user->lastLogin);
    }

    public function test_logout_succeeds_for_authenticated_user(): void
    {
        $user = User::factory()->create(['isOnline' => true]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['success' => true, 'message' => 'Logout successful']);
    }

    public function test_logout_sets_user_offline(): void
    {
        $user = User::factory()->create(['isOnline' => true]);

        $this->actingAs($user, 'sanctum')->postJson('/api/logout');

        $this->assertEquals(0, $user->fresh()->isOnline);
    }

    public function test_me_returns_current_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['user' => ['id' => $user->id, 'email' => $user->email]],
            ]);
    }

    public function test_me_returns_401_for_unauthenticated_request(): void
    {
        $response = $this->getJson('/api/me');
        $response->assertStatus(401);
    }
}
