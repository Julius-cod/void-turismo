# Kamba Travel - Laravel API Documentation

## Overview

This document describes all the API endpoints required for the Kamba Travel frontend application. The Laravel API should implement all these endpoints with the exact request/response formats specified.

## Base Configuration

### Base URL
```
http://localhost:8000/api
```

The frontend expects the API to be available at `VITE_API_BASE_URL` environment variable. Default: `http://localhost:8000/api`

### Authentication
The API uses **Bearer Token** authentication (Laravel Sanctum recommended).

All protected routes require:
```
Authorization: Bearer {token}
```

### Response Format
All responses should follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150
  }
}
```

---

## Database Schema

### Users Table
```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email')->unique();
    $table->string('password');
    $table->string('full_name')->nullable();
    $table->string('phone')->nullable();
    $table->string('avatar_url')->nullable();
    $table->string('preferred_language')->default('en');
    $table->enum('role', ['user', 'admin', 'moderator'])->default('user');
    $table->rememberToken();
    $table->timestamps();
});
```

### Destinations Table
```php
Schema::create('destinations', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('region')->nullable();
    $table->text('short_description')->nullable();
    $table->longText('description')->nullable();
    $table->string('image_url')->nullable();
    $table->json('gallery')->nullable(); // Array of image URLs
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->decimal('rating', 2, 1)->default(0);
    $table->integer('review_count')->default(0);
    $table->boolean('is_featured')->default(false);
    $table->timestamps();
});
```

### Accommodations Table
```php
Schema::create('accommodations', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('destination_id')->nullable()->constrained()->nullOnDelete();
    $table->string('name');
    $table->string('slug')->unique();
    $table->enum('listing_type', ['hotel', 'lodge', 'guesthouse', 'hostel', 'apartment'])->default('hotel');
    $table->text('short_description')->nullable();
    $table->longText('description')->nullable();
    $table->string('address')->nullable();
    $table->string('image_url')->nullable();
    $table->json('gallery')->nullable();
    $table->json('amenities')->nullable(); // Array of strings
    $table->integer('bedrooms')->nullable();
    $table->integer('bathrooms')->nullable();
    $table->integer('max_guests')->nullable();
    $table->decimal('price_per_night', 10, 2);
    $table->string('currency')->default('USD');
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->decimal('rating', 2, 1)->default(0);
    $table->integer('review_count')->default(0);
    $table->boolean('is_featured')->default(false);
    $table->boolean('is_verified')->default(false);
    $table->timestamps();
});
```

### Experiences Table
```php
Schema::create('experiences', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('destination_id')->nullable()->constrained()->nullOnDelete();
    $table->string('name');
    $table->string('slug')->unique();
    $table->enum('category', ['city_tour', 'cultural', 'beach', 'nature', 'food', 'adventure'])->default('city_tour');
    $table->text('short_description')->nullable();
    $table->longText('description')->nullable();
    $table->string('image_url')->nullable();
    $table->json('gallery')->nullable();
    $table->json('includes')->nullable(); // Array of strings
    $table->decimal('duration_hours', 4, 1)->nullable();
    $table->integer('max_participants')->nullable();
    $table->string('meeting_point')->nullable();
    $table->decimal('price', 10, 2);
    $table->string('currency')->default('USD');
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->decimal('rating', 2, 1)->default(0);
    $table->integer('review_count')->default(0);
    $table->boolean('is_featured')->default(false);
    $table->timestamps();
});
```

### Bookings Table
```php
Schema::create('bookings', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
    $table->foreignUuid('accommodation_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignUuid('experience_id')->nullable()->constrained()->nullOnDelete();
    $table->date('check_in')->nullable();
    $table->date('check_out')->nullable();
    $table->date('booking_date')->nullable(); // For experiences
    $table->integer('guests')->default(1);
    $table->decimal('total_price', 10, 2);
    $table->string('currency')->default('USD');
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
    $table->text('special_requests')->nullable();
    $table->string('stripe_payment_id')->nullable();
    $table->timestamps();
});
```

### Reviews Table
```php
Schema::create('reviews', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
    $table->foreignUuid('accommodation_id')->nullable()->constrained()->cascadeOnDelete();
    $table->foreignUuid('experience_id')->nullable()->constrained()->cascadeOnDelete();
    $table->integer('rating')->unsigned();
    $table->text('comment')->nullable();
    $table->timestamps();
});
```

### Favorites Table
```php
Schema::create('favorites', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
    $table->foreignUuid('destination_id')->nullable()->constrained()->cascadeOnDelete();
    $table->foreignUuid('accommodation_id')->nullable()->constrained()->cascadeOnDelete();
    $table->foreignUuid('experience_id')->nullable()->constrained()->cascadeOnDelete();
    $table->timestamps();
    
    $table->unique(['user_id', 'destination_id', 'accommodation_id', 'experience_id'], 'unique_favorite');
});
```

---

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "bearer_token_here"
  },
  "message": "Registration successful"
}
```

#### POST /auth/login
Login user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "avatar_url": null,
      "phone": null,
      "preferred_language": "en"
    },
    "token": "bearer_token_here"
  },
  "message": "Login successful"
}
```

#### POST /auth/logout
Logout user (requires auth).

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current authenticated user (requires auth).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "avatar_url": null,
    "phone": null,
    "preferred_language": "en",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /auth/profile
Update user profile (requires auth).

**Request:**
```json
{
  "full_name": "John Updated",
  "phone": "+244923456789",
  "preferred_language": "pt"
}
```

---

### Destinations

#### GET /destinations
List all destinations with pagination.

**Query Parameters:**
- `page` (int): Page number
- `per_page` (int): Items per page (default: 15)
- `search` (string): Search by name
- `region` (string): Filter by region
- `is_featured` (boolean): Filter featured only

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Luanda",
      "slug": "luanda",
      "region": "Luanda Province",
      "short_description": "Capital city of Angola",
      "image_url": "https://...",
      "rating": 4.5,
      "review_count": 120,
      "is_featured": true,
      "latitude": -8.839988,
      "longitude": 13.289437
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

#### GET /destinations/{slug}
Get single destination by slug.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Luanda",
    "slug": "luanda",
    "region": "Luanda Province",
    "short_description": "Capital city of Angola",
    "description": "Full description here...",
    "image_url": "https://...",
    "gallery": ["https://...", "https://..."],
    "latitude": -8.839988,
    "longitude": 13.289437,
    "rating": 4.5,
    "review_count": 120,
    "is_featured": true,
    "accommodations_count": 45,
    "experiences_count": 23,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /admin/destinations (Admin only)
Create new destination.

**Request:**
```json
{
  "name": "Benguela",
  "slug": "benguela",
  "region": "Benguela Province",
  "short_description": "Coastal paradise",
  "description": "Full description...",
  "image_url": "https://...",
  "gallery": ["https://..."],
  "latitude": -12.578,
  "longitude": 13.405,
  "is_featured": false
}
```

#### PUT /admin/destinations/{id} (Admin only)
Update destination.

#### DELETE /admin/destinations/{id} (Admin only)
Delete destination.

---

### Accommodations

#### GET /accommodations
List all accommodations with pagination and filters.

**Query Parameters:**
- `page` (int)
- `per_page` (int)
- `search` (string)
- `destination_id` (uuid)
- `listing_type` (string): hotel, lodge, guesthouse, hostel, apartment
- `min_price` (number)
- `max_price` (number)
- `is_featured` (boolean)
- `is_verified` (boolean)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hotel Presidente",
      "slug": "hotel-presidente",
      "listing_type": "hotel",
      "short_description": "Luxury hotel in Luanda",
      "image_url": "https://...",
      "price_per_night": 150.00,
      "currency": "USD",
      "rating": 4.7,
      "review_count": 89,
      "is_featured": true,
      "is_verified": true,
      "destination": {
        "id": "uuid",
        "name": "Luanda",
        "slug": "luanda"
      }
    }
  ],
  "meta": { ... }
}
```

#### GET /accommodations/{slug}
Get single accommodation by slug.

**Response includes:**
- Full accommodation details
- All amenities
- Gallery images
- Related destination
- Recent reviews

#### POST /admin/accommodations (Admin only)
Create new accommodation.

**Request:**
```json
{
  "destination_id": "uuid",
  "name": "Hotel Name",
  "slug": "hotel-name",
  "listing_type": "hotel",
  "short_description": "Short desc",
  "description": "Full description",
  "address": "123 Main St, Luanda",
  "image_url": "https://...",
  "gallery": ["https://..."],
  "amenities": ["wifi", "pool", "restaurant", "parking"],
  "bedrooms": 1,
  "bathrooms": 1,
  "max_guests": 2,
  "price_per_night": 150.00,
  "currency": "USD",
  "latitude": -8.839988,
  "longitude": 13.289437,
  "is_featured": false,
  "is_verified": false
}
```

#### PUT /admin/accommodations/{id} (Admin only)
Update accommodation.

#### DELETE /admin/accommodations/{id} (Admin only)
Delete accommodation.

---

### Experiences

#### GET /experiences
List all experiences with pagination and filters.

**Query Parameters:**
- `page` (int)
- `per_page` (int)
- `search` (string)
- `destination_id` (uuid)
- `category` (string): city_tour, cultural, beach, nature, food, adventure
- `min_price` (number)
- `max_price` (number)
- `is_featured` (boolean)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Luanda City Tour",
      "slug": "luanda-city-tour",
      "category": "city_tour",
      "short_description": "Explore the capital",
      "image_url": "https://...",
      "duration_hours": 4,
      "price": 75.00,
      "currency": "USD",
      "rating": 4.8,
      "review_count": 56,
      "is_featured": true,
      "destination": {
        "id": "uuid",
        "name": "Luanda",
        "slug": "luanda"
      }
    }
  ],
  "meta": { ... }
}
```

#### GET /experiences/{slug}
Get single experience by slug.

#### POST /admin/experiences (Admin only)
Create new experience.

**Request:**
```json
{
  "destination_id": "uuid",
  "name": "Experience Name",
  "slug": "experience-name",
  "category": "cultural",
  "short_description": "Short desc",
  "description": "Full description",
  "image_url": "https://...",
  "gallery": ["https://..."],
  "includes": ["Transportation", "Guide", "Lunch"],
  "duration_hours": 4,
  "max_participants": 12,
  "meeting_point": "Hotel lobby pickup available",
  "price": 75.00,
  "currency": "USD",
  "latitude": -8.839988,
  "longitude": 13.289437,
  "is_featured": false
}
```

#### PUT /admin/experiences/{id} (Admin only)
Update experience.

#### DELETE /admin/experiences/{id} (Admin only)
Delete experience.

---

### Bookings

#### GET /bookings (Auth required)
Get user's bookings.

**Query Parameters:**
- `status` (string): pending, confirmed, cancelled, completed

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "check_in": "2024-02-15",
      "check_out": "2024-02-18",
      "guests": 2,
      "total_price": 450.00,
      "currency": "USD",
      "status": "confirmed",
      "accommodation": {
        "id": "uuid",
        "name": "Hotel Presidente",
        "slug": "hotel-presidente",
        "image_url": "https://..."
      },
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /bookings (Auth required)
Create new booking.

**Request:**
```json
{
  "accommodation_id": "uuid",
  "check_in": "2024-02-15",
  "check_out": "2024-02-18",
  "guests": 2,
  "special_requests": "Late check-in please"
}
```

Or for experiences:
```json
{
  "experience_id": "uuid",
  "booking_date": "2024-02-15",
  "guests": 4
}
```

#### GET /bookings/{id} (Auth required)
Get booking details.

#### PUT /bookings/{id}/cancel (Auth required)
Cancel booking.

---

### Admin Bookings

#### GET /admin/bookings (Admin only)
Get all bookings with filters.

**Query Parameters:**
- `status` (string)
- `user_id` (uuid)
- `from_date` (date)
- `to_date` (date)

#### PUT /admin/bookings/{id}/status (Admin only)
Update booking status.

**Request:**
```json
{
  "status": "confirmed"
}
```

---

### Favorites

#### GET /favorites (Auth required)
Get user's favorites.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "destinations": [...],
    "accommodations": [...],
    "experiences": [...]
  }
}
```

#### POST /favorites (Auth required)
Add to favorites.

**Request:**
```json
{
  "destination_id": "uuid"
}
```
Or:
```json
{
  "accommodation_id": "uuid"
}
```
Or:
```json
{
  "experience_id": "uuid"
}
```

#### DELETE /favorites/{id} (Auth required)
Remove from favorites.

---

### Reviews

#### GET /reviews
Get reviews for accommodation or experience.

**Query Parameters:**
- `accommodation_id` (uuid)
- `experience_id` (uuid)

#### POST /reviews (Auth required)
Create review.

**Request:**
```json
{
  "accommodation_id": "uuid",
  "rating": 5,
  "comment": "Amazing stay!"
}
```

---

### Admin Users

#### GET /admin/users (Admin only)
List all users with pagination.

**Query Parameters:**
- `page` (int)
- `per_page` (int)
- `search` (string): Search by name or email
- `role` (string): user, admin, moderator

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "avatar_url": null,
      "bookings_count": 5,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": { ... }
}
```

#### PUT /admin/users/{id}/role (Admin only)
Update user role.

**Request:**
```json
{
  "role": "moderator"
}
```

#### DELETE /admin/users/{id} (Admin only)
Delete user.

---

### Dashboard Stats (Admin only)

#### GET /admin/stats
Get dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "destinations_count": 18,
    "accommodations_count": 156,
    "experiences_count": 89,
    "bookings_count": 1240,
    "users_count": 5600,
    "revenue_total": 125000.00,
    "revenue_this_month": 15000.00,
    "recent_bookings": [...],
    "popular_destinations": [...]
  }
}
```

---

## Laravel Setup Commands

```bash
# Create new Laravel project
composer create-project laravel/laravel kamba-api

# Install Sanctum for API auth
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Run migrations
php artisan migrate

# Create models
php artisan make:model Destination -mrc
php artisan make:model Accommodation -mrc
php artisan make:model Experience -mrc
php artisan make:model Booking -mrc
php artisan make:model Review -mrc
php artisan make:model Favorite -mrc

# Seed database
php artisan db:seed
```

## CORS Configuration

In `config/cors.php`:
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## Middleware

Create `IsAdmin` middleware:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized. Admin access required.'
        ], 403);
    }
}
```

---

## Notes

1. All UUIDs should be generated using Laravel's `Str::uuid()`
2. Slugs should be unique and URL-friendly
3. Implement proper validation on all endpoints
4. Use Laravel Resources for consistent JSON responses
5. Implement rate limiting on auth endpoints
6. Use eager loading to prevent N+1 queries
7. Implement proper error handling with try-catch blocks
