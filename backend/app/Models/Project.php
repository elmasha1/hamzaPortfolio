<?php

namespace App\Models;

use App\Support\PublicCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /** Any write invalidates the public API cache. */
    public static function booted(): void
    {
        static::saved(fn () => PublicCache::bust());
        static::deleted(fn () => PublicCache::bust());
    }

    /**
     * Mass-assignable attributes.
     */
    protected $fillable = [
        'title',
        'description',
        'problem',
        'architecture_notes',
        'architecture',
        'key_features',
        'challenges',
        'outcome',
        'outcome_metric',
        'image',
        'tech_tags',
        'live_url',
        'github_url',
        'featured',
        'order',
        'role',
        'year',
        'team_size',
        'status',
    ];

    /**
     * Attribute casting. `tech_tags` / `key_features` are JSON ⇄ array;
     * `featured` is a boolean.
     */
    protected $casts = [
        'tech_tags' => 'array',
        'key_features' => 'array',
        'architecture' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
    ];
}
