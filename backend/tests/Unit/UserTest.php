<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_auth_password_returns_password_hash(): void
    {
        $user = User::factory()->create();
        $this->assertEquals($user->passwordHash, $user->getAuthPassword());
    }

    public function test_password_hash_is_hidden_from_serialization(): void
    {
        $user = User::factory()->make();
        $this->assertArrayNotHasKey('passwordHash', $user->toArray());
    }

    public function test_has_verified_email_returns_true_when_email_verified_at_is_set(): void
    {
        $user = User::factory()->create([
            'isVerified' => true,
            'email_verified_at' => now(),
        ]);
        $this->assertTrue($user->hasVerifiedEmail());
    }

    public function test_has_verified_email_returns_false_for_unverified_user(): void
    {
        $user = User::factory()->unverified()->create();
        $this->assertFalse($user->hasVerifiedEmail());
    }

    public function test_mark_email_as_verified_sets_both_fields(): void
    {
        $user = User::factory()->unverified()->create();
        $user->markEmailAsVerified();
        $user->refresh();

        $this->assertTrue($user->isVerified);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_mark_email_as_unverified_clears_both_fields(): void
    {
        $user = User::factory()->create([
            'isVerified' => true,
            'email_verified_at' => now(),
        ]);
        $user->markEmailAsUnverified();
        $user->refresh();

        $this->assertFalse($user->isVerified);
        $this->assertNull($user->email_verified_at);
    }

    public function test_setting_email_verified_at_syncs_is_verified_to_true(): void
    {
        $user = User::factory()->unverified()->create();
        $user->update(['email_verified_at' => now()]);
        $user->refresh();

        $this->assertTrue($user->isVerified);
    }

    public function test_clearing_email_verified_at_syncs_is_verified_to_false(): void
    {
        $user = User::factory()->create([
            'isVerified' => true,
            'email_verified_at' => now(),
        ]);
        $user->update(['email_verified_at' => null]);
        $user->refresh();

        $this->assertFalse($user->isVerified);
    }

    public function test_setting_is_verified_true_sets_email_verified_at(): void
    {
        $user = User::factory()->unverified()->create();
        $user->update(['isVerified' => true]);
        $user->refresh();

        $this->assertNotNull($user->email_verified_at);
    }

    public function test_setting_is_verified_false_clears_email_verified_at(): void
    {
        $user = User::factory()->create([
            'isVerified' => true,
            'email_verified_at' => now(),
        ]);
        $user->update(['isVerified' => false]);
        $user->refresh();

        $this->assertNull($user->email_verified_at);
    }

    public function test_user_has_many_orders(): void
    {
        $user = User::factory()->make();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $user->orders());
    }

    public function test_user_has_many_tickets_for_sale(): void
    {
        $user = User::factory()->make();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $user->ticketsForSale());
    }

    public function test_user_has_many_payouts(): void
    {
        $user = User::factory()->make();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $user->payouts());
    }

    public function test_user_has_one_user_setting(): void
    {
        $user = User::factory()->make();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasOne::class, $user->userSetting());
    }
}
