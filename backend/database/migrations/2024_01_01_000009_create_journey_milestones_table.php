<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journey_milestones', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('order')->default(0);
            $table->string('date_label')->nullable();   // e.g. "2021" or "Present"
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('tags')->nullable();            // e.g. ["React","Laravel"]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journey_milestones');
    }
};
