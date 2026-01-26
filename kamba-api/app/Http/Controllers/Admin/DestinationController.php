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

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        if ($request->has('region')) {
            $query->where('region', $request->region);
        }
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = $request->get('per_page', 15);
        return DestinationResource::collection($query->paginate($perPage));
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
        ]);

        $destination = Destination::create(
            $request->only([
                'name',
                'slug',
                'region',
                'short_description',
                'description',
                'image_url',
                'latitude',
                'longitude',
                'is_featured',
            ])
        );
        return new DestinationResource($destination);
    }

    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);
        $destination->update($request->all());
        return new DestinationResource($destination);
    }

    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();
        return response()->json(['success' => true, 'message' => 'Destination deleted']);
    }
}
