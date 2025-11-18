<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Poi;

class PoiPolicy
{
    public function create(User $user)
    {
        // qualquer user autenticado pode criar POI — ajustar se for só admin
        return (bool) $user;
    }

    public function update(User $user, Poi $poi)
    {
        // só admin pode editar POIs (mudável)
        return $user->is_admin;
    }

    public function delete(User $user, Poi $poi)
    {
        return $user->is_admin;
    }
}
