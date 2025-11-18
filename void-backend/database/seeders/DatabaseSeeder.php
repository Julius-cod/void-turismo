<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Poi;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
       User::factory()->create([
    'name'=>'Julius',
    'email'=>'julius@example.com',
    'password'=>Hash::make('secret123'),
    'is_admin'=>true
]);


        Poi::create([
            'title'=>'Quedas de Kalandula',
            'description'=>'Uma das maiores quedas de agua de Angola.',
            'category'=>'historical',
            'latitude'=>-9.043333,
            'longitude'=>17.517778,
            'address'=>'Kalandula, Malanje'
        ]);

        Poi::create([
            'title'=>'Museu Nacional de Antropologia',
            'description'=>'Museu com exposições sobre a cultura Angolana.',
            'category'=>'historical',
            'latitude'=>-8.839444,
            'longitude'=>13.234444,
            'address'=>'Luanda'
        ]);

        // exemplo de review
        Review::create([
            'user_id'=>1,
            'poi_id'=>1,
            'rating'=>5,
            'comment'=>'Lugar incrível, muito fotogênico!'
        ]);
    }
}
