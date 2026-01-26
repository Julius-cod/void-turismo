<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Experience extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id','destination_id','name','slug','category','short_description',
        'description','image_url','gallery','includes','duration_hours',
        'max_participants','meeting_point','price','currency','latitude',
        'longitude','is_featured'
    ];

    protected $casts = [
        'gallery' => 'array',
        'includes' => 'array',
        'is_featured' => 'boolean',
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
