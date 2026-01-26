<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'check_in' => $this->check_in,
            'check_out' => $this->check_out,
            'booking_date' => $this->booking_date,
            'guests' => $this->guests,
            'total_price' => $this->total_price,
            'currency' => $this->currency,
            'status' => $this->status,
            'special_requests' => $this->special_requests,
            'stripe_payment_id' => $this->stripe_payment_id,
            'accommodation' => $this->accommodation ? [
                'id' => $this->accommodation->id,
                'name' => $this->accommodation->name,
                'slug' => $this->accommodation->slug,
                'image_url' => $this->accommodation->image_url
            ] : null,
            'experience' => $this->experience ? [
                'id' => $this->experience->id,
                'name' => $this->experience->name,
                'slug' => $this->experience->slug,
                'image_url' => $this->experience->image_url
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
