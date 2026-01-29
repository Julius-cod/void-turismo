<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use App\Http\Resources\ExperienceResource;
use Illuminate\Support\Facades\Storage;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $query = Experience::with('destination');

        // Filtro de busca
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        // Filtro por destino
        if ($request->has('destination_id') && $request->destination_id) {
            $query->where('destination_id', $request->destination_id);
        }
        
        // Filtro por categoria
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }
        
        // Filtro por destaque
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = $request->get('per_page', 15);
        $paginated = $query->paginate($perPage);

        return ExperienceResource::collection($paginated)
            ->additional(['success' => true]);
    }

    public function show($slug)
    {
        $experience = Experience::with('destination', 'reviews')
            ->where('slug', $slug)
            ->firstOrFail();
        return new ExperienceResource($experience);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:experiences,name',
            'slug' => 'required|string|unique:experiences,slug',
            'destination_id' => 'nullable|exists:destinations,id',
            'category' => 'required|string|in:city_tour,cultural,beach,nature,food,adventure',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'includes' => 'nullable|string',
            'duration_hours' => 'nullable|numeric|min:0',
            'max_participants' => 'nullable|integer|min:1',
            'meeting_point' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_featured' => 'nullable|boolean',
            'image_file' => 'nullable|image|max:4096',
        ]);

        // Prepara os dados
        $data = $request->only([
            'name', 'slug', 'destination_id', 'category', 'price',
            'currency', 'short_description', 'description', 'image_url',
            'includes', 'duration_hours', 'max_participants', 'meeting_point',
            'latitude', 'longitude', 'is_featured'
        ]);

        // Converte includes de string para array
        if ($request->has('includes') && $request->includes) {
            $data['includes'] = array_map('trim', explode(',', $request->includes));
        }

        // Converte boolean
        if ($request->has('is_featured')) {
            $data['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
        }

        // Processa imagem
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('images', 'public');
            $data['image_url'] = "/storage/$path";
        }

        $experience = Experience::create($data);

        return new ExperienceResource($experience);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:experiences,name,' . $experience->id,
            'slug' => 'sometimes|string|unique:experiences,slug,' . $experience->id,
            'destination_id' => 'nullable|exists:destinations,id',
            'category' => 'sometimes|string|in:city_tour,cultural,beach,nature,food,adventure',
            'price' => 'sometimes|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'includes' => 'nullable|string',
            'duration_hours' => 'nullable|numeric|min:0',
            'max_participants' => 'nullable|integer|min:1',
            'meeting_point' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_featured' => 'nullable|boolean',
            'image_file' => 'nullable|image|max:4096',
        ]);

        // Prepara os dados
        $data = $validated;

        // Converte includes de string para array
        if (isset($data['includes'])) {
            $data['includes'] = array_map('trim', explode(',', $data['includes']));
        }

        // Converte boolean
        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN);
        }

        // Processa nova imagem
        if ($request->hasFile('image_file')) {
            // Remove imagem antiga se existir
            if ($experience->image_url) {
                $oldPath = str_replace('/storage/', '', $experience->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image_file')->store('images', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $experience->update($data);

        return new ExperienceResource($experience);
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();
        return response()->json(['success' => true, 'message' => 'Experience deleted']);
    }
}