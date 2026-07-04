<?php

namespace App\Models;

use App\Support\PublicCache;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array', // JSON in DB ⇄ PHP value (string/number/array/object)
    ];

    /**
     * Get a setting value by key (with optional default).
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Create or update a setting. Any write invalidates the public API cache.
     */
    public static function put(string $key, $value): self
    {
        $setting = static::updateOrCreate(['key' => $key], ['value' => $value]);
        PublicCache::bust();

        return $setting;
    }

    /**
     * Return all settings as a flat key => value map (for the public API).
     */
    public static function map(): array
    {
        return static::all()->pluck('value', 'key')->toArray();
    }
}
