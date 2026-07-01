<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('cover')->nullable();       // cover image URL
            $table->string('excerpt', 500)->nullable();
            $table->longText('body')->nullable();       // markdown / plain text
            $table->json('tags')->nullable();           // e.g. ["React","Laravel"]
            $table->unsignedSmallInteger('read_time')->default(3); // minutes
            $table->boolean('published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
