<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where('full_name','like','%'.$request->search.'%')
                  ->orWhere('email','like','%'.$request->search.'%');
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->withCount('bookings')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page'=>$users->currentPage(),
                'last_page'=>$users->lastPage(),
                'per_page'=>$users->perPage(),
                'total'=>$users->total()
            ]
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate(['role'=>'required|in:user,admin,moderator']);
        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json(['success'=>true,'data'=>$user,'message'=>'Role updated']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['success'=>true,'message'=>'User deleted']);
    }
}
