<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccommodationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'listing_type' => $this->listing_type,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'address' => $this->address,
            'image_url' => $this->image_url,
            'gallery' => $this->gallery,
            'amenities' => $this->amenities,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'max_guests' => $this->max_guests,
            'price_per_night' => $this->price_per_night,
            'currency' => $this->currency,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'is_featured' => $this->is_featured,
            'is_verified' => $this->is_verified,
            'destination' => $this->destination ? [
                'id' => $this->destination->id,
                'name' => $this->destination->name,
                'slug' => $this->destination->slug,
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
