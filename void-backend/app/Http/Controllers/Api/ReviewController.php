<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $r)
    {
        $data = $r->validate([
            'poi_id'=>'required|exists:pois,id',
            'rating'=>'required|integer|min:1|max:5',
            'comment'=>'nullable|string'
        ]);
        $data['user_id'] = $r->user()->id;
        $review = Review::create($data);
        return response()->json($review,201);
    }

    public function destroy(Request $r, Review $review)
    {
        // opcional: só o autor pode apagar
        if($r->user()->id !== $review->user_id) return response()->json(['message'=>'Forbidden'],403);
        $review->delete();
        return response()->json(null,204);
    }

    public function update(Request $r, Review $review)
    {
       $this->authorize('update', $review);
         $data = $r->validate([
        'rating'=>'required|integer|min:1|max:5',
        'comment'=>'nullable|string',
       ]);
       $review->update($data);
       return response()->json($review);
    }



}
