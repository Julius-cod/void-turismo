<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{       
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('destination_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('category', ['city_tour', 'cultural', 'beach', 'nature', 'food', 'adventure'])->default('city_tour');
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('image_url')->nullable();
            $table->json('gallery')->nullable();
            $table->json('includes')->nullable(); // Array of strings
            $table->decimal('duration_hours', 4, 1)->nullable();
            $table->integer('max_participants')->nullable();
            $table->string('meeting_point')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency')->default('USD');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });     
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('experiences');
    }
};
