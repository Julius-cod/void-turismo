<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'accommodation_id',
        'experience_id',
        'check_in',
        'check_out',
        'booking_date',
        'booking_time',
        'guests',
        'total_price',
        'currency',
        'special_requests',
        'status',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'booking_date' => 'date',
        'total_price' => 'decimal:2',
        'guests' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accommodation(): BelongsTo
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }

    // Helper methods
    public function isUpcoming(): bool
    {
        if ($this->accommodation_id && $this->check_in) {
            return $this->check_in->isFuture();
        }
        
        if ($this->experience_id && $this->booking_date) {
            return $this->booking_date->isFuture();
        }
        
        return false;
    }

    public function getTypeAttribute(): string
    {
        return $this->accommodation_id ? 'accommodation' : 'experience';
    }

    public function getItemNameAttribute(): ?string
    {
        return $this->accommodation_id 
            ? $this->accommodation?->name 
            : $this->experience?->name;
    }
}