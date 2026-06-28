<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    /**
     * Mass-assignable attributes for contact submissions.
     */
    protected $fillable = [
        'name',
        'email',
        'message',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean',
    ];
}
