<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Case-study datasheet fields.
 *
 * The v2 case study opens with a hairline spec table — Role / Year / Stack /
 * Team size / Status / Live / Repo — that scans in three seconds, and renders
 * block 04 as a hairline column diagram built from `architecture`.
 *
 * All four are nullable and every consumer hides its row or block when the
 * value is missing, so an un-filled dashboard renders a complete page.
 *
 * `architecture` shape: [{ "layer": "Frontend", "items": ["React", "Vite"] }, …]
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('year', 20)->nullable()->after('role');
            $table->string('team_size', 40)->nullable()->after('year');
            $table->string('status', 40)->nullable()->after('team_size');
            $table->json('architecture')->nullable()->after('architecture_notes');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['year', 'team_size', 'status', 'architecture']);
        });
    }
};
