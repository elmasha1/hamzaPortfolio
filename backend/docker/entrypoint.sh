#!/bin/sh
# Container entrypoint: bind Apache to the port Render assigns, bring the
# database up to date, warm the caches, then hand over to Apache as PID 1.
set -e

PORT="${PORT:-10000}"

# Render assigns $PORT at runtime, so it can't be baked into the image.
sed -ri "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Migrations run here rather than at build time: the database is only reachable
# from a running service, and a failure here stops the release instead of
# publishing a container that talks to a schema that doesn't exist yet.
echo "==> migrating"
php artisan migrate --force

# Cache after migrating, so a config change and a schema change land together.
# No view:cache — this API renders no Blade templates, so it has nothing to
# compile, and with `set -e` a missing resources/views killed the container
# before Apache ever started.
echo "==> warming caches"
php artisan config:cache
php artisan route:cache

echo "==> apache on :${PORT}"
exec apache2-foreground
