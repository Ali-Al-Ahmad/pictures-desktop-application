<?php

namespace Tests\Feature;

use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;
use App\Models\User;


class AuthTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_user_can_signup()
    {
        $user = User::factory()->makeone();
        $response = $this->postJson('/api/v0.1/auth/signup', [
            'full_name' => $user->full_name,
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Signup successfully',
            ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/v0.1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login successfully',
            ]);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/v0.1/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logout successfully',
            ]);
    }
}
