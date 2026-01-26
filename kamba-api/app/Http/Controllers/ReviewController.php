<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'accommodation_id'=>'nullable|exists:accommodations,id',
            'experience_id'=>'nullable|exists:experiences,id'
        ]);

        $query = Review::query();
        if($request->accommodation_id) $query->where('accommodation_id',$request->accommodation_id);
        if($request->experience_id) $query->where('experience_id',$request->experience_id);

        return response()->json(['success'=>true,'data'=>$query->with('user')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'accommodation_id'=>'nullable|exists:accommodations,id',
            'experience_id'=>'nullable|exists:experiences,id',
            'rating'=>'required|integer|min:1|max:5',
            'comment'=>'nullable|string'
        ]);

        $review = Review::create(array_merge($request->all(), ['user_id'=>$request->user()->id]));

        return response()->json(['success'=>true,'data'=>$review,'message'=>'Review created']);
    }
}
