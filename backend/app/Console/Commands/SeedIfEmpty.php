<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Console\Command;
use Throwable;

/**
 * Seed a brand-new database, and only a brand-new one.
 *
 * Hosts without shell access (Render's free tier among them) have no way to
 * run `db:seed` by hand, so the first deploy against an empty database leaves
 * a site with no content and no admin account to fix it with — you cannot even
 * log in to add the first project.
 *
 * The guard is "no users AND no settings", which is true exactly once: before
 * the first seed. After that this is a no-op, so it can run on every boot
 * without ever overwriting content edited in the dashboard.
 */
class SeedIfEmpty extends Command
{
    protected $signature = 'app:seed-if-empty';

    protected $description = 'Seed the database, but only when it is completely empty';

    public function handle(): int
    {
        try {
            if (User::query()->exists() || Setting::query()->exists()) {
                $this->info('Database already has content — skipping seed.');

                return self::SUCCESS;
            }

            $this->info('Empty database — seeding initial content.');
            $this->call('db:seed', ['--force' => true]);
        } catch (Throwable $e) {
            // Never take the container down over seeding: a service that boots
            // with no content is recoverable, one that will not boot is not.
            $this->warn('Seed check failed, continuing anyway: '.$e->getMessage());
        }

        return self::SUCCESS;
    }
}
