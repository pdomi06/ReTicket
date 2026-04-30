<?php

namespace Tests\Feature;

use App\Models\ActiveTicket;
use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OriginalTicket;
use App\Models\TicketForSale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrdersTest extends TestCase
{
    use RefreshDatabase;

    private function createTicketForSale(array $attributes = []): TicketForSale
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id]);
        $originalTicket = OriginalTicket::factory()->create(['eventId' => $event->id]);

        return TicketForSale::factory()->create(array_merge([
            'originalTicketId' => $originalTicket->id,
            'eventId' => $event->id,
            'fromUserId' => $organizer->id,
            'price' => 50.00,
        ], $attributes));
    }

    public function test_store_creates_order_with_correct_subtotal_and_fee(): void
    {
        $ticket = $this->createTicketForSale();

        $response = $this->postJson('/api/orders', [
            'subtotal' => 75.00,
            'platformFee' => 7.50,
            'tickets' => [$ticket->id],
        ]);

        $response->assertStatus(201);

        $order = Order::first();
        $this->assertEquals(75.00, $order->subtotal);
        $this->assertEquals(7.50, $order->platformFee);
    }

    public function test_store_creates_order_item_for_each_ticket(): void
    {
        $ticket = $this->createTicketForSale();

        $this->postJson('/api/orders', [
            'subtotal' => 50.00,
            'platformFee' => 5.00,
            'tickets' => [$ticket->id],
        ]);

        $order = Order::first();
        $this->assertDatabaseHas('order_item', [
            'orderId' => $order->id,
            'price' => 50.00,
        ]);
    }

    public function test_store_creates_active_ticket_for_each_ticket(): void
    {
        $ticket = $this->createTicketForSale();

        $this->postJson('/api/orders', [
            'subtotal' => 50.00,
            'platformFee' => 5.00,
            'tickets' => [$ticket->id],
        ]);

        $order = Order::first();
        $this->assertDatabaseHas('active_tickets', [
            'orderId' => $order->id,
            'originalTicketId' => $ticket->originalTicketId,
        ]);
    }

    public function test_store_generates_unique_order_number_in_valid_range(): void
    {
        $ticket = $this->createTicketForSale();

        $response = $this->postJson('/api/orders', [
            'subtotal' => 50.00,
            'platformFee' => 5.00,
            'tickets' => [$ticket->id],
        ]);

        $data = $response->json();
        $this->assertArrayHasKey('orderNumber', $data);
        $this->assertGreaterThanOrEqual(1000000, $data['orderNumber']);
        $this->assertLessThanOrEqual(9999999, $data['orderNumber']);
    }

    public function test_store_with_multiple_tickets_creates_corresponding_items(): void
    {
        $ticket1 = $this->createTicketForSale();
        $ticket2 = $this->createTicketForSale();

        $this->postJson('/api/orders', [
            'subtotal' => 100.00,
            'platformFee' => 10.00,
            'tickets' => [$ticket1->id, $ticket2->id],
        ]);

        $order = Order::first();
        $this->assertCount(2, OrderItem::where('orderId', $order->id)->get());
        $this->assertCount(2, ActiveTicket::where('orderId', $order->id)->get());
    }

    public function test_store_with_invalid_ticket_id_returns_422(): void
    {
        $response = $this->postJson('/api/orders', [
            'subtotal' => 50.00,
            'platformFee' => 5.00,
            'tickets' => [99999],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tickets.0']);
    }

    public function test_store_with_missing_fields_returns_422(): void
    {
        $response = $this->postJson('/api/orders', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['subtotal', 'platformFee', 'tickets']);
    }

    public function test_store_with_empty_tickets_array_returns_422(): void
    {
        $response = $this->postJson('/api/orders', [
            'subtotal' => 50.00,
            'platformFee' => 5.00,
            'tickets' => [],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tickets']);
    }

    public function test_show_returns_order_for_authenticated_owner(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['deliveryEmail' => $user->email]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200);
    }

    public function test_show_returns_403_for_different_authenticated_user(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $order = Order::factory()->create(['deliveryEmail' => $owner->email]);

        $response = $this->actingAs($other, 'sanctum')
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(403);
    }

    public function test_show_allows_admin_to_view_any_order(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $order = Order::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200);
    }

    public function test_show_returns_403_for_unauthenticated_without_email(): void
    {
        $order = Order::factory()->create(['deliveryEmail' => 'buyer@example.com']);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response->assertStatus(403);
    }

    public function test_index_requires_authentication(): void
    {
        $response = $this->getJson('/api/orders');
        $response->assertStatus(401);
    }

    public function test_index_returns_all_orders_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/orders');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }
}
