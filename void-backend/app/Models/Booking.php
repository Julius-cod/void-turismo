<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = ['user_id','poi_id','start_at','end_at','status','notes'];

    public function user() { return $this->belongsTo(User::class); }
    public function poi() { return $this->belongsTo(Poi::class); }
}
