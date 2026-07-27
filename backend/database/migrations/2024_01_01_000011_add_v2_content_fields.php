<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Portfolio v2 content fields.
 *
 * `projects.outcome_metric` — the short outcome figure the work index prints
 * at the right edge of each row ("−38% dispatch time"). The existing `outcome`
 * column stays as the long-form case-study paragraph.
 *
 * `journey_milestones.kind` — EDUCATION / INTERNSHIP / FREELANCE / PRODUCT, so
 * the timeline can show what sort of entry each milestone is at a glance.
 *
 * Both are nullable: every consumer keeps its null guard and the site renders
 * exactly as before until they are filled in from the dashboard.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('outcome_metric', 80)->nullable()->after('outcome');
        });

        Schema::table('journey_milestones', function (Blueprint $table) {
            $table->string('kind', 40)->nullable()->after('date_label');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('outcome_metric');
        });

        Schema::table('journey_milestones', function (Blueprint $table) {
            $table->dropColumn('kind');
        });
    }
};
