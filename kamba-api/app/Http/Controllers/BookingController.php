<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Http\Resources\BookingResource;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['accommodation','experience','user']);

        if($request->has('status')) $query->where('status',$request->status);
        if($request->has('user_id')) $query->where('user_id',$request->user_id);
        if($request->has('from_date')) $query->whereDate('created_at','>=',$request->from_date);
        if($request->has('to_date')) $query->whereDate('created_at','<=',$request->to_date);

        return BookingResource::collection($query->paginate($request->get('per_page',15)));
    }

    public function updateStatus($id, Request $request)
    {
        $request->validate(['status'=>'required|in:pending,confirmed,cancelled,completed']);

        $booking = Booking::findOrFail($id);
        $booking->status = $request->status;
        $booking->save();

        return new BookingResource($booking);
    }
}
