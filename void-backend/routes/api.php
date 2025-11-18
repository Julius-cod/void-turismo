<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PoiController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;

Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

// currency converter stub
Route::get('convert', function(Request $r){
    $amount = floatval($r->query('amount',1));
    $from = strtoupper($r->query('from','USD'));
    $to = strtoupper($r->query('to','AOA'));
    $rate = 820.0; // mock
    if($from==='USD' && $to==='AOA') return ['amount'=>$amount,'from'=>$from,'to'=>$to,'result'=>$amount*$rate,'rate'=>$rate];
    return ['message'=>'Integrar API real de câmbio'];
});

// reviews + bookings public
Route::get('pois',[PoiController::class,'index']);
Route::get('pois/{poi}',[PoiController::class,'show']);


Route::middleware('auth:sanctum')->group(function(){
    Route::post('logout',[AuthController::class,'logout']);

    // pois CRUD
    Route::post('pois',[PoiController::class,'store']);
    Route::put('pois/{poi}',[PoiController::class,'update']);
    Route::delete('pois/{poi}',[PoiController::class,'destroy']);

    // reviews
    Route::post('reviews',[ReviewController::class,'store']);
    Route::put('reviews/{review}',[ReviewController::class,'update']);
    Route::delete('reviews/{review}',[ReviewController::class,'destroy']);

    // bookings
    Route::post('bookings',[BookingController::class,'store']);
    Route::get('bookings',[BookingController::class,'index']);
    Route::get('bookings/{booking}',[BookingController::class,'show']);
    Route::put('bookings/{booking}',[BookingController::class,'update']);
    Route::delete('bookings/{booking}',[BookingController::class,'destroy']);
});
