<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:6',
            'full_name' => 'nullable|string'
        ]);

        $user = User::create([
            'id' => Str::uuid(),
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'full_name' => $request->full_name
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'token' => $user->createToken('api')->plainTextToken
            ],
            'message' => 'Registration successful'
        ], 201);
    }

    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    return response()->json([
        'success' => true,
        'data' => [
            'user' => new UserResource($user),
            'token' => $user->createToken('api')->plainTextToken
        ],
        'message' => 'Login successful'
    ]);
}

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user())
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'full_name' => 'nullable|string',
            'phone' => 'nullable|string',
            'preferred_language' => 'nullable|string'
        ]);

        $user = $request->user();
        $user->update($request->only('full_name', 'phone', 'preferred_language'));

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
            'message' => 'Profile updated successfully'
        ]);
    }
}
