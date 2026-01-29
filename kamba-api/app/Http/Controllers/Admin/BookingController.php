<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Resources\BookingResource;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'accommodation', 'experience']);

        // Filtro por status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filtro por busca
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('accommodation', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('experience', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por tipo
        if ($request->has('type')) {
            if ($request->type === 'accommodation') {
                $query->whereNotNull('accommodation_id');
            } elseif ($request->type === 'experience') {
                $query->whereNotNull('experience_id');
            }
        }

        // Filtro por data
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Ordenação
        $query->orderBy('created_at', 'desc');

        // Paginação
        $perPage = $request->get('per_page', 15);
        $paginated = $query->paginate($perPage);

        return BookingResource::collection($paginated)
            ->additional(['success' => true]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,confirmed,cancelled,completed',
        ]);

        $booking = Booking::findOrFail($id);
        
        // Validação de transição de status
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['completed', 'cancelled'],
            'cancelled' => [],
            'completed' => [],
        ];

        if (!in_array($request->status, $validTransitions[$booking->status] ?? [])) {
            return response()->json([
                'success' => false,
                'message' => 'Transição de status inválida'
            ], 422);
        }

        $booking->update(['status' => $request->status]);

        return (new BookingResource($booking))
            ->additional(['success' => true, 'message' => 'Status atualizado com sucesso']);
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'accommodation', 'experience'])
            ->findOrFail($id);
        
        return (new BookingResource($booking))
            ->additional(['success' => true]);
    }
}