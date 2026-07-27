<?php

namespace App\Models;

use App\Support\PublicCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JourneyMilestone extends Model
{
    use HasFactory;

    /** Any write invalidates the public API cache. */
    public static function booted(): void
    {
        static::saved(fn () => PublicCache::bust());
        static::deleted(fn () => PublicCache::bust());
    }

    protected $fillable = [
        'order',
        'date_label',
        'kind',
        'title',
        'description',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'order' => 'integer',
    ];
}
