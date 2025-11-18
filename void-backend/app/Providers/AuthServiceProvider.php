<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Poi;
use App\Models\Review;
use App\Models\Booking;
use App\Policies\PoiPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\BookingPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::policy(Poi::class, PoiPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
        Gate::policy(Booking::class, BookingPolicy::class);
    }
}
