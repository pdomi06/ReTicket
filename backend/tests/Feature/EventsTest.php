<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventsTest extends TestCase
{
    use RefreshDatabase;

    private function validEventPayload(array $overrides = []): array
    {
        $eventDate = now()->addMonth()->timestamp;
        return array_merge([
            'name' => 'Test Concert',
            'description' => 'A great concert experience',
            'venue' => 'Madison Square Garden',
            'address' => '4 Penn Plaza',
            'city' => 'New York',
            'state' => 'NY',
            'country' => 'USA',
            'eventDate' => $eventDate,
            'eventEndDate' => $eventDate + 7200,
            'category' => 'music',
            'basePrice' => 99.99,
            'imageUrl' => 'https://example.com/image.jpg',
        ], $overrides);
    }

    public function test_index_returns_all_events(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        Event::factory()->count(3)->create(['createdBy' => $organizer->id]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data'])
            ->assertJson(['success' => true]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_show_returns_event_data(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id]);

        $response = $this->getJson("/api/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true, 'data' => ['id' => $event->id]]);
    }

    public function test_show_increments_views_on_first_visit(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id, 'views' => 0]);

        $this->getJson("/api/events/{$event->id}");

        $this->assertEquals(1, $event->fresh()->views);
    }

    public function test_show_does_not_increment_views_on_repeated_visit(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id, 'views' => 0]);

        $this->getJson("/api/events/{$event->id}");
        $this->getJson("/api/events/{$event->id}");

        $this->assertEquals(1, $event->fresh()->views);
    }

    public function test_store_creates_event_for_organizer(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);

        $response = $this->actingAs($organizer, 'sanctum')
            ->postJson('/api/events', $this->validEventPayload());

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('events', [
            'name' => 'Test Concert',
            'createdBy' => $organizer->id,
        ]);
    }

    public function test_store_returns_403_for_vendor_role(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor']);

        $response = $this->actingAs($vendor, 'sanctum')
            ->postJson('/api/events', $this->validEventPayload());

        $response->assertStatus(403);
    }

    public function test_store_returns_401_for_unauthenticated(): void
    {
        $response = $this->postJson('/api/events', $this->validEventPayload());
        $response->assertStatus(401);
    }

    public function test_store_returns_422_when_event_end_before_start(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $eventDate = now()->addMonth()->timestamp;

        $response = $this->actingAs($organizer, 'sanctum')
            ->postJson('/api/events', $this->validEventPayload([
                'eventDate' => $eventDate,
                'eventEndDate' => $eventDate - 3600,
            ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['eventEndDate']);
    }

    public function test_update_modifies_event_for_owner(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id]);

        $response = $this->actingAs($organizer, 'sanctum')
            ->putJson("/api/events/{$event->id}", ['name' => 'Updated Name']);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('events', ['id' => $event->id, 'name' => 'Updated Name']);
    }

    public function test_update_returns_403_for_non_owner_organizer(): void
    {
        $owner = User::factory()->create(['role' => 'organizer']);
        $other = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $owner->id]);

        $response = $this->actingAs($other, 'sanctum')
            ->putJson("/api/events/{$event->id}", ['name' => 'Hijacked Name']);

        $response->assertStatus(403);
    }

    public function test_update_succeeds_for_admin(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $admin = User::factory()->create(['role' => 'admin']);
        $event = Event::factory()->create(['createdBy' => $organizer->id]);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/events/{$event->id}", ['name' => 'Admin Updated']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('events', ['id' => $event->id, 'name' => 'Admin Updated']);
    }

    public function test_destroy_deletes_event_for_owner(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id]);

        $response = $this->actingAs($organizer, 'sanctum')
            ->deleteJson("/api/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }

    public function test_destroy_returns_403_for_non_owner(): void
    {
        $owner = User::factory()->create(['role' => 'organizer']);
        $other = User::factory()->create(['role' => 'vendor']);
        $event = Event::factory()->create(['createdBy' => $owner->id]);

        $response = $this->actingAs($other, 'sanctum')
            ->deleteJson("/api/events/{$event->id}");

        $response->assertStatus(403);
    }

    public function test_landing_returns_event_sections(): void
    {
        $response = $this->getJson('/api/events/landing');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'mostPopularEvents',
                    'lastMinuteDeals',
                    'upcomingEvents',
                    'featuredEvents',
                ],
            ]);
    }

    public function test_search_filters_events_by_name(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        Event::factory()->create(['name' => 'Rock Concert', 'createdBy' => $organizer->id]);
        Event::factory()->create(['name' => 'Jazz Night', 'createdBy' => $organizer->id]);

        $response = $this->getJson('/api/events/search?name=Rock');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertStringContainsStringIgnoringCase('rock', $data[0]['name']);
    }

    public function test_search_filters_events_by_category(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        Event::factory()->create(['category' => 'music', 'createdBy' => $organizer->id]);
        Event::factory()->create(['category' => 'sport', 'createdBy' => $organizer->id]);

        $response = $this->getJson('/api/events/search?category=music');

        $response->assertStatus(200);
        $data = $response->json('data');

        foreach ($data as $group) {
            $this->assertEquals('music', $group['category']);
        }
    }

    public function test_search_returns_paginated_results(): void
    {
        $response = $this->getJson('/api/events/search');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => ['limit', 'returned_count', 'has_more', 'next_cursor', 'total_groups'],
            ]);
    }

    public function test_my_events_returns_only_the_authenticated_users_events(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $other = User::factory()->create(['role' => 'organizer']);
        Event::factory()->count(2)->create(['createdBy' => $organizer->id]);
        Event::factory()->create(['createdBy' => $other->id]);

        $response = $this->actingAs($organizer, 'sanctum')
            ->getJson('/api/events/my');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_my_events_returns_401_for_unauthenticated(): void
    {
        $response = $this->getJson('/api/events/my');
        $response->assertStatus(401);
    }
}
