# Render has no native PHP runtime, so the API ships as a container.
#
# Apache + mod_php rather than nginx + php-fpm: one process, no supervisor, no
# socket wiring — for an API whose traffic is one cached /bootstrap call per
# visit, the throughput difference is irrelevant and the moving parts are half.

FROM php:8.3-apache

# --- PHP extensions -----------------------------------------------------
# pdo_pgsql : Render's managed database is PostgreSQL
# gd        : the local image-optimisation fallback (used only when Cloudinary
#             is unconfigured, but the code path has to exist)
# zip       : composer needs it to install from dist archives
# opcache   : compiled-script cache; without it every request re-parses Laravel
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql pgsql gd zip opcache \
    && apt-get purge -y --auto-remove \
    && rm -rf /var/lib/apt/lists/*

# Production opcache settings. validate_timestamps=0 is safe because the code
# never changes inside a running container — a deploy builds a new image.
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.max_accelerated_files=10000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'realpath_cache_size=4096K'; \
        echo 'realpath_cache_ttl=600'; \
        echo 'expose_php=Off'; \
    } > /usr/local/etc/php/conf.d/zz-production.ini

# --- Apache -------------------------------------------------------------
# Serve Laravel's public/ directory, and allow its .htaccess to drive routing.
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && a2enmod rewrite headers \
    && printf '<Directory ${APACHE_DOCUMENT_ROOT}>\n    AllowOverride All\n    Require all granted\n</Directory>\n' \
        > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Dependencies first, so a code-only change doesn't re-resolve the whole tree.
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist

COPY . .

# The cache directories must exist before anything writes to them — the
# .dockerignore keeps their contents out of the image, and an excluded
# directory that is empty simply never gets created.
RUN composer dump-autoload --optimize --no-interaction \
    && mkdir -p storage/framework/cache/data \
                storage/framework/sessions \
                storage/framework/views \
                storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Render routes to whatever $PORT it assigns; the entrypoint binds Apache to it.
EXPOSE 10000
CMD ["entrypoint"]
