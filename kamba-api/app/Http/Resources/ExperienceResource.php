<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category' => $this->category,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'gallery' => $this->gallery,
            'includes' => $this->includes,
            'duration_hours' => $this->duration_hours,
            'max_participants' => $this->max_participants,
            'meeting_point' => $this->meeting_point,
            'price' => $this->price,
            'currency' => $this->currency,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'is_featured' => $this->is_featured,
            'destination' => $this->destination ? [
                'id' => $this->destination->id,
                'name' => $this->destination->name,
                'slug' => $this->destination->slug,
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
