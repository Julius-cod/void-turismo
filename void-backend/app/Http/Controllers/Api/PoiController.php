<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Poi;
use Illuminate\Http\Request;

class PoiController extends Controller
{
    public function index(Request $r)
    {
        $q = Poi::query();
        if($r->has('category')) $q->where('category',$r->category);
        if($r->has('search')) $q->where('title','like','%'.$r->search.'%');
        return $q->with('reviews')->paginate(20);
    }

    public function show(Poi $poi)
    {
        return $poi->load('reviews.user');
    }

    public function store(Request $r)
{
    $this->authorize('create', Poi::class);
    $data = $r->validate([
        'title'=>'required|string',
        'category'=>'required|string',
        'description'=>'nullable|string',
        'latitude'=>'nullable|numeric',
        'longitude'=>'nullable|numeric',
        'address'=>'nullable|string',
        'phone'=>'nullable|string',
        'website'=>'nullable|url',
        'photo'=>'nullable|image|max:2048',
        'featured'=>'nullable|boolean'
    ]);
    if($r->hasFile('photo')){
        $path = $r->file('photo')->store('pois','public');
        $data['photo'] = $path;
    }
    $poi = Poi::create($data);
    return response()->json($poi,201);
}

public function update(Request $r, Poi $poi)
{
    $this->authorize('update', $poi);

    $data = $r->validate([
        'title' => 'sometimes|required|string',
        'category' => 'sometimes|required|string',
        'description' => 'nullable|string',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
        'address' => 'nullable|string',
        'phone' => 'nullable|string',
        'website' => 'nullable|url',
        'photo' => 'nullable|image|max:2048',
        'featured' => 'nullable|boolean'
    ]);

    if ($r->hasFile('photo')) {
        $path = $r->file('photo')->store('pois', 'public');
        $data['photo'] = $path;
    }

    $poi->update($data);

    return response()->json($poi);
}


    public function destroy(Poi $poi)
    {
        $poi->delete();
        return response()->json(null,204);
    }
}
