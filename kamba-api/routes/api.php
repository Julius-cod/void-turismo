<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\AccommodationController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;


Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});


//rotas de destino

Route::get('destinations',[DestinationController::class,'index']);
Route::get('destinations/{slug}',[DestinationController::class,'show']);


// Admin
Route::middleware(['auth:sanctum','is_admin'])->prefix('admin')->group(function () {
    Route::post('destinations', [DestinationController::class, 'store']);
    Route::put('destinations/{id}', [DestinationController::class, 'update']);
    Route::delete('destinations/{id}', [DestinationController::class, 'destroy']);
});


//rotas de acomodations

// Public
Route::get('accommodations',[AccommodationController::class,'index']);
Route::get('accommodations/{slug}',[AccommodationController::class,'show']);

// Admin
Route::middleware(['auth:sanctum','is_admin'])->prefix('admin')->group(function () {
    Route::post('accommodations',[AccommodationController::class,'store']);
    Route::put('accommodations/{id}',[AccommodationController::class,'update']);
    Route::delete('accommodations/{id}',[AccommodationController::class,'destroy']);
});

// rotas de experiences

// Public
Route::get('experiences',[ExperienceController::class,'index']);
Route::get('experiences/{slug}',[ExperienceController::class,'show']);

// Admin
Route::middleware(['auth:sanctum','is_admin'])->prefix('admin')->group(function () {
    Route::post('experiences',[ExperienceController::class,'store']);
    Route::put('experiences/{id}',[ExperienceController::class,'update']);
    Route::delete('experiences/{id}',[ExperienceController::class,'destroy']);
});

//rotas de booking(reserva)

// Usuário
Route::middleware('auth:sanctum')->group(function(){
    Route::get('bookings',[BookingController::class,'index']);
    Route::get('bookings/{id}',[BookingController::class,'show']);
    Route::post('bookings',[BookingController::class,'store']);
    Route::put('bookings/{id}/cancel',[BookingController::class,'cancel']);
});

// Admin
Route::middleware(['auth:sanctum','is_admin'])->prefix('admin')->group(function(){
    Route::get('bookings',[AdminBookingController::class,'index']);
    Route::put('bookings/{id}/status',[AdminBookingController::class,'updateStatus']);
});

//rota dos favoritos do usuario


Route::middleware('auth:sanctum')->group(function(){
    Route::get('favorites',[FavoriteController::class,'index']);
    Route::post('favorites',[FavoriteController::class,'store']);
    Route::delete('favorites/{id}',[FavoriteController::class,'destroy']);
});

//rotas de reviews do usuario


Route::get('reviews',[ReviewController::class,'index']);
Route::middleware('auth:sanctum')->group(function(){
    Route::post('reviews',[ReviewController::class,'store']);
});

//rotas do user admin

Route::prefix('admin')->middleware(['auth:sanctum','is_admin'])->group(function(){
    Route::get('users',[UserController::class,'index']);
    Route::put('users/{id}/role',[UserController::class,'updateRole']);
    Route::delete('users/{id}',[UserController::class,'destroy']);
});

Route::prefix('admin')->middleware(['auth:sanctum','is_admin'])->group(function(){
    Route::get('stats',[DashboardController::class,'stats']);
});