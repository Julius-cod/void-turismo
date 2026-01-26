<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use App\Http\Resources\ExperienceResource;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $query = Experience::with('destination');

        if ($request->has('search')) {
            $query->where('name','like',"%{$request->search}%");
        }
        if ($request->has('destination_id')) {
            $query->where('destination_id',$request->destination_id);
        }
        if ($request->has('category')) {
            $query->where('category',$request->category);
        }
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured,FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = $request->get('per_page',15);
        return ExperienceResource::collection($query->paginate($perPage));
    }

    public function show($slug)
    {
        $experience = Experience::with('destination','reviews')->where('slug',$slug)->firstOrFail();
        return new ExperienceResource($experience);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required|string|unique:experiences,name',
            'slug'=>'required|string|unique:experiences,slug',
            'price'=>'required|numeric',
        ]);

        $experience = Experience::create($request->all());
        return new ExperienceResource($experience);
    }

    public function update(Request $request,$id)
    {
        $experience = Experience::findOrFail($id);
        $experience->update($request->all());
        return new ExperienceResource($experience);
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();
        return response()->json(['success'=>true,'message'=>'Experience deleted']);
    }
}
