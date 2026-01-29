<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use App\Http\Resources\DestinationResource;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    
public function index(Request $request)
{
    $query = Destination::query();

    // Filtro de busca por nome
    if ($request->has('search') && $request->search) {
        $query->where('name', 'like', "%{$request->search}%");
    }

    // Filtro por região
    if ($request->has('region') && $request->region) {
        $query->where('region', $request->region);
    }

    // Filtro por destaque
    if ($request->has('is_featured')) {
        $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
    }

    // Paginação
    $perPage = $request->get('per_page', 15);
    $paginated = $query->paginate($perPage);

    // Retorna collection com success + meta
    return DestinationResource::collection($paginated)
        ->additional([
            'success' => true,
        ]);
}




    public function show($slug)
    {
        $destination = Destination::where('slug', $slug)->firstOrFail();
        return new DestinationResource($destination);
    }

   public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|unique:destinations,name',
        'slug' => 'required|string|unique:destinations,slug',
        'image_file' => 'nullable|image|max:2048', // aceita jpeg, png etc
    ]);

    // Se enviou arquivo, salva e seta image_url
    if ($request->hasFile('image_file')) {
        $path = $request->file('image_file')->store('images', 'public');
        $request->merge(['image_url' => "/storage/$path"]);
    }

    $destination = Destination::create($request->only([
        'name','slug','region','short_description','description',
        'image_url','latitude','longitude','is_featured'
    ]));

    return new DestinationResource($destination);
}

public function update(Request $request, $id)
{
    $destination = Destination::findOrFail($id);

    // Validação dos campos
    $data = $request->validate([
        'name' => 'sometimes|string|unique:destinations,name,' . $destination->id,
        'slug' => 'sometimes|string|unique:destinations,slug,' . $destination->id,
        'region' => 'nullable|string',
        'short_description' => 'nullable|string',
        'description' => 'nullable|string',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
        'is_featured' => 'boolean',
    ]);

    // Se veio um arquivo novo, salva e atualiza image_url
    if ($request->hasFile('image_file')) {
        $path = $request->file('image_file')->store('images', 'public');
        $data['image_url'] = '/storage/' . $path;
    }

    $destination->update($data);

    return new DestinationResource($destination);
}



    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();
        return response()->json(['success' => true, 'message' => 'Destination deleted']);
    }

    public function featured()
{
    return DestinationResource::collection(
        Destination::where('is_featured', true)->limit(6)->get()
    )->additional(['success' => true]);
}

}
