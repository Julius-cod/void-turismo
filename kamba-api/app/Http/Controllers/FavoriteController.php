<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'destinations' => $user->favorites()->with('destination')->whereNotNull('destination_id')->get()->pluck('destination'),
                'accommodations' => $user->favorites()->with('accommodation')->whereNotNull('accommodation_id')->get()->pluck('accommodation'),
                'experiences' => $user->favorites()->with('experience')->whereNotNull('experience_id')->get()->pluck('experience'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'destination_id'=>'nullable|exists:destinations,id',
            'accommodation_id'=>'nullable|exists:accommodations,id',
            'experience_id'=>'nullable|exists:experiences,id',
        ]);

        $favorite = Favorite::updateOrCreate(
            array_merge(['user_id'=>$request->user()->id], $request->only('destination_id','accommodation_id','experience_id'))
        );

        return response()->json(['success'=>true,'data'=>$favorite,'message'=>'Added to favorites']);
    }

    public function destroy($id, Request $request)
    {
        $favorite = Favorite::where('user_id',$request->user()->id)->findOrFail($id);
        $favorite->delete();

        return response()->json(['success'=>true,'message'=>'Removed from favorites']);
    }
}
