<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $r)
    {
        $data = $r->validate([
            'poi_id'=>'required|exists:pois,id',
            'start_at'=>'required|date',
            'end_at'=>'nullable|date',
            'notes'=>'nullable|string',
        ]);
        $data['user_id'] = $r->user()->id;
        $booking = Booking::create($data);
        return response()->json($booking,201);
    }

    public function index(Request $r)
    {
        return $r->user()->bookings()->with('poi')->get();
    }

    public function show(Request $r, Booking $booking)
{
    $this->authorize('view', $booking);
    return response()->json($booking->load('poi','user'));
}

public function update(Request $r, Booking $booking)
{
    $this->authorize('update', $booking);
    $data = $r->validate([
        'start_at'=>'sometimes|required|date',
        'end_at'=>'nullable|date',
        'status'=>'nullable|string',
        'notes'=>'nullable|string',
    ]);
    $booking->update($data);
    return response()->json($booking);
}

public function destroy(Request $r, Booking $booking)
{
    $this->authorize('delete', $booking);
    $booking->delete();
    return response()->json(null,204);
}


}
