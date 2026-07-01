<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JourneyMilestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'order',
        'date_label',
        'title',
        'description',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'order' => 'integer',
    ];
}
