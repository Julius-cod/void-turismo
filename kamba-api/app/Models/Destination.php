<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Accommodation;

class Destination extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'region',
        'short_description',
        'description',
        'image_url',
        'latitude',
        'longitude',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function accommodations()
    {
        return $this->hasMany(Accommodation::class);
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class);
    }
}
