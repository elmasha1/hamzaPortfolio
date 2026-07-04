<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Indexes for the columns the admin panel (and public lists) filter/sort on.
 * Tables are small today, but these keep list endpoints O(log n) as data grows.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->index(['read', 'created_at']);
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->index(['featured', 'order']);
        });
        Schema::table('posts', function (Blueprint $table) {
            $table->index(['published', 'published_at']);
        });
        Schema::table('journey_milestones', function (Blueprint $table) {
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['read', 'created_at']);
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['featured', 'order']);
        });
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['published', 'published_at']);
        });
        Schema::table('journey_milestones', function (Blueprint $table) {
            $table->dropIndex(['order']);
        });
    }
};
