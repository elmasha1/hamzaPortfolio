<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A case study can lead with a short silent screen-recording instead of a
 * still. `image` stays required-ish as the poster frame and the work-index
 * thumbnail: the video only ever replaces the hero on /work/:id, and falls
 * back to the image everywhere it isn't set.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('video_url', 500)->nullable()->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('video_url');
        });
    }
};
