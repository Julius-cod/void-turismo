<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Illuminate\Http\Request;
use App\Http\Resources\AccommodationResource;

class AccommodationController extends Controller
{
    public function index(Request $request)
    {
        $query = Accommodation::with('destination');

        if ($request->has('search')) {
            $query->where('name','like',"%{$request->search}%");
        }
        if ($request->has('destination_id')) {
            $query->where('destination_id',$request->destination_id);
        }
        if ($request->has('listing_type')) {
            $query->where('listing_type',$request->listing_type);
        }
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured,FILTER_VALIDATE_BOOLEAN));
        }
        if ($request->has('is_verified')) {
            $query->where('is_verified', filter_var($request->is_verified,FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = $request->get('per_page',15);
        return AccommodationResource::collection($query->paginate($perPage));
    }

    public function show($slug)
    {
        $accommodation = Accommodation::with('destination','reviews')->where('slug',$slug)->firstOrFail();
        return new AccommodationResource($accommodation);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required|string|unique:accommodations,name',
            'slug'=>'required|string|unique:accommodations,slug',
            'price_per_night'=>'required|numeric',
        ]);

        $accommodation = Accommodation::create($request->all());
        return new AccommodationResource($accommodation);
    }

    public function update(Request $request,$id)
    {
        $accommodation = Accommodation::findOrFail($id);
        $accommodation->update($request->all());
        return new AccommodationResource($accommodation);
    }

    public function destroy($id)
    {
        $accommodation = Accommodation::findOrFail($id);
        $accommodation->delete();
        return response()->json(['success'=>true,'message'=>'Accommodation deleted']);
    }
}
