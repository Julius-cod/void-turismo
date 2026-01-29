<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Illuminate\Http\Request;
use App\Http\Resources\AccommodationResource;
use Illuminate\Support\Facades\Storage;

class AccommodationController extends Controller
{
    public function index(Request $request)
    {
        $query = Accommodation::with('destination');

        // Filtro de busca por nome
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Filtro por destino
        if ($request->has('destination_id') && $request->destination_id) {
            $query->where('destination_id', $request->destination_id);
        }

        // Filtro por tipo
        if ($request->has('listing_type') && $request->listing_type) {
            $query->where('listing_type', $request->listing_type);
        }

        // Filtro por destaque
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
        }

        // Filtro por verificado
        if ($request->has('is_verified')) {
            $query->where('is_verified', filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN));
        }

        // Paginação
        $perPage = $request->get('per_page', 15);
        $paginated = $query->paginate($perPage);

        return AccommodationResource::collection($paginated)
            ->additional([
                'success' => true,
            ]);
    }

    public function show($slug)
    {
        $accommodation = Accommodation::with('destination', 'reviews')
            ->where('slug', $slug)
            ->firstOrFail();
        return new AccommodationResource($accommodation);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:accommodations,name',
            'slug' => 'required|string|unique:accommodations,slug',
            'destination_id' => 'nullable|exists:destinations,id', // Alterado de uuid para exists
            'listing_type' => 'required|string|in:hotel,lodge,guesthouse,hostel,apartment',
            'price_per_night' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'amenities' => 'nullable|string', // Alterado de array para string
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'max_guests' => 'nullable|integer|min:1',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_featured' => 'nullable|boolean',
            'is_verified' => 'nullable|boolean',
            'image_file' => 'nullable|image|max:4096',
        ]);

        // Prepara os dados
        $data = $request->only([
            'name', 'slug', 'destination_id', 'listing_type', 'price_per_night',
            'currency', 'short_description', 'description', 'address',
            'bedrooms', 'bathrooms', 'max_guests', 'latitude', 'longitude',
            'is_featured', 'is_verified'
        ]);

        // Converte amenities de string para array
        if ($request->has('amenities') && $request->amenities) {
            $data['amenities'] = array_map('trim', explode(',', $request->amenities));
        }

        // Converte boolean de string para boolean
        if ($request->has('is_featured')) {
            $data['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('is_verified')) {
            $data['is_verified'] = filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN);
        }

        // Processa imagem
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('images', 'public');
            $data['image_url'] = "/storage/$path";
        }

        $accommodation = Accommodation::create($data);

        return new AccommodationResource($accommodation);
    }

    public function update(Request $request, $id)
    {
        $accommodation = Accommodation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:accommodations,name,' . $accommodation->id,
            'slug' => 'sometimes|string|unique:accommodations,slug,' . $accommodation->id,
            'destination_id' => 'nullable|exists:destinations,id', // Alterado de uuid para exists
            'listing_type' => 'sometimes|string|in:hotel,lodge,guesthouse,hostel,apartment',
            'price_per_night' => 'sometimes|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'amenities' => 'nullable|string', // Alterado de array para string
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'max_guests' => 'nullable|integer|min:1',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_featured' => 'nullable|boolean',
            'is_verified' => 'nullable|boolean',
            'image_file' => 'nullable|image|max:4096',
        ]);

        // Prepara os dados
        $data = $validated;

        // Converte amenities de string para array
        if (isset($data['amenities'])) {
            $data['amenities'] = array_map('trim', explode(',', $data['amenities']));
        }

        // Converte boolean de string para boolean
        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN);
        }

        if (isset($data['is_verified'])) {
            $data['is_verified'] = filter_var($data['is_verified'], FILTER_VALIDATE_BOOLEAN);
        }

        // Processa nova imagem
        if ($request->hasFile('image_file')) {
            // Remove imagem antiga se existir
            if ($accommodation->image_url) {
                $oldPath = str_replace('/storage/', '', $accommodation->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image_file')->store('images', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $accommodation->update($data);

        return new AccommodationResource($accommodation);
    }

    public function destroy($id)
    {
        $accommodation = Accommodation::findOrFail($id);
        $accommodation->delete();
        return response()->json(['success' => true, 'message' => 'Accommodation deleted']);
    }
}