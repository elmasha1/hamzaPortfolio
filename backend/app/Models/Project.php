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
        'image',
        'tech_tags',
        'live_url',
        'github_url',
        'featured',
        'order',
        'role',
    ];

    /**
     * Attribute casting. `tech_tags` is stored as JSON and exposed to the API
     * as a plain array; `featured` as a boolean.
     */
    protected $casts = [
        'tech_tags' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
    ];
}
