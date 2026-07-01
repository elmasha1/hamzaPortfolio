<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * Mass-assignable attributes.
     */
    protected $fillable = [
        'title',
        'description',
        'problem',
        'architecture_notes',
        'key_features',
        'challenges',
        'outcome',
        'image',
        'tech_tags',
        'live_url',
        'github_url',
        'featured',
        'order',
        'role',
    ];

    /**
     * Attribute casting. `tech_tags` / `key_features` are JSON ⇄ array;
     * `featured` is a boolean.
     */
    protected $casts = [
        'tech_tags' => 'array',
        'key_features' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
    ];
}
