<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Accommodation extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id','destination_id','name','slug','listing_type','short_description',
        'description','address','image_url','gallery','amenities','bedrooms','bathrooms',
        'max_guests','price_per_night','currency','latitude','longitude',
        'is_featured','is_verified'
    ];

    protected $casts = [
        'gallery' => 'array',
        'amenities' => 'array',
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
