<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Accommodation;
use App\Models\Experience;
use Illuminate\Http\Request;
use App\Http\Resources\BookingResource;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Booking::with(['accommodation.destination', 'experience.destination'])
            ->where('user_id', $user->id);
        
        // Filtros
        if ($request->has('status')) {
            $statuses = explode(',', $request->status);
            $query->whereIn('status', $statuses);
        }
        
        if ($request->has('type')) {
            if ($request->type === 'accommodation') {
                $query->whereNotNull('accommodation_id');
            } elseif ($request->type === 'experience') {
                $query->whereNotNull('experience_id');
            }
        }
        
        // Ordenação
        $query->orderBy('created_at', 'desc');
        
        // Paginação
        $perPage = $request->get('per_page', 15);
        $bookings = $query->paginate($perPage);
        
        return BookingResource::collection($bookings)
            ->additional(['success' => true]);
    }
    
    public function show($id)
{
    try {
        $booking = Booking::with([
            'user' => function($query) {
                $query->select('id', 'name', 'email');
            },
            'accommodation' => function($query) {
                $query->select('id', 'name', 'slug');
            },
            'experience' => function($query) {
                $query->select('id', 'name', 'slug');
            },
            'payment' => function($query) {
                $query->select('id', 'booking_id', 'status', 'amount', 'payment_method');
            }
        ])->findOrFail($id);

        // Verificar se o usuário tem permissão para ver esta reserva
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuário não autenticado'
            ], 401);
        }

        // Se não for admin, só pode ver suas próprias reservas
        if (!$user->isAdmin() && $booking->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Não autorizado'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
        
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Reserva não encontrada'
        ], 404);
    } catch (\Exception $e) {
        \Log::error('Erro ao buscar reserva: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro ao buscar reserva'
        ], 500);
    }
}



    public function store(Request $request)
    {
        $validated = $request->validate([
            'accommodation_id' => 'nullable|uuid|exists:accommodations,id',
            'experience_id' => 'nullable|uuid|exists:experiences,id',
            'check_in' => 'nullable|date|after_or_equal:today',
            'check_out' => 'nullable|date|after:check_in',
            'booking_date' => 'nullable|date|after_or_equal:today',
            'booking_time' => 'nullable|date_format:H:i',
            'guests' => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:500',
        ]);
        
        // Verificar se é accommodation ou experience
        if (!$validated['accommodation_id'] && !$validated['experience_id']) {
            return response()->json([
                'success' => false,
                'message' => 'Accommodation or Experience is required'
            ], 422);
        }
        
        // Calcular preço
        $totalPrice = $this->calculateTotalPrice($validated);
        
        // Criar booking
        $booking = Booking::create([
            'user_id' => $request->user()->id,
            ...$validated,
            'total_price' => $totalPrice,
            'currency' => 'USD', // Pegar da accommodation/experience
            'status' => 'pending',
        ]);
        
        return (new BookingResource($booking))
            ->additional(['success' => true, 'message' => 'Booking created successfully']);
    }
    
    private function calculateTotalPrice($data)
    {
        if ($data['accommodation_id']) {
            $accommodation = Accommodation::find($data['accommodation_id']);
            $nights = ceil((strtotime($data['check_out']) - strtotime($data['check_in'])) / 86400);
            return $accommodation->price_per_night * $nights * $data['guests'];
        } else {
            $experience = Experience::find($data['experience_id']);
            return $experience->price * $data['guests'];
        }
    }
    
    public function cancel($id, Request $request)
    {
        $booking = Booking::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();
            
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending bookings can be cancelled'
            ], 422);
        }
        
        $booking->update(['status' => 'cancelled']);
        
        return (new BookingResource($booking))
            ->additional(['success' => true, 'message' => 'Booking cancelled']);
    }
    
    public function checkAvailability(Request $request)
{
    \Log::info('Check availability request:', $request->all());
    
    $validated = $request->validate([
        'experience_id' => 'nullable|exists:experiences,id',
        'accommodation_id' => 'nullable|exists:accommodations,id',
        'booking_date' => 'nullable|date_format:Y-m-d',
        'check_in' => 'nullable|date_format:Y-m-d',
        'check_out' => 'nullable|date_format:Y-m-d|after:check_in',
        'guests' => 'required|integer|min:1',
    ]);

    try {
        // Verificar disponibilidade para experiência
        if (!empty($validated['experience_id'])) {
            $experience = Experience::find($validated['experience_id']);
            
            if (!$experience) {
                return response()->json([
                    'success' => false,
                    'message' => 'Experiência não encontrada'
                ], 404);
            }

            // Verificar se a experiência está ativa
            if (!$experience->is_active) {
                return response()->json([
                    'success' => true,
                    'available' => false,
                    'message' => 'Esta experiência não está disponível no momento'
                ]);
            }

            // Verificar capacidade máxima
            if ($validated['guests'] > $experience->max_participants) {
                return response()->json([
                    'success' => true,
                    'available' => false,
                    'message' => 'Número de participantes excede a capacidade máxima'
                ]);
            }

            // Verificar disponibilidade na data (simplificado)
            $bookingsCount = Booking::where('experience_id', $validated['experience_id'])
                ->whereDate('booking_date', $validated['booking_date'])
                ->whereIn('status', ['confirmed', 'pending'])
                ->count();

            $availableSpots = $experience->max_participants - $bookingsCount;
            
            return response()->json([
                'success' => true,
                'available' => $availableSpots >= $validated['guests'],
                'available_spots' => $availableSpots,
                'max_participants' => $experience->max_participants,
                'message' => $availableSpots >= $validated['guests'] 
                    ? 'Disponível para reserva' 
                    : 'Não há vagas suficientes para esta data'
            ]);
        }

        // Verificar disponibilidade para acomodação
        if (!empty($validated['accommodation_id'])) {
            $accommodation = Accommodation::find($validated['accommodation_id']);
            
            if (!$accommodation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Acomodação não encontrada'
                ], 404);
            }

            // Verificar se a acomodação está ativa
            if (!$accommodation->is_active) {
                return response()->json([
                    'success' => true,
                    'available' => false,
                    'message' => 'Esta acomodação não está disponível no momento'
                ]);
            }

            // Verificar capacidade
            if ($validated['guests'] > $accommodation->max_guests) {
                return response()->json([
                    'success' => true,
                    'available' => false,
                    'message' => 'Número de hóspedes excede a capacidade máxima'
                ]);
            }

            // Verificar disponibilidade nas datas
            $existingBookings = Booking::where('accommodation_id', $validated['accommodation_id'])
                ->where(function($query) use ($validated) {
                    $query->whereBetween('check_in', [$validated['check_in'], $validated['check_out']])
                          ->orWhereBetween('check_out', [$validated['check_in'], $validated['check_out']])
                          ->orWhere(function($q) use ($validated) {
                              $q->where('check_in', '<=', $validated['check_in'])
                                ->where('check_out', '>=', $validated['check_out']);
                          });
                })
                ->whereIn('status', ['confirmed', 'pending'])
                ->exists();

            return response()->json([
                'success' => true,
                'available' => !$existingBookings,
                'message' => !$existingBookings 
                    ? 'Disponível para reserva' 
                    : 'Acomodação já reservada para estas datas'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'É necessário especificar uma experiência ou acomodação'
        ], 400);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Dados inválidos',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Erro ao verificar disponibilidade: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro ao verificar disponibilidade'
        ], 500);
    }
}
    
    private function isAvailable($data)
    {
        // Implementar lógica real de disponibilidade
        // Verificar sobreposição de reservas, capacidade, etc.
        return true;
    }
}