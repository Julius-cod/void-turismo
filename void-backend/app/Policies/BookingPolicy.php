<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Booking;

class BookingPolicy
{
    public function update(User $user, Booking $booking)
    {
        return $user->id === $booking->user_id || $user->is_admin;
    }

    public function delete(User $user, Booking $booking)
    {
        return $user->id === $booking->user_id || $user->is_admin;
    }

    public function view(User $user, Booking $booking)
    {
        return $user->id === $booking->user_id || $user->is_admin;
    }
}
