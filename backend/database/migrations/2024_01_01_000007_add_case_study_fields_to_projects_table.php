<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add engineering case-study fields so each project reads like real work:
     * Problem → Approach/Architecture → Key features → Challenges → Outcome.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->text('problem')->nullable()->after('description');
            $table->text('architecture_notes')->nullable()->after('problem');
            $table->json('key_features')->nullable()->after('architecture_notes');
            $table->text('challenges')->nullable()->after('key_features');
            $table->text('outcome')->nullable()->after('challenges');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['problem', 'architecture_notes', 'key_features', 'challenges', 'outcome']);
        });
    }
};
