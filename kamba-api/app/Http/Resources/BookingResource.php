<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'guests' => $this->guests,
            'check_in' => $this->check_in,
            'check_out' => $this->check_out,
            'booking_date' => $this->booking_date,
            'total_price' => $this->total_price,
            'currency' => $this->currency,
            'special_requests' => $this->special_requests,
            'created_at' => $this->created_at,

            'accommodation' => $this->whenLoaded('accommodation'),
            'experience'    => $this->whenLoaded('experience'),
        ];
    }
}
