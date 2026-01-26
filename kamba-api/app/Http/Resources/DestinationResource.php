<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'region' => $this->region,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'gallery' => $this->gallery,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'is_featured' => $this->is_featured,
            'accommodations_count' => $this->accommodations()->count(),
            'experiences_count' => $this->experiences()->count(),
            'created_at' => $this->created_at,
        ];
    }
}
