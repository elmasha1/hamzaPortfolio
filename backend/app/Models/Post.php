<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'cover',
        'excerpt',
        'body',
        'tags',
        'read_time',
        'published',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'published' => 'boolean',
        'read_time' => 'integer',
        'published_at' => 'datetime',
    ];

    /** Route-model binding by slug for public post pages. */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** Auto-derive a unique slug from the title when none is provided. */
    public static function booted(): void
    {
        static::saving(function (Post $post) {
            if (blank($post->slug) && filled($post->title)) {
                $base = Str::slug($post->title);
                $slug = $base;
                $i = 1;
                while (static::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                    $slug = $base.'-'.$i++;
                }
                $post->slug = $slug;
            }
            if (blank($post->published_at)) {
                $post->published_at = now();
            }
        });
    }
}
