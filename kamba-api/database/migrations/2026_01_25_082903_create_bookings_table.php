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
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('accommodation_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('experience_id')->nullable()->constrained()->nullOnDelete();
            $table->date('check_in')->nullable();
            $table->date('check_out')->nullable();
            $table->date('booking_date')->nullable(); // For experiences
            $table->integer('guests')->default(1);
            $table->decimal('total_price', 10, 2);
            $table->string('currency')->default('USD');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->text('special_requests')->nullable();
            $table->string('stripe_payment_id')->nullable();
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
        Schema::dropIfExists('bookings');
    }
};
