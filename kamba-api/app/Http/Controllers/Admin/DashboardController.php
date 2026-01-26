<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Destination, Accommodation, Experience, Booking, User};
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $recentBookings = Booking::with('user','accommodation','experience')
                            ->latest()->take(5)->get();

        $popularDestinations = Destination::withCount('accommodations','experiences')
                                    ->orderBy('review_count','desc')
                                    ->take(5)->get();

        return response()->json([
            'success'=>true,
            'data'=>[
                'destinations_count'=>Destination::count(),
                'accommodations_count'=>Accommodation::count(),
                'experiences_count'=>Experience::count(),
                'bookings_count'=>Booking::count(),
                'users_count'=>User::count(),
                'revenue_total'=>Booking::sum('total_price'),
                'revenue_this_month'=>Booking::whereMonth('created_at', now()->month)->sum('total_price'),
                'recent_bookings'=>$recentBookings,
                'popular_destinations'=>$popularDestinations
            ]
        ]);
    }
}
