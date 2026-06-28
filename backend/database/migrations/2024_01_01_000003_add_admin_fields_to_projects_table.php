<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add dashboard-managed fields: featured flag + manual ordering.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('featured')->default(false)->after('github_url');
            $table->unsignedInteger('order')->default(0)->after('featured');
            $table->string('role')->nullable()->after('order'); // "my role" in the project
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['featured', 'order', 'role']);
        });
    }
};
