<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Favorite extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['user_id','destination_id','accommodation_id','experience_id'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function($model){
            $model->id = (string) Str::uuid();
        });
    }

    public function user() { return $this->belongsTo(User::class); }
    public function destination() { return $this->belongsTo(Destination::class); }
    public function accommodation() { return $this->belongsTo(Accommodation::class); }
    public function experience() { return $this->belongsTo(Experience::class); }
}
