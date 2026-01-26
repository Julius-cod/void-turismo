<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Review extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['user_id','accommodation_id','experience_id','rating','comment'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function($model){
            $model->id = (string) Str::uuid();
        });
    }

    public function user() { return $this->belongsTo(User::class); }
    public function accommodation() { return $this->belongsTo(Accommodation::class); }
    public function experience() { return $this->belongsTo(Experience::class); }
}
