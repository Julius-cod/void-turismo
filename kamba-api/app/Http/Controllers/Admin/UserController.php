<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Filtro por busca
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por role
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Contar reservas
        $query->withCount('bookings');

        // Ordenação
        $query->orderBy('created_at', 'desc');

        // Paginação
        $perPage = $request->get('per_page', 15);
        $paginated = $query->paginate($perPage);

        return UserResource::collection($paginated)
            ->additional([
                'success' => true,
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total()
                ]
            ]);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:user,admin,moderator',
        ]);

        $user = User::findOrFail($id);
        
        // Não permitir que um admin remova seu próprio acesso admin
        if ($user->id === $request->user()->id && $request->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Não é possível remover seu próprio acesso de administrador'
            ], 422);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Role atualizada com sucesso'
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = User::findOrFail($id);
        
        // Não permitir deletar a si mesmo
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Não é possível excluir sua própria conta'
            ], 422);
        }
        
        // Não permitir deletar outros admins
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Não é possível excluir outros administradores'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuário excluído com sucesso'
        ]);
    }

    public function show($id)
    {
        $user = User::withCount('bookings')->findOrFail($id);
        return (new UserResource($user))
            ->additional(['success' => true]);
    }
}