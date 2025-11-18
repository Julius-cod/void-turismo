<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poi extends Model
{
    protected $fillable = [
        'title','description','category','latitude','longitude','address','phone','website','photo','featured'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
